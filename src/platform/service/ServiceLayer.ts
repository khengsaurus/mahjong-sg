import { isEmpty } from 'lodash';
import FBService, { FirebaseService } from 'platform/service/MyFirebaseService';
import { Store } from 'redux';
import { LocalFlag, PaymentType, UserActivity } from 'shared/enums';
import { ScoringHand } from 'shared/handEnums';
import { ErrorMessage, InfoMessage } from 'shared/messages';
import { Game, User } from 'shared/models';
import { setLocalGame, store } from 'shared/store';
import { createLocalGame } from 'shared/util';
import { objToUser } from 'shared/util/parsers';

export class Service {
	private fbService: FirebaseService = FBService;
	private store: Store;

	constructor() {
		if (this.fbService) {
			console.info(InfoMessage.SERVER_READY);
		} else {
			this.fbService = FBService;
			console.info(InfoMessage.SERVER_INIT);
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
					if (err.message.includes('email-already-in-use')) {
						reject(new Error(ErrorMessage.EMAIL_USED));
					} else if (err.message.includes('invalid-email')) {
						reject(new Error(ErrorMessage.INVALID_EMAIL));
					} else {
						console.error(err);
						reject(new Error(ErrorMessage.REGISTER_ERROR));
					}
				});
		});
	}

	async FBAuthLogin(props: IEmailPass): Promise<string> {
		return FBService.authLoginEmailPass(props.email, props.password);
	}

	/**
	 * @throws ErrorMessage.LOGIN_ERROR
	 */
	FBResolveUser(email: string): Promise<User | null> {
		return new Promise((resolve, reject) => {
			try {
				if (email) {
					FBService.getUserReprByEmail(email).then((userData: Object) =>
						resolve(!isEmpty(userData) ? objToUser(userData) : null)
					);
				} else {
					reject(new Error(ErrorMessage.LOGIN_ERROR));
				}
			} catch (err) {
				reject(new Error(ErrorMessage.LOGIN_ERROR));
			}
		});
	}

	async FBNewUsername(values: IEmailUser): Promise<boolean> {
		return new Promise((resolve, reject) => {
			FBService.isUsernameAvail(values.uN)
				.then(res => {
					if (res) {
						FBService.registerUserEmail(values.uN, values.email).then(() =>
							FBService.pairEmailToUsername(values.uN, values.email).then(res => resolve(res))
						);
					} else {
						reject(new Error(ErrorMessage.USERNAME_TAKEN));
					}
				})
				.catch(err => {
					console.error(err);
					reject(new Error(ErrorMessage.REGISTER_ERROR));
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

	// This is a mess... can't find a way to chain the promises,
	// + unsure when FB will throw client offline or 'requires-recent-login' error...
	async FBDeleteUser(user: User): Promise<boolean> {
		function handleError(error: Error) {
			console.error(error);
			FBService.restoreUser(user);
			FBService.newLog({
				userId: user?.id,
				username: user?.uN,
				timestamp: new Date(),
				event: UserActivity.ACCOUNT_DELETE,
				message: error.message
			});
		}

		return new Promise(async resolve => {
			const timeout = new Promise<Error>(reject =>
				setTimeout(() => reject(new Error(ErrorMessage.ACC_DELETE_TIMEOUT)), 3000)
			);
			await Promise.race([FBService.deleteUserAccount(user), timeout])
				.then(_success => {
					if (_success) {
						FBService.authDeleteCurrentUser()
							.then(success => {
								if (!success) {
									handleError(new Error(ErrorMessage.AUTH_DELETE_ERROR));
								}
								resolve(success);
							})
							.catch(err => handleError(err));
					}
				})
				.catch(err => {
					console.error(err);
					handleError(err.message);
					resolve(false);
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
		isLocalGame = false
	): Promise<Game> {
		return new Promise(resolve => {
			try {
				if (isLocalGame) {
					createLocalGame(user, players, random, minTai, maxTai, mHu, pay, sHs).then(game => {
						game.prepForNewRound(true);
						game.initRound();
						this.store.dispatch(setLocalGame(game));
						resolve(game);
					});
				} else {
					FBService.createGame(user, players, random, minTai, maxTai, mHu, pay, sHs).then(game => {
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

	/**
	 * Note that this runs a transaction -> 1 read + 1 write
	 */
	adminUpdateGame(game: Game, isLocalGame: boolean, mHu: boolean, bt: number) {
		if (isLocalGame) {
			game.f[6] = mHu;
			game.n[10] = bt;
			this.updateGame(game, true);
		} else {
			try {
				FBService.runTransactionUpdate(game.id, { mHu, bt });
			} catch (err) {
				console.error(err);
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
				console.error(err);
			}
		}
	}

	cleanupGames(userEmail: string) {
		FBService.cleanupFinishedGames(userEmail);
	}

	// For dev
	setGame(game: any) {
		FBService.setGame(game);
	}
}

const ServiceInstance = new Service();
export default ServiceInstance;
