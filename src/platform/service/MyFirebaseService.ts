import { Capacitor } from '@capacitor/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
	Auth,
	createUserWithEmailAndPassword,
	indexedDBLocalPersistence,
	initializeAuth,
	signInWithEmailAndPassword,
	User as FirebaseUser,
	UserCredential
} from 'firebase/auth';
import {
	addDoc,
	collection,
	CollectionReference,
	deleteDoc,
	doc,
	DocumentData,
	Firestore,
	getDoc,
	getDocs,
	getFirestore,
	limit,
	onSnapshot,
	query,
	Unsubscribe,
	updateDoc,
	where
} from 'firebase/firestore';
import moment from 'moment';
import { BackgroundColor, FBCollection, PaymentType, Size, TableColor, TileColor } from 'shared/enums';
import { HandPoint, ScoringHand } from 'shared/handEnums';
import { Game, User } from 'shared/models';
import FirebaseConfig from 'shared/service/FirebaseConfig';
import { shuffle } from 'shared/util';
import { gameToObj, playerToObj } from 'shared/util/parsers';

export class FirebaseService {
	private user: FirebaseUser;
	private db: Firestore;
	private usersRef: CollectionReference;
	private gamesRef: CollectionReference;
	private app: FirebaseApp;
	private auth: Auth;

	constructor() {
		this.initApp().then(() => {
			this.initAuth();
			this.db = getFirestore(this.app);
			this.usersRef = collection(this.db, FBCollection.USERREPR);
			this.gamesRef = collection(this.db, FBCollection.GAMES);
		});
	}

	async initApp() {
		this.app = initializeApp(FirebaseConfig);
		console.info('Firebase App initialized 🔥');
	}

	/**
	 * @see https://github.com/firebase/firebase-js-sdk/issues/5552
	 */
	async initAuth() {
		if (Capacitor.isNativePlatform) {
			this.auth = initializeAuth(this.app, {
				persistence: indexedDBLocalPersistence
			});
		}
		this.auth.onAuthStateChanged(user => {
			console.info(user ? 'Firebase user signed in 😊' : 'No Firebase user 🥲');
			this.user = user;
		});
	}

	userAuthenticated() {
		return this.user !== null;
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

	async authLoginEmailPass(email: string, password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			signInWithEmailAndPassword(this.auth, email, password)
				.then((values: UserCredential) => {
					resolve(values.user.email);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	authLogout() {
		this.user = null;
		this.auth.signOut();
	}

	authDeleteCurrentUser() {
		this.auth.currentUser.delete();
	}

	/* ------------------------- User related ------------------------- */

	async registerUserEmail(uN: string, email: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				addDoc(this.usersRef, {
					uN,
					email,
					pUrl: '',
					hSz: Size.MEDIUM,
					tSz: Size.MEDIUM,
					cSz: Size.MEDIUM,
					bgC: BackgroundColor.BLUE,
					tC: TableColor.GREEN,
					tBC: TileColor.GREEN
					// tileFrontColor: TileColor.LIGHT,
					// decoration: Decoration.DEFAULT,
					// groups: []
				});
				resolve(true);
			} catch (err) {
				console.error('FirebaseService - user was not created: ', +err);
				resolve(false);
			}
		});
	}

	async getUserReprByUsername(uN: string): Promise<DocumentData> {
		try {
			const q = query(this.usersRef, where('uN', '==', uN));
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach(doc => {
				return { id: doc.id, ...doc.data() };
			});
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getUserReprByEmail(email: string) {
		const res = [];
		try {
			const q = query(this.usersRef, where('email', '==', email), limit(1));
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach(doc => {
				res.push({ id: doc.id, ...doc.data() });
			});
		} catch (err) {
			console.error(err);
		}
		if (res.length > 0) {
			return res[0];
		}
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
			const querySnapshot = await getDocs(q);
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

	/* ------------------------- User-game related ------------------------- */

	async listenInvitesSnapshot(user: User, observer: any): Promise<Unsubscribe> {
		if (user) {
			try {
				const q = query(
					this.gamesRef,
					where('es', 'array-contains', user.email),
					where('on', '==', true),
					limit(5)
				);
				return onSnapshot(q, observer);
			} catch (err) {
				console.error(err);
				return null;
			}
		}
	}

	async cleanupFinishedGames(userEmail: string) {
		if (userEmail) {
			const q = query(this.gamesRef, where('es', 'array-contains', userEmail));
			const games = await getDocs(q);
			games.forEach(g => {
				const updated: Date = g.data()?.up?.toDate();
				if (moment.duration(moment(moment()).diff(updated)).asHours() > 24) {
					deleteDoc(doc(this.gamesRef, g.id)).catch(err => {
						console.error(err);
					});
				}
			});
		}
	}

	/* ------------------------- Game related ------------------------- */

	async getGameById(gameId?: string) {
		try {
			const gameRef = doc(this.gamesRef, gameId);
			await getDoc(gameRef).then(doc => {
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
		let shuffledPlayers: User[];
		shuffledPlayers = random ? shuffle(ps) : ps;
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
		if (gameId) {
			try {
				return onSnapshot(doc(this.gamesRef, gameId), observer);
			} catch (err) {
				console.error(err);
				return null;
			}
		}
	}
}

const FBService = new FirebaseService();
export default FBService;
