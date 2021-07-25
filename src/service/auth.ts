import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

class AuthController {
	public user: firebase.User;

	constructor() {
		this.init();
	}

	init() {
		firebase.initializeApp(firebaseConfig);
		firebase.auth().onAuthStateChanged(user => {
			this.user = user;
		});
	}

	async loginAnon(): Promise<firebase.auth.UserCredential> {
		try {
			return await firebase.auth().signInAnonymously();
		} catch (err) {
			console.log(err);
		}
	}
}

export const AuthService = new AuthController();
