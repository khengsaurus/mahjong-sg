import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { BackgroundColors, Decorations, Sizes, TableColors, TileColors } from '../global/enums';
import { Game, gameToObj } from '../Models/Game';
import { User } from '../Models/User';
import { playerToObj } from '../util/utilFns';
import FirebaseConfig from './FirebaseConfig';

class FirebaseService {
	private user: firebase.User;
	private db: firebase.firestore.Firestore;
	private userVal: firebase.firestore.CollectionReference;
	private userRepr: firebase.firestore.CollectionReference;
	private gameRef: firebase.firestore.CollectionReference;
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
			console.log(err);
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
	async registerByIUserPass(username: string, password: string) {
		let userId = '';
		try {
			await this.userVal.add({}).then(user => {
				userId = user.id;
			});
			const userValNew = this.userVal.doc(userId);
			const userReprNew = this.userRepr.doc(userId);
			await this.db.runTransaction(async t => {
				t.set(userValNew, { username, password });
				t.set(userReprNew, { username, photoUrl: '', groups: [] });
			});
			console.log('User created successfully');
		} catch (err) {
			console.log('FirebaseService - user was not created: ', +err);
		}
	}

	async registerUserEmail(username: string, email: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				this.userRepr.add({
					username,
					email,
					photoUrl: '',
					handSize: Sizes.medium,
					tilesSize: Sizes.medium,
					controlsSize: Sizes.medium,
					backgroundColor: BackgroundColors.brown,
					tableColor: TableColors.brown,
					tileBackColor: TileColors.green,
					tileFrontColor: TileColors.light,
					decoration: Decorations.default,
					groups: []
				});
				console.log('User created successfully');
				resolve(true);
			} catch (err) {
				console.log('FirebaseService - user was not created: ', +err);
				resolve(false);
			}
		});
	}

	getUserValByUsername(username: string) {
		return this.userVal.where('username', '==', username).get();
	}

	getUserReprByUsername(username: string) {
		return this.userRepr.where('username', '==', username).get();
	}

	getUserReprByEmail(email: string) {
		return this.userRepr.where('email', '==', email).get();
	}

	getUserReprById(id: string) {
		return this.userRepr.doc(id).get();
	}

	searchUser(partUsername: string) {
		return this.userRepr
			.where('username', '>=', partUsername)
			.where('username', '<=', partUsername + '\uf8ff')
			.limit(5)
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
					console.log(err);
					groups = [];
				});
			resolve(groups);
		});
	}

	updateUser(user: User): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				const userRef = this.userRepr.doc(user.id);
				userRef.set({ ...user });
				resolve(true);
			} catch (err) {
				reject(new Error('FirebaseService - user doc was not updated: ' + err.msg));
			}
		});
	}

	/* ------------------------- User-game related ------------------------- */

	async getInvites(user: User) {
		if (user) {
			return await this.gameRef
				.where('playerIds', 'array-contains', user.id)
				.where('ongoing', '==', true)
				// .orderBy('createdAt', 'desc')
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
					.where('playerIds', 'array-contains', user.id)
					.where('ongoing', '==', true)
					// .orderBy('createdAt', 'desc')
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

	async createGame(user: User, players: User[], startingBal?: number): Promise<Game> {
		let playerIds: string[] = [];
		let playersString: string = '';
		players.forEach(player => {
			playerIds.push(player.id);
			playersString += player.username + ' ';
		});
		return new Promise((resolve, reject) => {
			let createdAt = new Date();
			try {
				this.gameRef
					.add({
						creator: user.username,
						createdAt,
						stage: 0,
						previousStage: -1,
						ongoing: true,
						midRound: false,
						dealer: 0,
						flagProgress: true,
						whoseMove: 0,
						playerIds,
						playersString,
						players: players.map(function (player: User) {
							return playerToObj(player);
						}),
						tiles: [],
						frontTiles: 0,
						backTiles: 0,
						lastThrown: {},
						thrownBy: 0,
						thrownTile: false,
						takenTile: true,
						takenBy: 0,
						uncachedAction: false,
						hu: [],
						draw: false,
						logs: []
					})
					.then(newGame => {
						console.log(`Game created successfully: gameId ${newGame.id}`);
						const game: Game = new Game(
							newGame.id,
							user.username,
							createdAt,
							playersString,
							true,
							0,
							-1,
							null,
							false,
							true,
							0,
							playerIds,
							players,
							[],
							null,
							null,
							null,
							null,
							false,
							true,
							0,
							false,
							[],
							false,
							[]
						);
						resolve(game);
					});
			} catch (err) {
				console.log('FirebaseService - game was not created');
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
				console.log(err);
				reject(new Error('FirebaseService - game doc was not updated'));
			}
		});
	}

	listenToGame(gameId: string, observer: any) {
		if (gameId) {
			return this.gameRef.doc(gameId).onSnapshot(observer);
		}
	}
}

const FBService = new FirebaseService();
export default FBService;
