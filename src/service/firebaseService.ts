import firebase from 'firebase/app';
import 'firebase/firestore';
import { Game, gameToObj } from '../Models/Game';
import { User } from '../Models/User';
import { userToObj } from '../util/utilFns';
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

/* ------------------------- User-game related ------------------------- */

export const getInvites = async (user: User) => {
	if (user) {
		return await gameRef
			.where('playerIds', 'array-contains', user.id)
			.where('ongoing', '==', true)
			// .orderBy('createdAt', 'desc')
			.limit(5)
			.get();
	} else {
		return null;
	}
};

export const listenInvitesSnapshot = (user: User, observer: any) => {
	if (user) {
		return (
			gameRef
				.where('playerIds', 'array-contains', user.id)
				.where('ongoing', '==', true)
				// .orderBy('createdAt', 'desc')
				.limit(5)
				.onSnapshot(observer)
		);
	} else {
		return null;
	}
};

export const updateGameAndUsers = (game: Game): Promise<Game> => {
	return new Promise(async (resolve, reject) => {
		try {
			const currentGameRef = gameRef.doc(game.id);
			// const playerRef1 = userRepr.doc(game.player1.id);
			// const playerRef2 = userRepr.doc(game.player2.id);
			// const playerRef3 = userRepr.doc(game.player3.id);
			// const playerRef4 = userRepr.doc(game.player4.id);
			await db.runTransaction(async t => {
				t.set(currentGameRef, { ...game });
				// t.set(playerRef1, { ...game.player1 });
				// t.set(playerRef2, { ...game.player2 });
				// t.set(playerRef3, { ...game.player3 });
				// t.set(playerRef4, { ...game.player4 });
			});
			resolve(game);
		} catch (err) {
			reject(new Error('firebaseService: game and user docs were not updated'));
		}
	});
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

export const createGame = async (user: User, players: User[]): Promise<Game> => {
	let playerIds: string[] = [];
	let playersString: string = '';
	players.forEach(player => {
		playerIds.push(player.id);
		playersString += player.username + ' ';
	});
	return new Promise((resolve, reject) => {
		let gameId = '';
		let createdAt = new Date();
		try {
			gameRef
				.add({
					creator: user.username,
					createdAt,
					stage: 0,
					ongoing: true,
					midRound: false,
					dealer: 0,
					flagProgress: false,
					whoseMove: 0,
					playerIds,
					playersString,
					players: players.map(function (player: User) {
						return userToObj(player);
					}),
					tiles: [],
					frontTiles: 0,
					backTiles: 0,
					lastThrown: {},
					thrownBy: 0
				})
				.then(newGame => {
					console.log('Game created successfully: gameId ' + gameId);
					const game: Game = new Game(
						newGame.id,
						user.username,
						createdAt,
						0,
						true,
						null,
						false,
						false,
						null,
						playerIds,
						playersString,
						[],
						[],
						null,
						null,
						null,
						null
					);
					resolve(game);
				});
		} catch (err) {
			console.log('firebaseService: Game was not created');
			reject(err);
		}
	});
};

export const updateGame = (game: Game): Promise<Game> => {
	return new Promise(async (resolve, reject) => {
		try {
			let gameObj = gameToObj(game);
			console.log(gameObj);
			const currentGameRef = gameRef.doc(game.id);
			await currentGameRef.set({ ...gameObj }).then(() => {
				resolve(game);
				console.log('firebaseService: game doc was updated');
			});
		} catch (err) {
			console.log(err);
			reject(new Error('firebaseService: game doc was not updated'));
		}
	});
};

export const listenToGame = (game: Game, observer: any) => {
	if (game) {
		return gameRef.doc(game.id).onSnapshot(observer);
	}
};
