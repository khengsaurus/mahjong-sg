import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { BackgroundColors, Sizes, TableColors, TileColors } from 'shared/enums';
import { Game, User } from 'shared/Models';
import FirebaseConfig from 'shared/service/FirebaseConfig';
import { addSecondsToDate, gameToObj, playerToObj, shuffle } from 'shared/util/utilFns';

class FirebaseService {
	private user: firebase.User;
	private db: firebase.firestore.Firestore;
	private userVal: firebase.firestore.CollectionReference;
	private userRepr: firebase.firestore.CollectionReference;
	private gameRef: firebase.firestore.CollectionReference;
	// private actionsRef: firebase.firestore.CollectionReference;
	private app: firebase.app.App;
	private auth: firebase.auth.Auth;
	private authProvider: firebase.auth.GoogleAuthProvider;

	constructor() {
		this.init().then(() => {
			this.auth = firebase.auth();
			this.authProvider = new firebase.auth.GoogleAuthProvider();
			this.db = firebase.firestore();
			this.userVal = this.db.collection('userVal');
			this.userRepr = this.db.collection('userRepr');
			this.gameRef = this.db.collection('games');
			// this.actionsRef = this.db.collection('actions');
			this.auth.onAuthStateChanged(user => {
				this.user = user;
			});
		});
	}

	async init() {
		if (!firebase.apps.length) {
			this.app = firebase.initializeApp(FirebaseConfig);
		} else {
			this.app = firebase.app();
		}
	}

	userAuthenticated() {
		return this.user !== null;
	}

	/* ------------------------- Auth related ------------------------- */

	async authLoginAnon(): Promise<firebase.auth.UserCredential> {
		try {
			return await firebase.auth().signInAnonymously();
		} catch (err) {
			console.error(err);
		}
	}

