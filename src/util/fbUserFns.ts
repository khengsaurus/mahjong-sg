import { compare } from 'bcryptjs';
import { User } from '../Models/User';
import FBService from '../service/FirebaseService';
import { hashPassword } from './bcrypt';
import { typeCheckContact, typeCheckUser } from './utilFns';

export async function getUser(userId: string) {
	return new Promise<User>((resolve, reject) => {
		FBService.getUserReprById(userId).then(res => {
			if (res.exists) {
				resolve(typeCheckContact(userId, res.data()));
			} else {
				reject(null);
			}
		});
	});
}

export function attemptLogin(values: loginParams): Promise<User> {
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
										let user: User | null = typeCheckUser(2, userData);
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

export async function attemptRegister(values: registerParams): Promise<boolean> {
	return new Promise((resolve, reject) => {
		FBService.getUserReprByUsername(values.username).then(data => {
			if (!data.empty) {
				reject(new Error('Username already taken'));
			} else {
				hashPassword(values.password).then(hashedPassword => {
					FBService.register(values.username, hashedPassword)
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
