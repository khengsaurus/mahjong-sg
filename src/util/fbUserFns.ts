import { compare } from 'bcryptjs';
import { User } from '../Models/User';
import * as firebaseService from '../service/firebaseService';
import { hashPassword } from './bcrypt';
import { typeCheckContact, typeCheckUser } from './utilFns';

export async function getUser(userId: string) {
	return new Promise<User>((resolve, reject) => {
		firebaseService.getUserReprById(userId).then(res => {
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
			firebaseService.getUserValByUsername(values.username).then(data => {
				if (data.empty || data.docs[0] === undefined) {
					reject(new Error('Username or password incorrect'));
				} else {
					/* If entered password matches stored user password, accept sign in, proceed to retrieve userRepr & 
					userContacts data, calling 2 more reads. If all are successful, update AppContext.user */
					compare(values.password, data.docs[0].data().password)
						.catch(err => {
							reject(err.toString());
						})
						.then(res => {
							if (res) {
								firebaseService
									.getUserReprByUsername(values.username)
									.catch(err => {
										reject(new Error('Login attempt failed'));
									})
									.then(userData => {
										let user: User | null = typeCheckUser(2, userData);
										user ? resolve(user) : reject(new Error('User object not resolved'));
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

export function attemptRegister(values: registerParams): Promise<boolean> {
	return new Promise((resolve, reject) => {
		firebaseService.getUserReprByUsername(values.username).then(data => {
			if (!data.empty) {
				reject(new Error('Username already taken'));
			} else {
				hashPassword(values.password).then(hashedPassword => {
					firebaseService
						.register(values.username, hashedPassword)
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
