import firebase from 'firebase';
import moment from 'moment';

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
			return {
				id: data.id,
				username: data.username,
				photoUrl: data.photoUrl
			};
		}
	} else if (method === 2) {
		let data = obj as firebase.firestore.DocumentData;
		if (data.docs[0].id === undefined || data.docs[0].data().username === undefined) {
			throw new Error('Failed to retrieve user data');
		} else {
			return {
				id: data.docs[0].id,
				username: data.docs[0].data().username,
				photoUrl: data.docs[0].data().photoUrl
			};
		}
	} else {
		return null;
	}
}

export function typeCheckContact(contactId: string, contactData: any): User {
	return {
		id: contactId,
		username: contactData.username,
		photoUrl: contactData.photoUrl
	};
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
				let tile: Tile = { card: `${number}-${suit}-${index}`, show: false };
				tiles.push(tile);
			});
		});
		daPai.forEach(pai => {
			let tile: Tile = { card: `${pai}-${index}`, show: false };
			tiles.push(tile);
		});
	});
	console.log(`Generated ${tiles.length} tiles`);
	return shuffle(tiles);
}

export function initRound(game: Game): Game {
	game.stage += 1;
	game.tiles = generateShuffledTiles();
	//TODO: TODO: TODO: TODO: TODO: Distribute tiles
	return game;
}
