import { Capacitor } from '@capacitor/core';
import {
	Auth,
	createUserWithEmailAndPassword,
	indexedDBLocalPersistence,
	initializeAuth,
	signInWithEmailAndPassword,
	User as FBUser,
	UserCredential
} from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { deleteDoc, doc } from 'firebase/firestore';
import moment from 'moment';
import { BackgroundColor, FBCollection, PaymentType, Size, TableColor, TileColor } from 'shared/enums';
import { HandPoint, ScoringHand } from 'shared/handEnums';
import { Game, User } from 'shared/models';
import FirebaseConfig from 'shared/service/FirebaseConfig';
import { shuffle } from 'shared/util';
import { gameToObj, playerToObj } from 'shared/util/parsers';

export class FirebaseService {
	private user: FBUser;
	private db: firebase.firestore.Firestore;
	private userRepr: firebase.firestore.CollectionReference;
	private gameRef: firebase.firestore.CollectionReference;
	private app: firebase.app.App;
	private auth: Auth;

	constructor() {
		this.initApp().then(() => {
			this.initAuth();
			this.db = firebase.firestore();
			this.userRepr = this.db.collection(FBCollection.USERREPR);
			this.gameRef = this.db.collection(FBCollection.GAMES);
		});
	}

	async initApp() {
		if (!firebase.apps.length) {
			this.app = firebase.initializeApp(FirebaseConfig);
		} else {
			this.app = firebase.app();
		}
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
				this.userRepr.add({
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

	getUserReprByUsername(uN: string) {
		return this.userRepr.where('uN', '==', uN).get();
	}

	getUserReprByEmail(email: string) {
		return this.userRepr.where('email', '==', email).get();
	}

	getUserReprById(id: string) {
		return this.userRepr.doc(id).get();
	}

	searchUser(partUsername: string, exclude: string) {
		return this.userRepr
			.where('uN', '!=', exclude)
			.where('uN', '>=', partUsername)
			.where('uN', '<=', partUsername + '\uf8ff')
			.limit(3)
			.get();
	}

	updateUser(userId: string, keyVals: object): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				const userRef = this.userRepr.doc(userId);
				userRef.update({ ...keyVals });
				resolve(true);
			} catch (err) {
				reject(new Error('FirebaseService - user doc was not updated: ' + err.msg));
			}
		});
	}

	/* ------------------------- User-game related ------------------------- */

	listenInvitesSnapshot(user: User, observer: any) {
		if (user) {
			return (
				this.gameRef
					.where('es', 'array-contains', user.email)
					// .where('on', '==', true)
					.orderBy('cA', 'desc')
					// .limit(5)
					.onSnapshot(observer)
			);
		} else {
			return null;
		}
	}

	async cleanupFinishedGames(userEmail: string) {
		if (userEmail) {
			const games = await this.gameRef.where('es', 'array-contains', userEmail).get();
			games.forEach(g => {
				const updated: Date = g.data()?.up?.toDate();
				if (moment.duration(moment(moment()).diff(updated)).asHours() > 24) {
					deleteDoc(doc(this.gameRef, g.id)).catch(err => {
						console.error(err);
					});
				}
			});
		}
	}

	/* ------------------------- Game related ------------------------- */

	async getGameById(game?: Game, gameId?: string) {
		if (!game && !gameId) {
			return null;
		} else {
			let game_id = game ? game.id : gameId;
			return this.gameRef.doc(game_id).get();
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
				this.gameRef
					.add({
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
					})
					.then(newGame => {
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

	updateGame(game: Game): Promise<Game> {
		return new Promise(async (resolve, reject) => {
			try {
				let gameObj = gameToObj(game);
				const currentGameRef = this.gameRef.doc(game.id);
				await currentGameRef.set({ ...gameObj }).then(() => {
					resolve(game);
				});
			} catch (err) {
				console.error(err);
				reject(new Error('FirebaseService - game doc was not updated'));
			}
		});
	}

	/**
	 * Using 1 more read to make sure there's no duplicate declareHu actions
	 * Using set as transaction.update is failing... unsure why
	 * @see https://firebase.google.com/docs/firestore/manage-data/transactions#node.js
	 */
	handleDeclareHu(hu: boolean, playerSeat: number, uN: string, gameId: string): Promise<boolean> {
		return new Promise(async resolve => {
			try {
				const specificGameRef = this.gameRef.doc(gameId);
				const res: boolean = await this.db.runTransaction(async t => {
					const game = await t.get(specificGameRef);
					if (game?.exists && !game?.data()?.ps?.find((p: any) => p.uN !== uN && p.sT)) {
						let gameData = game.data();
						let ps = gameData.ps;
						let toUpdate = ps.filter((p: any) => p.uN !== uN);
						let _p = { ...ps[playerSeat], sT: hu, confirmHu: hu };
						toUpdate.splice(playerSeat, 0, _p);
						// t.update(specificGameRef, { ps: toUpdate });
						await specificGameRef.set({ ...gameData, ps: toUpdate });
						return true;
					} else {
						console.info('Unable to declare hu');
						return false;
					}
				});
				resolve(res);
			} catch (err) {
				console.error(err);
				resolve(false);
			}
		});
	}

	listenToGame(gameId: string, observer: any) {
		if (gameId) {
			return this.gameRef.doc(gameId as string).onSnapshot(observer);
		}
	}
}

const FBService = new FirebaseService();
export default FBService;
