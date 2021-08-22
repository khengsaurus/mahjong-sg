import { compare } from 'bcryptjs';
import { User } from '../Models/User';
import FBService from '../service/MyFirebaseService';
import { hashPassword } from './bcrypt';
import { objToUser } from './utilFns';

/*---------------------------------------- To decommission ----------------------------------------*/
export async function attemptLoginUserPass(values: UserPass): Promise<User> {
	if (!FBService.userAuthenticated()) {
		console.log('Logging into firebase anonymously');
		await FBService.authLoginAnon().catch(err => {
			console.log(err);
		});
	}
	return new Promise((resolve, reject) => {
		try {
			/* Access validation data from firebase - 1 read */
			FBService.getUserValByUsername(values.username).then(data => {
				if (data.empty || data.docs[0] === undefined) {
					reject(new Error('Username or password incorrect'));
				} else {
					/* If entered password matches stored user password, accept sign in, proceed to retrieve userRepr & 
						userContacts data, calling 2 more reads. If all are successful, resolve with user object */
					compare(values.password, data.docs[0].data().password)
						.catch(err => {
							reject(err.toString());
						})
						.then(res => {
							if (res) {
								FBService.getUserReprByUsername(values.username)
									.catch(err => {
										reject(new Error('Login attempt failed'));
									})
									.then(userData => {
										let user: User | null = objToUser(2, userData);
										if (user) {
											resolve(user);
										} else {
											reject(new Error('User object not resolved'));
										}
									});
							} else {
								reject(new Error('Username or password incorrect'));
							}
						});
				}
			});
		} catch (err) {
			reject(new Error('Login attempt failed'));
		}
	});
}

export async function attemptRegisterUserPass(values: UserPass): Promise<boolean> {
	if (!FBService.userAuthenticated()) {
		console.log('Logging into firebase anonymously');
		await FBService.authLoginAnon().catch(err => {
			console.log(err);
		});
	}
	return new Promise((resolve, reject) => {
		FBService.getUserReprByUsername(values.username).then(data => {
			if (!data.empty) {
				reject(new Error('Username already taken'));
			} else {
				hashPassword(values.password).then(hashedPassword => {
					FBService.registerByUserPass(values.username, hashedPassword)
						.catch(err => {
							reject(new Error('Unable to register user'));
						})
						.then(() => {
							resolve(true);
						});
				});
			}
		});
	});
}

/*---------------------------------------- ^ End to decommission ^ ----------------------------------------*/

export async function authRegister_EmailPass(props: EmailPass): Promise<string> {
	// let hashedPass = await hashPassword(props.password);
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

export async function authLogin_EmailPass(props: EmailPass): Promise<string> {
	// let hashedPass = await hashPassword(props.password);
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

export function resolveUser_Email(email: string): Promise<User | null> {
	return new Promise((resolve, reject) => {
		try {
			FBService.getUserReprByEmail(email).then((userData: any) => {
				if (userData.docs.length === 0) {
					console.log('User not registered -> NewUser');
					resolve(null);
				} else {
					resolve(objToUser(2, userData));
				}
			});
		} catch (err) {
			reject(new Error('Login attempt failed'));
		}
	});
}

export async function newUser_EmailUser(values: EmailUser): Promise<boolean> {
	return new Promise((resolve, reject) => {
		FBService.getUserReprByUsername(values.username).then(data => {
			if (!data.empty) {
				reject(new Error('Username already taken'));
			} else {
				FBService.registerUserEmail(values.username, values.email)
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						console.log('Unable to register user');
						reject(err);
					});
			}
		});
	});
}

export async function deleteCurrentFBUser() {
	return FBService.authDeleteCurrentUser();
}