	async authLoginWithGoogle(): Promise<string> {
		return new Promise((resolve, reject) => {
			this.auth
				.signInWithPopup(this.authProvider)
				.then((values: firebase.auth.UserCredential) => {
					resolve(values.user.email);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	async authRegisterEmailPass(email: string, password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.auth
				.createUserWithEmailAndPassword(email, password)
				.then((values: firebase.auth.UserCredential) => {
					resolve(values.user.email);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	async authLoginEmailPass(email: string, password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.auth
				.signInWithEmailAndPassword(email, password)
				.then((values: firebase.auth.UserCredential) => {
					resolve(values.user.email);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	authLogout() {
		this.auth.signOut();
	}

	authDeleteCurrentUser() {
		this.auth.currentUser.delete();
	}

	/* ------------------------- User related ------------------------- */
	async registerByIUserPass(uN: string, password: string) {
		let userId = '';
		try {
			await this.userVal.add({}).then(user => {
				userId = user.id;
			});
			const userValNew = this.userVal.doc(userId);
			const userReprNew = this.userRepr.doc(userId);
			await this.db.runTransaction(async t => {
				t.set(userValNew, { uN, password });
				t.set(userReprNew, { uN, pUrl: '', groups: [] });
			});
		} catch (err) {
			console.error('FirebaseService - user was not created: ', +err);
		}
	}

	async registerUserEmail(uN: string, email: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				this.userRepr.add({
					uN,
					email,
					pUrl: '',
					hSz: Sizes.MEDIUM,
					tSz: Sizes.MEDIUM,
					cSz: Sizes.MEDIUM,
					bgC: BackgroundColors.BLUE,
					tC: TableColors.GREEN,
					tBC: TileColors.GREEN
					// tileFrontColor: TileColors.LIGHT,
					// decoration: Decorations.DEFAULT,
					// groups: []
				});
				resolve(true);
			} catch (err) {
				console.error('FirebaseService - user was not created: ', +err);
				resolve(false);
			}
		});
	}

	getUserValByUsername(uN: string) {
		return this.userVal.where('uN', '==', uN).get();
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
			.limit(4)
			.get();
	}

	async createGroup(user: User, groupName: string, users: User[]) {
		const userRef = this.userRepr.doc(user.id);
		await userRef.update({ groups: { [groupName]: users } });
	}

	async searchGroups(user: User, partGroupName: string) {
		return new Promise((resolve, reject) => {
			let groups: IGroup[] = [];
			this.userRepr
				.doc(user.id)
				.get()
				.then(data => {
					groups = data.data().groups;
					// filter group.name like partGroupName
				})
				.catch(err => {
					console.error(err);
					groups = [];
				});
			resolve(groups);
		});
	}

	updateUser(userId: string, keyVals: object): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				const userRef = this.userRepr.doc(userId);
				userRef.update({ ...keyVals });
				resolve(true);
			} catch (err) {
				reject(new Error('FirebaseService - user doc was not up: ' + err.msg));
			}
		});
	}

	/* ------------------------- User-game related ------------------------- */

	async getInvites(user: User) {
		if (user) {
			return await this.gameRef
				.where('es', 'array-contains', user.email)
				.where('on', '==', true)
				// .orderBy('crA', 'desc')
				.limit(5)
				.get();
		} else {
			return null;
		}
	}

	listenInvitesSnapshot(user: User, observer: any) {
		if (user) {
			return (
				this.gameRef
					.where('es', 'array-contains', user.email)
					.where('on', '==', true)
					// .orderBy('crA', 'desc')
					.limit(5)
					.onSnapshot(observer)
			);
		} else {
			return null;
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

	async createGame(user: User, ps: User[], random?: boolean): Promise<Game> {
		let shuffledPlayers: User[];
		shuffledPlayers = random ? shuffle(ps) : ps;
		let es: string[] = [];
		let pS: string = '';
		shuffledPlayers.forEach(player => {
			es.push(player.email);
			pS += player.uN + ' ';
		});
		return new Promise((resolve, reject) => {
			let crA = new Date();
			let delayed = addSecondsToDate(crA, -10);
			let gameId = '';
			try {
				this.gameRef
					.add({
						cro: user.uN,
						crA,
						pS,
						es,
						on: true,
						// lastExec: 0,
						up: crA,
						dFr: delayed,
						st: 0,
						prev: -1,
						dealer: 0,
						mid: false,
						fN: true,
						wM: 0,
						ps: shuffledPlayers.map(function (player: User) {
							return playerToObj(player);
						}),
						tiles: [],
						front: 0,
						back: 0,
						lastT: {},
						tBy: 0,
						thrown: false,
						taken: true,
						takenB: 0,
						hu: [],
						draw: false,
						logs: []
					})
					.then(newGame => {
						gameId = newGame.id;
						const game: Game = new Game(
							gameId,
							user.uN,
							crA,
							pS,
							es,
							true,
							// 0,
							crA,
							delayed,
							0,
							-1,
							null,
							false,
							true,
							0,
							shuffledPlayers,
							[],
							null,
							null,
							null,
							null,
							false,
							true,
							0,
							[],
							false,
							[]
						);
						// this.actionsRef.doc(gameId).set({ actions: [] });
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
				reject(new Error('FirebaseService - game doc was not up'));
			}
		});
	}

	listenToGame(gameId: string, observer: any) {
		if (gameId) {
			return this.gameRef.doc(gameId).onSnapshot(observer);
		}
	}

	/* ------------------------- Actions related ------------------------- */

	// async listenToActions(gameId: string, observer: any) {
	// 	if (gameId) {
	// 		return this.actionsRef.doc(gameId).onSnapshot(observer);
	// 	}
	// }

	// updateActions(gameId: string, actions: IAction[]): Promise<boolean> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			const ref = this.actionsRef.doc(gameId);
	// 			await ref.set({ ...actions }).then(() => {
	// 				resolve(true);
	// 			});
	// 		} catch (err) {
	// 			console.error(err);
	// 			reject(new Error('FirebaseService - actions doc was not up'));
	// 		}
	// 	});
	// }
}

const FBService = new FirebaseService();
export default FBService;
