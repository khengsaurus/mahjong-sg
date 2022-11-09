import { LocalFlag, PaymentType, UserActivity } from 'enums';
import { ScoringHand } from 'handEnums';
import isEmpty from 'lodash.isempty';
import { ErrorMessage, InfoMessage } from 'messages';
import { Game, User } from 'models';
import { isDev } from 'platform';
import { Store } from 'redux';
import { FBService, FirebaseService } from 'service';
import { store } from 'store';
import { setLocalGame } from 'store/actions';
import { createLocalGame } from 'utility';
import { objToUser } from 'utility/parsers';

export class Service {
	private fbService: FirebaseService = FBService;
	private store: Store;

	constructor() {
		if (this.fbService) {
			isDev && console.info(InfoMessage.SERVER_READY);
		} else {
			this.fbService = FBService;
			isDev && console.info(InfoMessage.SERVER_INIT);
		}
		this.store = store;
	}

	/**
	 * @params timeout, default 500ms
	 */
	FBAuthenticated(timeout = 500) {
		return FBService.userAuthenticated(timeout);
	}

	async FBAuthRegister(props: IEmailPass): Promise<string> {
		return new Promise((resolve, reject) => {
			FBService.authRegisterEmailPass(props.email, props.password)
				.then(email => resolve(email))
				.catch(err => {
					if (err?.message.includes('email-already-in-use')) {
						reject(new Error(ErrorMessage.EMAIL_USED));
					} else if (err?.message.includes('invalid-email')) {
						reject(new Error(ErrorMessage.INVALID_EMAIL));
					} else {
						isDev && console.error(err);
						reject(new Error(ErrorMessage.REGISTER_ERROR));
					}
				});
		});
	}

	async FBAuthLogin(props: IEmailPass): Promise<string> {
		return FBService.authLoginEmailPass(props.email, props.password);
	}

	/**
	 * @throws ErrorMessage.SERVICE_OFFLINE || ErrorMessage.INCORRECT_LOGIN
	 */
	FBResolveUser(email: string, retry = 1, retryAfter = 1000): Promise<User | null> {
		return new Promise(async (resolve, reject) => {
			try {
				if (email) {
					for (let i = 0; i <= retry; i++) {
						FBService.getUserReprByEmail(email)
							.then((userData: Object) => {
								if (!isEmpty(userData)) {
									resolve(objToUser(userData));
									return;
								}
							})
							.catch(reject);
						// Wait before retrying
						await new Promise(r => setTimeout(r, retryAfter));
					}
					reject(new Error(ErrorMessage.SERVICE_OFFLINE));
				} else {
					reject(new Error(ErrorMessage.INCORRECT_LOGIN));
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	async FBNewUsername(values: IEmailUser, enOnly: boolean): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			FBService.isUsernameAvail(values.uN)
				.then(
					avail =>
						avail &&
						FBService.registerUserEmail(values.uN, values.email, enOnly)
				)
				.then(
					success =>
						success && FBService.pairEmailToUsername(values.uN, values.email)
				)
				.then(success => resolve(success))
				.catch(reject);
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

	// This is a mess... can't find a way to chain the promises,
	// + unsure when FB will throw client offline or 'requires-recent-login' error...
	async FBDeleteUser(user: User): Promise<boolean> {
		function handleError(error: Error) {
			isDev && console.error(error);
			FBService.restoreUser(user);
			FBService.newLog({
				userId: user?.id,
				username: user?.uN,
				timestamp: new Date(),
				event: UserActivity.ACCOUNT_DELETE,
				message: error.message
			});
		}

		return new Promise(async (resolve, reject) => {
			const timeout = new Promise<Error>(reject =>
				setTimeout(() => reject(new Error(ErrorMessage.ACC_DELETE_TIMEOUT)), 5000)
			);
			await Promise.race([FBService.deleteUserAccount(user), timeout])
				.then(_success => {
					if (_success === true) {
						FBService.authDeleteCurrentUser().then(res => resolve(res));
					} else {
						handleError(new Error(ErrorMessage.AUTH_DELETE_ERROR));
					}
				})
				.catch(err => {
					handleError(err);
					reject(err);
				});
		});
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
		pay: PaymentType,
		sHs: ScoringHand[] = [],
		easyAI = false,
		isLocalGame = false
	): Promise<Game> {
		return new Promise(resolve => {
			try {
				if (isLocalGame) {
					createLocalGame(
						user,
						players,
						random,
						minTai,
						maxTai,
						mHu,
						pay,
						sHs,
						easyAI
					).then(game => {
						game.prepForNewRound(true);
						game.initRound();
						this.store.dispatch(setLocalGame(game));
						!isDev && FBService.incrementGameCount();
						resolve(game);
					});
				} else {
					FBService.createGame(
						user,
						players,
						random,
						minTai,
						maxTai,
						mHu,
						pay,
						sHs
					).then(game => {
						game.prepForNewRound(true);
						game.initRound();
						FBService.updateGame(game).then(() => {
							!isDev && FBService.incrementGameCount(true);
							resolve(game);
						});
					});
				}
			} catch (err) {
				isDev &&
					console.error(
						`${
							isLocalGame
								? ErrorMessage.INIT_LOCAL_GAME
								: ErrorMessage.INIT_ONLINE_GAME
						}: 🥞`
					);
				isDev && console.error(err);
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

	/**
	 * Note that this runs a transaction -> 1 read + 1 write
	 */
	adminUpdateGame(
		game: Game,
		isLocalGame: boolean,
		mHu: boolean,
		bt: number,
		easyAI: boolean
	) {
		if (isLocalGame) {
			game.f[6] = mHu;
			game.f[8] = easyAI;
			game.n[10] = bt;
			this.updateGame(game, true);
		} else {
			try {
				FBService.runTransactionUpdate(game.id, mHu, bt, easyAI);
			} catch (err) {
				isDev && console.error(err);
			}
		}
	}

	sendPayment(game: Game, isLocalGame: boolean, from: number, to: number, amt: number) {
		if (isLocalGame) {
			game.sendChips(from, to, amt);
			this.updateGame(game, true);
		} else {
			try {
				FBService.runTransactionPay(game.id, from, to, amt);
			} catch (err) {
				isDev && console.error(err);
			}
		}
	}

	cleanupGames(userEmail: string) {
		FBService.cleanupGames(userEmail);
	}

	cleanupAllGames() {
		FBService.cleanupAllGames();
	}

	// For dev
	setGame(game: any) {
		FBService.setGame(game);
	}
}

const ServiceInstance = new Service();
export default ServiceInstance;
