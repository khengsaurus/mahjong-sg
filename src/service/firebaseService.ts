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
		await db.runTransaction(async t => {
			t.set(userValNew, { username, password });
			t.set(userReprNew, { username, photoUrl: '', groups: [] });
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

export const searchUser = (partUsername: string) => {
	return userRepr
		.where('username', '>=', partUsername)
		.where('username', '<=', partUsername + '\uf8ff')
		.limit(5)
		.get();
};

export const createGroup = async (user: User, groupName: string, users: User[]) => {
	const userRef = userRepr.doc(user.id);
	await userRef.update({ groups: { [groupName]: users } });
};

export const searchGroups = async (user: User, partGroupName: string) => {
	return new Promise((resolve, reject) => {
		let groups: Group[] = [];
		userRepr
			.doc(user.id)
			.get()
			.then(data => {
				groups = data.data().groups;
				// filter group.name like partGroupName
			})
			.catch(err => {
				console.log(err);
				groups = [];
			});
		resolve(groups);
	});
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
		let createdAt = new Date();
		try {
			gameRef
				.add({
					creator: user.username,
					createdAt,
					stage: 0,
					previousStage: -1,
					ongoing: true,
					midRound: false,
					dealer: 0,
					flagProgress: true,
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
					thrownBy: 0,
					thrownTile: false,
					takenTile: true,
					uncachedAction: false,
					hu: [],
					initRound: [true, false]
				})
				.then(newGame => {
					console.log(`Game created successfully: gameId ${newGame.id}`);
					const game: Game = new Game(
						newGame.id,
						user.username,
						createdAt,
						playersString,
						true,
						0,
						-1,
						null,
						false,
						true,
						0,
						playerIds,
						players,
						[],
						null,
						null,
						null,
						null,
						false,
						true,
						false,
						[]
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
			let gameObj = await gameToObj(game);
			const currentGameRef = await gameRef.doc(game.id);
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

export const listenToGame = (gameId: string, observer: any) => {
	if (gameId) {
		return gameRef.doc(gameId).onSnapshot(observer);
	}
};
