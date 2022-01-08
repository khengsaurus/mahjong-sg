import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
	Auth,
	createUserWithEmailAndPassword,
	deleteUser,
	indexedDBLocalPersistence,
	initializeAuth,
	signInWithEmailAndPassword,
	User as FirebaseUser,
	UserCredential
} from 'firebase/auth';
import { child, Database, get, getDatabase, onValue, ref, set } from 'firebase/database';
import {
	addDoc,
	collection,
	CollectionReference,
	deleteDoc,
	doc,
	DocumentData,
	Firestore,
	getDocFromServer,
	getDocsFromServer,
	getFirestore,
	limit,
	onSnapshot,
	orderBy,
	query,
	runTransaction,
	setDoc,
	Unsubscribe,
	updateDoc,
	where
} from 'firebase/firestore';
import moment from 'moment';
import { env } from 'process';
import {
	BackgroundColor,
	EEvent,
	FBCollection,
	FBDatabase,
	PaymentType,
	Platform,
	Size,
	TableColor,
	TileColor
} from 'shared/enums';
import { HandPoint, ScoringHand } from 'shared/handEnums';
import { ErrorMessage, InfoMessage } from 'shared/messages';
import { Game, User } from 'shared/models';
import FirebaseConfig from 'shared/service/FirebaseConfig';
import { shuffle } from 'shared/util';
import { gameToObj, playerToObj, userToObj } from 'shared/util/parsers';

export class FirebaseService {
	private user: FirebaseUser;
	private app: FirebaseApp;
	private auth: Auth;
	private db: Database;
	private fs: Firestore;
	private usersRef: CollectionReference;
	private gamesRef: CollectionReference;
	private logsRef: CollectionReference;
	private isMobileConnected: boolean; // This will only be true on mobile
	public isServiceConnected: boolean;

	constructor() {
		this.initApp().then(res => {
			if (res) {
				this.initAuth();
				this.fs = getFirestore(this.app);
				this.db = getDatabase(this.app, FirebaseConfig.databaseUrl);
				this.usersRef = collection(this.fs, FBCollection.USERREPR);
				this.gamesRef = collection(this.fs, FBCollection.GAMES);
				this.logsRef = collection(this.fs, FBCollection.LOGS);
				this.initFBConnectionWatcher();
				if (env.REACT_APP_PLATFORM === Platform.MOBILE) {
					this.initDeviceNetworkWatcher();
				}
			}
		});
	}

	async initApp(): Promise<boolean> {
		return new Promise(resolve => {
			try {
				this.app = initializeApp(FirebaseConfig);
				console.info(InfoMessage.FIREBASE_INIT_SUCCESS);
				resolve(true);
			} catch (err) {
				console.error(InfoMessage.FIREBASE_INIT_ERROR);
				resolve(false);
			}
		});
	}

	initDeviceNetworkWatcher() {
		if (Capacitor.isPluginAvailable('Network')) {
			Network.addListener(EEvent.NETWORK_CHANGE, status => {
				this.isMobileConnected = status.connected || false;
			});
		}
	}

	// https://firebase.google.com/docs/database/web/offline-capabilities
	initFBConnectionWatcher() {
		let timeoutRef: NodeJS.Timeout = null;
		const connectedRef = ref(this.db, '.info/connected');

		onValue(connectedRef, snap => {
			clearTimeout(timeoutRef);
			timeoutRef = setTimeout(() => {
				if (snap.val() === true && this.isMobileConnected) {
					this.isServiceConnected = true;
				} else {
					this.isServiceConnected = false;
				}
			}, 300);
		});
	}

	/**
	 * @see https://github.com/firebase/firebase-js-sdk/issues/5552
	 */
	async initAuth() {
		if (Capacitor.isNativePlatform) {
			this.auth = initializeAuth(this.app, {
				persistence: indexedDBLocalPersistence
			});
		} else {
			this.auth = initializeAuth(this.app);
		}
		this.auth.onAuthStateChanged(user => {
			console.info(user ? InfoMessage.FIREBASE_USER_YES : InfoMessage.FIREBASE_USER_NO);
			this.user = user;
		});
	}

	userAuthenticated() {
		return !!this.auth.currentUser;
	}

	/* ------------------------- Auth related ------------------------- */

