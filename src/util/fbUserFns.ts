import { User } from '../Models/User';
import FBService from '../service/MyFirebaseService';
import { objToUser } from './utilFns';

export async function authRegister_EmailPass(props: EmailPass): Promise<string> {
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
					resolve(objToUser(userData));
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
