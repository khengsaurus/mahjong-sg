import { BackgroundColor, BotTimeout, FBCollection, FBDatabase, PaymentType, Size, TableColor, TileColor } from 'enums';
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
import { HandPoint, ScoringHand } from 'handEnums';
import { ErrorMessage, InfoMessage } from 'messages';
import { Game, User } from 'models';
import moment from 'moment';
import { ScreenTextEng } from 'screenTexts';
import FirebaseConfig from 'shared/FirebaseConfig';
import { isDev, shuffle } from 'utility';
import { gameToObj, playerToObj, userToObj } from 'utility/parsers';

export class FirebaseService {
	private user: FirebaseUser;
	private app: FirebaseApp;
	private auth: Auth;
	private db: Database;
	private fs: Firestore;
	private usersRef: CollectionReference;
	private gamesRef: CollectionReference;
	private logsRef: CollectionReference;
	private isFBConnected: boolean;

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
			}
		});
	}

	async initApp(): Promise<boolean> {
		return new Promise(resolve => {
			try {
				this.app = initializeApp(FirebaseConfig);
				isDev() && console.info(InfoMessage.FIREBASE_INIT_SUCCESS);
				resolve(true);
			} catch (err) {
				console.error(InfoMessage.FIREBASE_INIT_ERROR);
				resolve(false);
			}
		});
	}

	/**
	 * @see https://github.com/firebase/firebase-js-sdk/issues/5552
	 */
	async initAuth() {
		this.auth = initializeAuth(this.app, {
			persistence: indexedDBLocalPersistence
		});
		this.auth.onAuthStateChanged(user => {
			isDev() && console.info(user ? InfoMessage.FIREBASE_USER_YES : InfoMessage.FIREBASE_USER_NO);
			this.user = user;
		});
	}

	// https://firebase.google.com/docs/database/web/offline-capabilities
	initFBConnectionWatcher() {
		let timeoutRef: NodeJS.Timeout = null;
		const connectedRef = ref(this.db, '.info/connected');

		onValue(connectedRef, snap => {
			clearTimeout(timeoutRef);
			timeoutRef = setTimeout(() => {
				const connected = snap.val() === true || false;
				console.info(connected ? InfoMessage.FIREBASE_CONNECTED : InfoMessage.FIREBASE_DISCONNECTED);
				this.isFBConnected = connected;
			}, 400);
		});
	}

	userAuthenticated(timeout = 500): Promise<boolean> {
		return new Promise(resolve => {
			if (!!this.auth.currentUser) {
				// check existing status
				resolve(true);
			} else {
				// resolve after timeout
				setTimeout(() => {
					resolve(!!this.auth.currentUser);
				}, timeout);
			}
		});
	}

	FBServiceConnected(timeout = 500): Promise<boolean> {
		return new Promise(resolve => {
			if (this.isFBConnected) {
				// check existing status
				resolve(true);
			} else {
				// resolve after timeout
				setTimeout(() => {
					resolve(this.isFBConnected);
				}, timeout);
			}
		});
	}

	/* ------------------------- Auth related ------------------------- */

	async authRegisterEmailPass(email: string, password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			if (this.isFBConnected) {
				createUserWithEmailAndPassword(this.auth, email, password)
					.then((values: UserCredential) => {
						resolve(values.user.email);
					})
					.catch(err => {
						reject(err);
					});
			} else {
				reject(ErrorMessage.SERVICE_OFFLINE);
			}
		});
	}

	/**
	 * @throws ErrorMessage.LOGIN_ERROR
	 */
	async authLoginEmailPass(email: string, password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			if (this.isFBConnected) {
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
			} else {
				reject(ErrorMessage.SERVICE_OFFLINE);
			}
		});
	}

	authLogout() {
		this.user = null;
		this.auth.signOut();
	}

	authDeleteCurrentUser(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (this.isFBConnected) {
				if (!!this.auth.currentUser) {
					try {
						deleteUser(this.auth.currentUser).then(() => resolve(true));
					} catch (err) {
						reject(err);
					}
				} else {
					resolve(false);
				}
			} else {
				reject(ErrorMessage.SERVICE_OFFLINE);
			}
		});
	}

	/* ------------------------- User related ------------------------- */

	pairEmailToUsername(username: string, email: string): Promise<boolean> {
		return new Promise(resolve => {
			if (this.isFBConnected) {
				try {
					set(ref(this.db, `${FBDatabase.USERS}/${username}`), email).then(() => resolve(true));
				} catch (err) {
					console.error(err);
					resolve(false);
				}
			}
		});
	}

	/**
	 * @throws if no userEmail, ErrorMessage.LOGIN_ERROR, else ErrorMessage.TRY_AGAIN
	 */
	getEmailFromUsername(username: string): Promise<string> {
		return new Promise((resolve, reject) => {
			if (this.isFBConnected) {
				try {
					get(child(ref(this.db), `${FBDatabase.USERS}/${username}`)).then(snapshot => {
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
			} else {
				reject(ErrorMessage.SERVICE_OFFLINE);
			}
		});
	}

	async registerUserEmail(uN: string, email: string): Promise<boolean> {
		return new Promise(resolve => {
			if (this.isFBConnected) {
				try {
					addDoc(this.usersRef, {
						uN,
						email,
						_b: [],
						_s: [],
						_n: [],
						hSz: Size.MEDIUM,
						tSz: Size.MEDIUM,
						cSz: Size.MEDIUM,
						bgC: BackgroundColor.BROWN,
						tC: TableColor.GREEN,
						tBC: TileColor.GREEN
					});
					resolve(true);
				} catch (err) {
					console.error('FirebaseService - user was not created: ', +err);
					resolve(false);
				}
			}
		});
	}

	async isUsernameAvail(uN: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			if (this.isFBConnected) {
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
			} else {
				reject(ErrorMessage.SERVICE_OFFLINE);
			}
		});
	}

	async getUserReprByEmail(email: string): Promise<Object> {
		return new Promise(async (resolve, reject) => {
			if (this.isFBConnected) {
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
			} else {
				reject(ErrorMessage.SERVICE_OFFLINE);
			}
		});
	}

	async searchUser(partUsername: string, exclude: string): Promise<DocumentData[]> {
		if (this.isFBConnected) {
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
		} else {
			return null;
		}
	}

	async updateUser(userId: string, keyVals: object): Promise<void> {
		if (this.isFBConnected) {
			try {
				const userRef = doc(this.usersRef, userId);
				await updateDoc(userRef, { ...keyVals });
			} catch (err) {
				console.error(err);
			}
		}
	}

	async restoreUser(user: User) {
		this.pairEmailToUsername(user.uN, user.email);
		setDoc(doc(this.usersRef, user.id), userToObj(user));
	}

	async deleteUserAccount(user): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (this.isFBConnected) {
				const { id, uN } = user;
				this.pairEmailToUsername(uN, '-')
					.then(() => deleteDoc(doc(this.usersRef, id)).then(() => resolve(true)))
					.catch(err => reject(err));
			} else {
				reject(ErrorMessage.SERVICE_OFFLINE);
			}
		});
	}

	/* ------------------------- User-game related ------------------------- */

	async listenInvitesSnapshot(user: User, observer: any): Promise<Unsubscribe> {
		return new Promise((resolve, reject) => {
			if (this.isFBConnected) {
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
			} else {
				reject(ErrorMessage.SERVICE_OFFLINE);
			}
		});
	}

	async cleanupGames(userEmail: string) {
		if (userEmail && this.isFBConnected) {
			const q = query(this.gamesRef, where('es', 'array-contains', userEmail));
			const games = await getDocsFromServer(q);
			games.forEach(g => {
				let lastUpdated = g.data()?.t[1];
				if (lastUpdated && lastUpdated?.toDate) {
					lastUpdated = lastUpdated?.toDate() as Date;
					if (moment.duration(moment(moment()).diff(lastUpdated)).asHours() > 23) {
						deleteDoc(doc(this.gamesRef, g.id)).catch(err => console.error(err));
					}
				}
			});
		}
	}

	async cleanupAllGames() {
		if (this.isFBConnected) {
			const games = await getDocsFromServer(query(this.gamesRef));
			games.forEach(g => {
				let lastUpdated = g.data()?.t[1];
				if (lastUpdated && lastUpdated?.toDate) {
					lastUpdated = lastUpdated?.toDate() as Date;
					if (moment.duration(moment(moment()).diff(lastUpdated)).asHours() > 23) {
						deleteDoc(doc(this.gamesRef, g.id)).catch(err => console.error(err));
					}
				}
			});
		}
	}

	/* ------------------------- Game related ------------------------- */

	async getGameById(gameId?: string) {
		if (this.isFBConnected) {
			try {
				const gameRef = doc(this.gamesRef, gameId);
				await getDocFromServer(gameRef).then(doc => {
					return { id: doc.id, ...doc.data() };
				});
			} catch (err) {
				console.error(err);
			}
		}
	}

	async createGame(
		user: User,
		ps: User[],
		random?: boolean,
		gMinPx = HandPoint.MIN,
		gMaxPx = HandPoint.MAX,
		mHu = false,
		pay = PaymentType.SHOOTER,
		sHs: ScoringHand[] = [],
		easyAI = false
	): Promise<Game> {
		return new Promise((resolve, reject) => {
			if (this.isFBConnected) {
				const shuffledPlayers: User[] = random ? shuffle(ps) : ps;
				let es: string[] = [];
				let pS: string = '';
				shuffledPlayers.forEach(player => {
					es.push(player.email);
					pS = pS === '' ? player.uN : pS + `, ${player.uN}`;
					player.bal = 1000;
				});
				let cA = new Date();
				let gameId = '';
				try {
					addDoc(this.gamesRef, {
						cO: user.uN,
						cA,
						pS,
						es,
						t: [cA, cA, null],
						f: [true, true, false, false, false, false, mHu, false, easyAI],
						n: [1, 0, 0, 0, 0, 0, 0, 0, gMinPx, gMaxPx, isDev() ? BotTimeout.FAST : BotTimeout.MEDIUM, 0],
						ps: shuffledPlayers.map((player: User) => playerToObj(player)),
						ts: [],
						lTh: {},
						hu: [],
						logs: [],
						sk: [],
						prE: {},
						sHs,
						pay
					}).then(newGame => {
						gameId = newGame.id;
						const game = new Game(
							gameId,
							user.uN,
							pS,
							es,
							[cA, cA, null],
							[true, true, false, false, false, false, mHu, false, easyAI],
							[
								1,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								gMinPx,
								gMaxPx,
								isDev() ? BotTimeout.FAST : BotTimeout.MEDIUM,
								0,
								0
							],
							shuffledPlayers,
							[],
							{},
							[],
							[],
							[],
							{},
							sHs,
							pay
						);
						resolve(game);
					});
				} catch (err) {
					console.error('FirebaseService - game was not created: 🥞');
					reject(err);
				}
			} else {
				reject(ErrorMessage.SERVICE_OFFLINE);
			}
		});
	}

	async updateGame(game: Game) {
		if (this.isFBConnected) {
			try {
				let gameObj = gameToObj(game);
				const gameRef = doc(this.gamesRef, game.id);
				await updateDoc(gameRef, { ...gameObj });
			} catch (err) {
				console.error(err);
			}
		}
	}

	async listenToGame(gameId: string, observer: any): Promise<Unsubscribe> {
		return new Promise((resolve, reject) => {
			if (this.isFBConnected) {
				try {
					resolve(onSnapshot(doc(this.gamesRef, gameId), observer));
				} catch (err) {
					reject(err);
				}
			} else {
				reject(ErrorMessage.SERVICE_OFFLINE);
			}
		});
	}

	async runTransactionUpdate(gameId: string, mHu: boolean, bt: number, easyAI: boolean): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.isFBConnected) {
				runTransaction(this.fs, async transaction => {
					const gameDocRef = doc(this.gamesRef, gameId);
					await transaction.get(gameDocRef).then(gameDoc => {
						if (!gameDoc.exists()) {
							reject(ErrorMessage.TRANSACTION_UPDATE_FAILED);
						} else {
							const { f, n } = gameDoc.data() || {};
							f[6] = mHu;
							f[8] = easyAI;
							n[10] = bt;
							transaction.update(gameDocRef, { f, n });
							resolve();
						}
					});
				});
			} else {
				reject(ErrorMessage.SERVICE_OFFLINE);
			}
		});
	}

	async runTransactionPay(gameId: string, from: number, to: number, amt: number): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.isFBConnected) {
				runTransaction(this.fs, async transaction => {
					const gameDocRef = doc(this.gamesRef, gameId);
					await transaction.get(gameDocRef).then(gameDoc => {
						if (!gameDoc.exists()) {
							reject(ErrorMessage.TRANSACTION_UPDATE_FAILED);
						} else {
							const { ps, logs } = gameDoc.data();
							const _from = ps[from];
							const _to = ps[to];
							if (ps) {
								_from.bal = Math.round(_from.bal - amt);
								_to.bal = Math.round(_to.bal + amt);
							}
							if (logs) {
								logs.push(
									`${_from.uN} sent ${_to.uN} ${amt} ${ScreenTextEng._CHIP_}${amt > 1 ? 's' : ''}`
								);
							}
							transaction.update(gameDocRef, { ps, logs });
							resolve();
						}
					});
				});
			} else {
				reject(ErrorMessage.SERVICE_OFFLINE);
			}
		});
	}

	/* ------------------------- Dev / maintenance ------------------------- */

	newLog(log: IFBLog) {
		addDoc(this.logsRef, log);
	}

	setGame(game: any) {
		if (this.isFBConnected) {
			setDoc(doc(this.gamesRef, game.id), JSON.parse(JSON.stringify(game)));
		}
	}
}

const FBService = new FirebaseService();
export default FBService;
