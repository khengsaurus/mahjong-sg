import FBService, { FirebaseService } from 'platform/service/MyFirebaseService';
import { Store } from 'redux';
import { LocalFlag } from 'shared/enums';
import { ErrorMessage, InfoMessage } from 'shared/messages';
import { Game, User } from 'shared/models';
import { setLocalGame, store } from 'shared/store';
import { createLocalGame } from 'shared/util';
import { objToUser } from 'shared/util/parsers';

export class Service {
	private fbService: FirebaseService = FBService;
	private store: Store;

	constructor() {
		this.init();
	}

	async init() {
		if (this.fbService) {
			console.info(InfoMessage.SERVER_READY);
		} else {
			this.fbService = FBService;
			console.info(InfoMessage.SERVER_INIT);
		}
		this.store = store;
	}

	FBAuthenticated() {
		return FBService.userAuthenticated();
	}

	async FBAuthRegister(props: IEmailPass): Promise<string> {
		return new Promise((resolve, reject) => {
			FBService.authRegisterEmailPass(props.email, props.password)
				.then(email => resolve(email))
				.catch(err => {
					reject(err);
				});
		});
	}

	async FBAuthLogin(props: IEmailPass): Promise<boolean> {
		return FBService.authLoginEmailPass(props.email, props.password);
	}

	FBResolveUser(email: string): Promise<User | null> {
		return new Promise((resolve, reject) => {
			try {
				FBService.getUserReprByEmail(email).then((userData: any) => {
					resolve(userData ? objToUser(userData) : null);
				});
			} catch (err) {
				reject(new Error(ErrorMessage.LOGIN_ERROR));
			}
		});
	}

	async FBNewUsername(values: IEmailUser): Promise<boolean> {
		return new Promise((resolve, reject) => {
			FBService.getUserReprByUsername(values.uN).then(data => {
				if (data && !data.empty) {
					reject(new Error(ErrorMessage.USERNAME_TAKEN));
				} else {
					FBService.registerUserEmail(values.uN, values.email)
						.then(res => {
							if (res) {
								FBService.pairEmailToUsername(values.uN, values.email).then(res => {
									resolve(res);
								});
							}
						})
						.catch(err => {
							console.error(err);
							reject(new Error(ErrorMessage.REGISTER_ERROR));
						});
				}
			});
		});
	}

	async getEmailFromUsername(username: string): Promise<string> {
		return FBService.getEmailFromUsername(username);
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

	initGame(
		user: User,
		players: User[],
		random: boolean,
		minTai: number,
		maxTai: number,
		mHu: boolean,
		isLocalGame = false
	): Promise<Game> {
		return new Promise(resolve => {
			try {
				if (isLocalGame) {
					createLocalGame(user, players, random, minTai, maxTai, mHu).then(game => {
						game.prepForNewRound(true);
						game.initRound();
						this.store.dispatch(setLocalGame(game));
						resolve(game);
					});
				} else {
					FBService.createGame(user, players, random, minTai, maxTai, mHu).then(game => {
						game.prepForNewRound(true);
						game.initRound();
						FBService.updateGame(game).then(() => {
							resolve(game);
						});
					});
				}
			} catch (err) {
				console.error(`${isLocalGame ? ErrorMessage.INIT_LOCAL_GAME : ErrorMessage.INIT_ONLINE_GAME}: 🥞`);
				console.error(err);
				resolve(null);
			}
		});
	}

	FBListenToGame(id: string, observer: any) {
		return id === LocalFlag ? null : FBService.listenToGame(id, observer);
	}

	updateGame(game: Game, isLocalGame = false): void | Promise<void> {
		if (isLocalGame) {
			this.store.dispatch(setLocalGame(game));
		} else {
			return FBService.updateGame(game);
		}
	}

	cleanupGames(userEmail: string) {
		FBService.cleanupFinishedGames(userEmail);
	}

	// For dev
	setGame(game: Game) {
		FBService.setGame(game);
	}
}

const ServiceInstance = new Service();
export default ServiceInstance;
