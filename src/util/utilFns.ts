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
	} else if (method === 3) {
		let data = obj as any;
		if (!data.id || !data.username) {
			throw new Error('Failed to retrieve user data');
		} else {
			return new User(data.id, data.username, data.photoUrl, data.tiles);
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
	return moment(date).format('DD/MM/YY, h:mm a');
	// let days: number = moment(date).diff(new Date(), 'days');
	// if (days <= 1) {
	// 	return 'Today';
	// } else if (days < 7) {
	// 	return moment(date).format('dddd');
	// } else {
	// 	return moment(date).format('DD/MM/YY');
	// }
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
	if (users) {
		return users.map(function (user) {
			return new User(user.id, user.username, user.photoUrl);
		});
	} else {
		return [];
	}
}

export function userToObj(user: User) {
	return {
		id: user.id,
		username: user.username,
		photoUrl: user.photoUrl,
		currentSeat: user.currentSeat || 0,
		tiles: user.tiles
			? user.tiles.map((tile: Tile) => {
					return tileToObj(tile);
			  })
			: []
	};
}

export function tileToObj(tile: Tile) {
	return {
		card: tile.card,
		index: tile.index,
		show: tile.show
	};
}

export const typeCheckGame = (doc: firebase.firestore.DocumentData | any): Game => {
	let ref = doc.data();
	return new Game(
		doc.id,
		ref.createdAt.toDate() || null,
		ref.stage,
		ref.ongoing,
		ref.midRound,
		ref.whoseMove,
		ref.playerIds,
		ref.playersString,
		ref.player1 && ref.player1.id ? typeCheckUser(3, ref.player1) : null,
		ref.player2 && ref.player2.id ? typeCheckUser(3, ref.player2) : null,
		ref.player3 && ref.player3.id ? typeCheckUser(3, ref.player3) : null,
		ref.player4 && ref.player4.id ? typeCheckUser(3, ref.player4) : null,
		ref.players.map((player: any) => {
			return typeCheckUser(3, player);
		}),
		ref.tiles.map((tile: any) => {
			return typeCheckTile(tile);
		}),
		ref.userBal
	);
};

export function typeCheckTile(data: any): Tile {
	let tile: Tile;
	try {
		tile = { card: data.card, index: data.index, show: data.show };
	} catch (err) {
		console.log('Unable to create tile - ', err.msg);
		tile = null;
	}
	return tile;
}
