import { createTheme } from '@material-ui/core';
import firebase from 'firebase';
import moment from 'moment';
import { Game } from '../Models/Game';
import { User } from '../Models/User';

export function userToObj(user: User) {
	return {
		id: user.id,
		username: user.username,
		photoUrl: user.photoUrl
	};
}

/**
 * How to overload method with ONE object argument?
 * @param: 1, jwtData
 * @param: 2, firebase DocumentData
 * @returns: new User(id, username, photoUrl);
 */
export function objToUser(method: number, obj: unknown): User {
	let user: User;
	if (method === 1) {
		let data = obj as jwtData;
		try {
			user = new User(data.id, data.username, data.photoUrl);
		} catch (err) {
			throw new Error('UtilFns/objToUser method 1 - failed to parse jwt');
		}
	} else if (method === 2) {
		let data = obj as firebase.firestore.DocumentData;
		try {
			user = new User(data.docs[0].id, data.docs[0].data().username, data.docs[0].data().photoUrl);
		} catch (err) {
			throw new Error('UtilFns/objToUser method 2 - failed to retrieve user data from user document');
		}
	}
	return user;
}

export function formatFirestoreTimestamp(date: firebase.firestore.Timestamp): string {
	return moment(date.toDate()).format('DD/MM/YY, h:mm a');
}

export function formatDateToDay(date: Date): string {
	return moment(date).format('DD/MM/YY, h:mm a');
}

export function objToPlayer(data: any): User {
	return new User(
		data.id,
		data.username,
		data.photoUrl,
		data.shownTiles,
		data.hiddenTiles,
		data.discardedTiles,
		data.unusedTiles,
		data.pongs,
		data.balance,
		data.showTiles
	);
}

export function playerToObj(user: User, startingBal?: number) {
	return {
		id: user.id,
		username: user.username,
		photoUrl: user.photoUrl,
		hiddenTiles: user.hiddenTiles || [],
		shownTiles: user.shownTiles || [],
		discardedTiles: user.discardedTiles || [],
		unusedTiles: user.unusedTiles || 0,
		pongs: user.pongs || [],
		balance: user.balance || startingBal || 0,
		showTiles: user.showTiles || false
	};
}

export const objToGame = (method: number, doc: firebase.firestore.DocumentData): Game => {
	let ref = doc.data();
	if (method === 1) {
		return new Game(doc.id, ref.creator, ref.createdAt.toDate(), ref.playersString, ref.ongoing);
	} else if (method === 2) {
		return new Game(
			doc.id,
			ref.creator,
			ref.createdAt.toDate(),
			ref.playersString,
			Boolean(ref.ongoing),
			Number(ref.stage),
			Number(ref.previousStage),
			Number(ref.dealer),
			Boolean(ref.midRound),
			Boolean(ref.flagProgress),
			Number(ref.whoseMove),
			ref.playerIds,
			ref.players.map((player: any) => {
				return objToPlayer(player);
			}),
			ref.tiles,
			Number(ref.frontTiles),
			Number(ref.backTiles),
			ref.lastThrown,
			Number(ref.thrownBy),
			Boolean(ref.thrownTile),
			Boolean(ref.takenTile),
			Number(ref.takenBy),
			Boolean(ref.uncachedAction),
			ref.hu,
			Boolean(ref.draw),
			ref.logs
		);
	}
};

export function generateNumberArray(n: number) {
	let unusedTiles = [];
	for (let i: number = 0; i < n; i++) {
		unusedTiles.push(i);
	}
	return unusedTiles;
}

export function sortTiles(tiles: Tile[]): Tile[] {
	return tiles.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
}

export function indexOfCard(tile: Tile, tiles: Tile[]) {
	for (var i = 0; i < tiles.length; i++) {
		if (tiles[i].card === tile.card) {
			return i;
		}
	}
}

export const rotatedMUIDialog = createTheme({
	overrides: {
		MuiDialog: {
			root: {
				transform: 'rotate(90deg)'
			}
		}
	}
});

export const rotatedMUIButton = createTheme({
	overrides: {
		MuiButton: {
			root: {
				transform: 'rotate(90deg)'
			}
		}
	}
});

export function scrollToBottomOfDiv(id: string) {
	try {
		let logsList = document.getElementById(id);
		logsList.scrollTop = logsList.scrollHeight + 10;
	} catch (err) {
		console.log(`Element with id '${id}' not found`);
	}
}
