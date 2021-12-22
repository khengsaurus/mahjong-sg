import FBService from 'platform/service/MyFirebaseService';
import { Game, User } from 'shared/models';
import { objToUser } from 'shared/util/parsers';

export function FBAuthenticated() {
	return FBService.userAuthenticated();
}

export async function FBAuthRegister_EmailPass(props: IEmailPass): Promise<string> {
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

export async function FBAuthLogin_EmailPass(props: IEmailPass): Promise<string> {
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

export function FBResolveUser_Email(email: string): Promise<User | null> {
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

export async function FBNewUser_EmailUser(values: IEmailUser): Promise<boolean> {
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

export function FBUpdateUser(id: string, keyVal: object) {
	return FBService.updateUser(id, keyVal);
}

export function FBAuthLogout() {
	FBService.authLogout();
}

export function FBDeleteCurrentFBUser() {
	return FBService.authDeleteCurrentUser();
}

export function FBSearchUser(uN: string, currUN: string) {
	return FBService.searchUser(uN, currUN);
}

export function FBListenInvites(user: User, observer: any) {
	return FBService.listenInvitesSnapshot(user, observer);
}

export function FBInitGame(
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
				FBUpdateGame(game).then(() => {
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

export function FBListenToGame(id: string, observer: any) {
	return FBService.listenToGame(id, observer);
}

export function FBUpdateGame(game: Game): Promise<Game> {
	return FBService.updateGame(game);
}

export function FBDeclareHuTransaction(hu: boolean, playerSeat: number, player: User, game: Game): Promise<Boolean> {
	return FBService.handleDeclareHu(hu, playerSeat, player.uN, game.id);
}
