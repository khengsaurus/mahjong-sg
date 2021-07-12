import firebase from 'firebase';
import moment from 'moment';
import { Game } from '../components/Models/Game';
import { User } from '../components/Models/User';

export interface ChatListObject {
	corresId: string;
	msg: string;
	createdAt: Date;
	sent: string;
}

interface jwtData {
	id: string;
	username: string;
	photoUrl: string;
	iat: number;
	exp: number;
}

/* How to overload method with ONE object argument? */
export function typeCheckUser(method: number, obj: unknown): User | null {
	if (method === 1) {
		let data = obj as jwtData;
		if (data.id === undefined || data.username === undefined || data.photoUrl === undefined) {
			throw new Error('Failed to parse jwt');
		} else {
			return new User(data.id, data.username, data.photoUrl);
		}
	} else if (method === 2) {
		let data = obj as firebase.firestore.DocumentData;
		if (data.docs[0].id === undefined || data.docs[0].data().username === undefined) {
			throw new Error('Failed to retrieve user data');
		} else {
			return new User(data.docs[0].id, data.docs[0].data().username, data.docs[0].data().photoUrl);
		}
	} else {
		return null;
	}
}

export function typeCheckContact(contactId: string, contactData: any): User {
	return new User(contactId, contactData.username, contactData.photoUrl);
}

export function processContactData(user: User, contactData: firebase.firestore.DocumentData): Map<string, User> {
	let newMap = new Map<string, User>();
	let contactMap = contactData.data();
	for (const [contactId, contactData] of Object.entries(contactMap)) {
		if (contactId !== user.id) {
			let contact = typeCheckContact(contactId, contactData);
			newMap.set(contact.id, contact);
		}
	}
	return newMap;
}

export function formatFirestoreTimestamp(date: firebase.firestore.Timestamp): string {
	return moment(date.toDate()).format('DD/MM/YY, h:mm a');
}

export function formatDateToDay(date: Date): string {
	let days: number = moment(date).diff(new Date(), 'days');
	if (days <= 1) {
		return 'Today';
	} else if (days < 7) {
		return moment(date).format('dddd');
	} else {
		return moment(date).format('DD/MM/YY');
	}
}

export function typeCheckChatListObject(corresId: string, msgData: any): ChatListObject {
	if (msgData.msg === undefined || msgData.createdAt === undefined || msgData.sent === undefined) {
		throw new Error('Failed to retrieve message data');
	} else {
		return {
			corresId,
			msg: msgData.msg || '',
			// createdAt : msgData.createdAt,
			createdAt: msgData.createdAt.toDate() || null,
			sent: msgData.sent || ''
		};
	}
}

export function objsToUsers(users: any[]): User[] {
	return users.map(function (user) {
		return new User(user.id, user.username, user.photoUrl);
	});
}

export function typeCheckGame(data: firebase.firestore.DocumentData): Game | null {
	if (data.docs[0].id === undefined || data.docs[0].data().players === undefined) {
		throw new Error('Failed to retrieve game data');
	} else {
		return new Game(data.docs[0].id, data.docs[0].data().players);
	}
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array: any[]) {
	var currentIndex = array.length,
		randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}

// export function assignUserSeats(newGame:Game):Game {
// 	game.1 = game.players[0];
// 	game.2 = game.players[1];
// 	return game
// }

export function generateShuffledTiles(): Tile[] {
	let tiles: Tile[] = [];
	const oneToFour = [1, 2, 3, 4];
	const oneToNine = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const suits = ['万', '筒', '索'];
	const daPai = ['东', '南', '西', '北', '红中', '白般', '发财'];
	oneToFour.forEach(index => {
		suits.forEach(suit => {
			oneToNine.forEach(number => {
				let tile: Tile = { card: `${number}${suit}`, index, show: false };
				tiles.push(tile);
			});
		});
		daPai.forEach(pai => {
			let tile: Tile = { card: pai, index, show: false };
			tiles.push(tile);
		});
	});
	console.log(`Generated ${tiles.length} tiles`);
	return shuffle(tiles);
}

export function giveTiles(tiles: Tile[], n: number, player: User) {
	for (let i: number = 1; i <= n; i++) {
		player.tiles = [...player.tiles, tiles.pop()];
	}
}

export function distributeTiles(game: Game): Game {
	const { tiles, player1, player2, player3, player4 } = game;
	giveTiles(tiles, 4, player1);
	giveTiles(tiles, 4, player2);
	giveTiles(tiles, 4, player3);
	giveTiles(tiles, 4, player4);
	giveTiles(tiles, 4, player1);
	giveTiles(tiles, 4, player2);
	giveTiles(tiles, 4, player3);
	giveTiles(tiles, 4, player4);
	giveTiles(tiles, 4, player1);
	giveTiles(tiles, 4, player2);
	giveTiles(tiles, 4, player3);
	giveTiles(tiles, 4, player4);
	giveTiles(tiles, 1, player1);
	giveTiles(tiles, 1, player2);
	giveTiles(tiles, 1, player3);
	giveTiles(tiles, 1, player4);
	giveTiles(tiles, 1, player1);
	console.log('Player 1 no. tiles: ', player1.tiles.length);
	console.log('Player 2 no. tiles: ', player2.tiles.length);
	console.log('Tiles left: ', tiles.length);
	return game;
}

export function initRound(game: Game): Game {
	game.stage += 1;
	game.tiles = generateShuffledTiles();
	distributeTiles(game);
	// Update game doc
	// Update user doc x4
	return game;
}
