import FBService, { FirebaseService } from 'platform/service/MyFirebaseService';
import { Store } from 'redux';
import { Game, User } from 'shared/models';
import store from 'shared/store';
import { ActionTypes } from 'shared/store/actions';
import { IStore } from 'shared/typesPlus';
import { objToUser } from 'shared/util/parsers';

export class Service {
	private fbService: FirebaseService = FBService;
	private reduxStore: Store<IStore, ActionTypes>;
	private localGameFlag: boolean;

	constructor() {
		this.init();
	}

	async init() {
		if (this.fbService) {
			console.info('Service instance ready 🍦');
		} else {
			this.fbService = FBService;
			console.info('Initializing service instance 🍦');
		}
		this.reduxStore = store;
		this.reduxStore.subscribe(() => {
			this.localGameFlag = store.getState().localGameFlag;
		});
	}

	FBAuthenticated() {
		return FBService.userAuthenticated();
	}

	async FBAuthRegister(props: IEmailPass): Promise<string> {
		return new Promise((resolve, reject) => {
			FBService.authRegisterEmailPass(props.email, props.password)
				.then(email => {
					resolve(email);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	async FBAuthLogin(props: IEmailPass): Promise<string> {
		return new Promise((resolve, reject) => {
			FBService.authLoginEmailPass(props.email, props.password)
				.then(email => {
					resolve(email);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	FBResolveUser(email: string): Promise<User | null> {
		return new Promise((resolve, reject) => {
			try {
				FBService.getUserReprByEmail(email).then((userData: any) => {
					if (userData.docs.length === 0) {
						resolve(null);
					} else {
						resolve(objToUser(userData));
					}
				});
			} catch (err) {
				reject(new Error('Email or password incorrect'));
			}
		});
	}

	async FBNewUsername(values: IEmailUser): Promise<boolean> {
		return new Promise((resolve, reject) => {
			FBService.getUserReprByUsername(values.uN).then(data => {
				if (!data.empty) {
					reject(new Error('Username already taken'));
				} else {
					FBService.registerUserEmail(values.uN, values.email)
						.then(res => {
							resolve(res);
						})
						.catch(err => {
							console.error('Unable to register user');
							reject(err);
						});
				}
			});
		});
	}

	FBUpdateUser(id: string, keyVal: object) {
		return FBService.updateUser(id, keyVal);
	}

	FBAuthLogout() {
		FBService.authLogout();
	}

	FBDeleteCurrentFBUser() {
		return FBService.authDeleteCurrentUser();
	}

	FBSearchUser(uN: string, currUN: string) {
		return FBService.searchUser(uN, currUN);
	}

	FBListenInvites(user: User, observer: any) {
		return FBService.listenInvitesSnapshot(user, observer);
	}

	FBInitGame(
		user: User,
		players: User[],
		random: boolean,
		minTai: number,
		maxTai: number,
		mHu: boolean
	): Promise<Game> {
		return new Promise(resolve => {
			try {
				FBService.createGame(user, players, random, minTai, maxTai, mHu).then(game => {
					game.prepForNewRound(true);
					game.initRound();
					this.updateGame(game).then(() => {
						resolve(game);
					});
				});
			} catch (err) {
				console.error(`ServiceLayer failed to execute FBService.createGame -> FBService.updateGame: 🥞`);
				console.error(err);
				resolve(null);
			}
		});
	}

	FBListenToGame(id: string, observer: any) {
		return FBService.listenToGame(id, observer);
	}

	updateGame(game: Game): Promise<Game> {
		if (this.localGameFlag) {
			// TODO:
		} else {
			return FBService.updateGame(game);
		}
	}

	FBDeclareHuTransaction(hu: boolean, playerSeat: number, player: User, game: Game): Promise<Boolean> {
		return FBService.handleDeclareHu(hu, playerSeat, player.uN, game.id);
	}
}

const ServiceInstance = new Service();
export default ServiceInstance;
