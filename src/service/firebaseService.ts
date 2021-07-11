import firebase from 'firebase/app';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
} else {
	firebase.app();
}
const db = firebase.firestore();
const userVal = db.collection('userVal');
const userRepr = db.collection('userRepr');
const userContactsRef = db.collection('userContacts');
const gameRef = db.collection('games');

/* ------------------------- User related ------------------------- */
export const register = async (username: string, password: string) => {
	let userId = '';
	try {
		await userVal.add({}).then(user => {
			userId = user.id;
		});
		const userValNew = userVal.doc(userId);
		const userReprNew = userRepr.doc(userId);
		const userContactsRefNew = userContactsRef.doc('user: ' + userId);
		await db.runTransaction(async t => {
			t.set(userValNew, { username, password });
			t.set(userReprNew, { username, photoUrl: '' });
			t.set(userContactsRefNew, { [`${userId}`]: { username, photoUrl: '' } });
		});
		console.log('User created successfully');
	} catch (err) {
		console.log('firebaseService: User was not created - ', +err);
	}
};

export const getUserValByUsername = (username: string) => {
	return userVal.where('username', '==', username).get();
};

export const getUserReprByUsername = (username: string) => {
	return userRepr.where('username', '==', username).get();
};

export const getUserReprById = (id: string) => {
	return userRepr.doc(id).get();
};

export const getUserContacts = async (user: User) => {
	return userContactsRef.doc('user: ' + user.id).get();
};

export const addUserContact = (user: User, corres: User) => {
	userContactsRef.doc('user: ' + user.id).update(corres.id, {
		username: corres.username,
		photoUrl: corres.photoUrl
	});
	userContactsRef.doc('user: ' + corres.id).update(user.id, {
		username: user.username,
		photoUrl: user.photoUrl
	});
};

export const searchUser = (partUsername: string) => {
	return userRepr
		.where('username', '>=', partUsername)
		.where('username', '<=', partUsername + '\uf8ff')
		.limit(5)
		.get();
};

/* ------------------------- Game related ------------------------- */
export const createGame = async (players: User[]) => {
	let gameId = '';
	try {
		await gameRef.add({ ongoing: true }).then(game => {
			gameId = game.id;
		});
		console.log('Game created successfully');
		// const gameDoc = gameRef.doc(gameId);
		const game: Game = { id: gameId, ongoing: true, stage: 0, players };
		return game;
	} catch (err) {
		console.log('firebaseService: Game was not created - ', +err);
	}
};