	async authRegisterEmailPass(email: string, password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			createUserWithEmailAndPassword(this.auth, email, password)
				.then((values: UserCredential) => {
					resolve(values.user.email);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	/**
	 * @throws ErrorMessage.LOGIN_ERROR
	 */
	async authLoginEmailPass(email: string, password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			signInWithEmailAndPassword(this.auth, email, password)
				.then((values: UserCredential) => {
					if (email === values.user.email) {
						resolve(email);
					}
				})
				.catch(err => {
					console.error(`FirebaseService.authLoginEmailPass failed with err: ${err.message}`);
					reject(ErrorMessage.LOGIN_ERROR);
				});
		});
	}

	authLogout() {
		this.user = null;
		this.auth.signOut();
	}

	authDeleteCurrentUser(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (!!this.auth.currentUser) {
				try {
					deleteUser(this.auth.currentUser).then(() => resolve(true));
				} catch (err) {
					reject(err);
				}
			} else {
				resolve(false);
			}
		});
	}

	/* ------------------------- User related ------------------------- */

	pairEmailToUsername(username: string, email: string): Promise<boolean> {
		return new Promise(resolve => {
			try {
				set(ref(this.db, `${FBDatabase.USERS}/${username}`), email).then(() => resolve(true));
			} catch (err) {
				console.error(err);
				resolve(false);
			}
		});
	}

	/**
	 * @throws if no userEmail, ErrorMessage.LOGIN_ERROR, else ErrorMessage.TRY_AGAIN
	 */
	getEmailFromUsername(username: string): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				get(child(ref(this.db), `users/${username}`)).then(snapshot => {
					if (snapshot.exists()) {
						resolve(snapshot.val());
					} else {
						reject(new Error(ErrorMessage.LOGIN_ERROR));
					}
				});
			} catch (err) {
				console.error(err);
				reject(new Error(ErrorMessage.TRY_AGAIN));
			}
		});
	}

	async registerUserEmail(uN: string, email: string): Promise<boolean> {
		return new Promise(resolve => {
			try {
				addDoc(this.usersRef, {
					uN,
					email,
					pUrl: '',
					hSz: Size.MEDIUM,
					tSz: Size.MEDIUM,
					cSz: Size.MEDIUM,
					bgC: BackgroundColor.BROWN,
					tC: TableColor.GREEN,
					tBC: TileColor.GREEN
					// tileFrontColor: TileColor.LIGHT,
					// decoration: Decoration.DEFAULT,
				});
				resolve(true);
			} catch (err) {
				console.error('FirebaseService - user was not created: ', +err);
				resolve(false);
			}
		});
	}

	async isUsernameAvail(uN: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const q = query(this.usersRef, where('uN', '==', uN));
				const querySnapshot = await getDocsFromServer(q);
				if (querySnapshot?.empty) {
					resolve(true);
				} else {
					resolve(false);
				}
			} catch (err) {
				console.error(err);
				reject(new Error(ErrorMessage.UNABLE_TO_CONNET));
			}
		});
	}

	async getUserReprByEmail(email: string): Promise<Object> {
		return new Promise(async (resolve, reject) => {
			const res = [];
			try {
				const q = query(this.usersRef, where('email', '==', email), limit(1));
				const querySnapshot = await getDocsFromServer(q);
				querySnapshot.forEach(doc => {
					res.push({ id: doc.id, ...doc.data() });
				});
				resolve(res[0] || null);
			} catch (err) {
				console.error(err);
				reject(err);
			}
		});
	}

	async searchUser(partUsername: string, exclude: string): Promise<DocumentData[]> {
		try {
			const users: DocumentData[] = [];
			const q = query(
				this.usersRef,
				where('uN', '!=', exclude),
				where('uN', '>=', partUsername),
				where('uN', '<=', partUsername + '\uf8ff'),
				limit(3)
			);
			const querySnapshot = await getDocsFromServer(q);
			querySnapshot.forEach(doc => {
				users.push({ id: doc.id, ...doc.data() });
			});
			return users;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async updateUser(userId: string, keyVals: object): Promise<void> {
		try {
			const userRef = doc(this.usersRef, userId);
			await updateDoc(userRef, { ...keyVals });
		} catch (err) {
			console.error(err);
		}
	}

	async restoreUser(user: User) {
		this.pairEmailToUsername(user.uN, user.email);
		setDoc(doc(this.usersRef, user.id), userToObj(user));
	}

	async deleteUserAccount(user): Promise<boolean> {
		const { id, uN } = user;
		return new Promise((resolve, reject) =>
			this.pairEmailToUsername(uN, '-')
				.then(() => deleteDoc(doc(this.usersRef, id)).then(() => resolve(true)))
				.catch(err => reject(err))
		);
	}

	/* ------------------------- User-game related ------------------------- */

	async listenInvitesSnapshot(user: User, observer: any): Promise<Unsubscribe> {
		return new Promise((resolve, reject) => {
			try {
				const q = query(
					this.gamesRef,
					where('es', 'array-contains', user.email),
					// where('on', '==', true),
					orderBy('cA', 'desc')
					// limit(5)
				);
				resolve(onSnapshot(q, observer));
			} catch (err) {
				reject(err);
			}
		});
	}

	async cleanupFinishedGames(userEmail: string) {
		if (userEmail) {
			const q = query(this.gamesRef, where('es', 'array-contains', userEmail));
			const games = await getDocsFromServer(q);
			games.forEach(g => {
				let lastUpdated = g.data()?.up;
				if (lastUpdated && lastUpdated?.toDate) {
					lastUpdated = lastUpdated?.toDate() as Date;
					if (moment.duration(moment(moment()).diff(lastUpdated)).asHours() > 24) {
						deleteDoc(doc(this.gamesRef, g.id)).catch(err => {
							console.error(err);
						});
					}
				}
			});
		}
	}

	/* ------------------------- Game related ------------------------- */

	async getGameById(gameId?: string) {
		try {
			const gameRef = doc(this.gamesRef, gameId);
			await getDocFromServer(gameRef).then(doc => {
				return { id: doc.id, ...doc.data() };
			});
		} catch (err) {
			console.error(err);
		}
	}

	async createGame(
		user: User,
		ps: User[],
		random?: boolean,
		gMinPx = HandPoint.MIN,
		gMaxPx = HandPoint.MAX,
		mHu = false,
		sHs = [ScoringHand.ALL],
		pay = PaymentType.SHOOTER
	): Promise<Game> {
		const shuffledPlayers: User[] = random ? shuffle(ps) : ps;
		let es: string[] = [];
		let pS: string = '';
		shuffledPlayers.forEach(player => {
			es.push(player.email);
			pS = pS === '' ? player.uN : pS + `, ${player.uN}`;
		});
		return new Promise((resolve, reject) => {
			let cA = new Date();
			let gameId = '';
			try {
				addDoc(this.gamesRef, {
					cO: user.uN,
					cA,
					pS,
					es,
					on: true,
					up: cA,
					dF: null,
					st: 1,
					pr: 0,
					dealer: 0,
					mid: false,
					fN: false,
					wM: 0,
					ps: shuffledPlayers.map((player: User) => playerToObj(player)),
					ts: [],
					fr: [0, 0],
					th: false,
					thB: 0,
					lastT: {},
					ta: true,
					taB: 0,
					hu: [],
					draw: false,
					logs: [],
					sk: [],
					prE: {},
					px: [gMinPx, gMaxPx],
					mHu,
					sHs,
					pay
				}).then(newGame => {
					gameId = newGame.id;
					const game: Game = new Game(
						gameId,
						user.uN,
						cA,
						pS,
						es,
						true,
						cA,
						null,
						1,
						0,
						0,
						false,
						false,
						0,
						shuffledPlayers,
						[],
						[],
						false,
						0,
						{},
						true,
						0,
						[],
						false,
						[],
						[],
						{},
						[gMinPx, gMaxPx],
						mHu,
						sHs,
						pay
					);
					resolve(game);
				});
			} catch (err) {
				console.error('FirebaseService - game was not created');
				reject(err);
			}
		});
	}

	async updateGame(game: Game) {
		try {
			let gameObj = gameToObj(game);
			const gameRef = doc(this.gamesRef, game.id);
			await updateDoc(gameRef, { ...gameObj });
		} catch (err) {
			console.error(err);
		}
	}

	async listenToGame(gameId: string, observer: any): Promise<Unsubscribe> {
		return new Promise((resolve, reject) => {
			try {
				resolve(onSnapshot(doc(this.gamesRef, gameId), observer));
			} catch (err) {
				reject(err);
			}
		});
	}

	async runTransactionUpdate(gameId: string, values: any): Promise<void> {
		return new Promise((resolve, reject) => {
			runTransaction(this.fs, async transaction => {
				const gameDocRef = doc(this.gamesRef, gameId);
				await transaction.get(gameDocRef).then(gameDoc => {
					if (!gameDoc.exists()) {
						reject(ErrorMessage.TRANSACTION_UPDATE_FAILED);
					} else {
						transaction.update(gameDocRef, { ...values });
						resolve();
					}
				});
			});
		});
	}

	/* ------------------------- Dev / maintenance ------------------------- */

	newLog(log: IFBLog) {
		addDoc(this.logsRef, log);
	}

	setGame(game: any) {
		setDoc(doc(this.gamesRef, game.id), JSON.parse(JSON.stringify(game)));
	}
}

const FBService = new FirebaseService();
export default FBService;
