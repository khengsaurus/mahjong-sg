import firebase from 'firebase/app';
import 'firebase/firestore';
import { Game } from '../components/Models/Game';
import { User, userToObj } from '../components/Models/User';
import { objsToUsers } from '../util/utilFns';
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
			t.set(userReprNew, { username, photoUrl: '', currentGame: '', currentTiles: '' });
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
export const getGameById = async (game?: Game, gameId?: string) => {
	if (!game && !gameId) {
		return null;
	} else {
		let game_id = game ? game.id : gameId;
		return gameRef.doc(game_id).get();
	}
};

export const createGame = async (players: User[]): Promise<Game> => {
	let playerObjs = players.map(function (player) {
		return userToObj(player);
	});
	return new Promise((resolve, reject) => {
		let gameId = '';
		try {
			gameRef
				.add({
					players: playerObjs,
					player1: null,
					player2: null,
					player3: null,
					player4: null,
					stage: 0,
					tiles: [],
					ongoing: true
				})
				.then(newGame => {
					console.log('Game created successfully: gameId ' + gameId);
					const game: Game = new Game(newGame.id, players);
					resolve(game);
				});
		} catch (err) {
			console.log('firebaseService: Game was not created');
			reject(err);
		}
	});
};

// Update players in a game & player hands
export const updateGame = (
	game: Game,
	player1: User,
	player2?: User,
	player3?: User,
	player4?: User
): Promise<Game> => {
	return new Promise(async (resolve, reject) => {
		try {
			const currentGameRef = gameRef.doc(game.id);
			const playerRef1 = userRepr.doc(player1.id);
			const playerRef2 = player2 ? userRepr.doc(player2.id) : null;
			const playerRef3 = player3 ? userRepr.doc(player3.id) : null;
			const playerRef4 = player4 ? userRepr.doc(player4.id) : null;
			await db.runTransaction(async t => {
				t.set(currentGameRef, { ...game });
				t.set(playerRef1, { ...player1 });
				playerRef2 && t.set(playerRef2, { ...player2 });
				playerRef2 && t.set(playerRef3, { ...player3 });
				playerRef2 && t.set(playerRef4, { ...player4 });
			});
			resolve(game);
		} catch (err) {
			console.log('firebaseService: Game was not updated');
			reject(err);
		}
	});
};
