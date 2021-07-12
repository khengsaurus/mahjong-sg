import { compare } from 'bcryptjs';
import { User } from '../components/Models/User';
import * as firebaseService from '../service/firebaseService';
import { hashPassword } from './bcrypt';
import { typeCheckContact, typeCheckUser } from './utilFns';

interface handleUserSelectRes {
	change: boolean;
	newContacts: Map<string, User>;
}

export interface loginParams {
	username: string;
	password: string;
}

export interface registerParams {
	username: string;
	password: string;
}

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

/* On selecting a corres, if corres not in contacts or if username/photoUrl is different, add to/update contacts and initialise chat */
export async function handleUserSelect(
	user: User,
	corres: User,
	contacts: Map<string, User>
): Promise<handleUserSelectRes> {
	console.log('firebaseServiceUtil.handleUserSelect - called');
	let change = false;
	let newContacts = new Map(contacts);
	return new Promise((resolve, reject) => {
		let existingContact = contacts.get(corres.id);
		if (existingContact) {
			if (existingContact.username !== corres.username || existingContact.photoUrl !== corres.photoUrl) {
				try {
					firebaseService.addUserContact(user, corres);
				} catch (err) {
					reject(new Error('firebaseServiceUtil.handleUserSelect - Unable to update contact information'));
				}
				change = true;
				newContacts.set(corres.id, corres);
			}
		} else {
			try {
				firebaseService.addUserContact(user, corres);
			} catch (err) {
				reject(new Error('firebaseServiceUtil.handleUserSelect - Unable to add user'));
			}
			change = true;
			newContacts.set(corres.id, corres);
		}
		resolve({ change, newContacts });
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
							// resetForm();
							// setUsernameTakenError('');
							// setSuccess(true);
						});
				});
			}
		});
	});
}
