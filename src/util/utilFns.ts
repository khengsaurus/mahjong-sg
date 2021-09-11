import { createTheme } from '@material-ui/core/styles';
import firebase from 'firebase';
import moment from 'moment';
import { BackgroundColors, PlayerComponentProps, Sizes, TableColors, TileColors } from '../global/enums';
import { Game } from '../Models/Game';
import { User } from '../Models/User';
import isEqual from 'lodash.isequal';

export function userToObj(user: User) {
	return {
		id: user.id,
		username: user.username,
		photoUrl: user.photoUrl,
		email: user.email,
		handSize: user.handSize,
		tilesSize: user.tilesSize,
		controlsSize: user.controlsSize,
		backgroundColor: user.backgroundColor,
		tableColor: user.tableColor,
		tileBackColor: user.tileBackColor
	};
}

/**
 * Overloaded method to resolve User object from JwtData or firebase.firestore.DocumentData
 * @param: JwtData | firebase.firestore.DocumentData
 * @returns: new User(id, username, photoUrl, email);
 */
export function objToUser(obj: firebase.firestore.DocumentData): User;
export function objToUser(obj: JwtData): User;
export function objToUser(obj: any): User {
	let user: User = null;
	let ref: any = null;
	let id = '';
	try {
		if (obj.docs) {
			ref = obj.docs[0].data();
			id = obj.docs[0].id;
		} else {
			ref = obj as JwtData;
			id = ref.id;
		}
		user = new User(
			id,
			ref.username,
			ref.photoUrl,
			ref.email,
			ref.handSize,
			ref.tilesSize,
			ref.controlsSize,
			ref.backgroundColor,
			ref.tableColor,
			ref.tileBackColor
		);
	} catch (err) {
		console.log(err.message + 'Failed to resolve user object');
	} finally {
		return user;
	}
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
		data.email || '',
		Sizes.medium,
		Sizes.medium,
		Sizes.medium,
		BackgroundColors.brown,
		TableColors.brown,
		TileColors.green,
		data.shownTiles,
		data.hiddenTiles,
		data.discardedTiles,
		data.lastTakenTile,
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
		email: '',
		hiddenTiles: user.hiddenTiles || [],
		shownTiles: user.shownTiles || [],
		discardedTiles: user.discardedTiles || [],
		lastTakenTile: user.lastTakenTile || {},
		unusedTiles: user.unusedTiles || 0,
		pongs: user.pongs || [],
		balance: user.balance || startingBal || 0,
		showTiles: user.showTiles || false
	};
}

export const objToGame = (doc: firebase.firestore.DocumentData, repr: boolean): Game => {
	let ref = doc.data();
	if (repr) {
		return new Game(doc.id, ref.creator, ref.createdAt.toDate(), ref.playersString, ref.ongoing);
	} else {
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

export function sortTiles(tiles: TileI[]): TileI[] {
	return tiles.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
}

export function indexOfCard(tile: TileI, tiles: TileI[]) {
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

export function addClassToElement(tileId: string, className: string) {
	try {
		var e = document.getElementById(tileId);
		if (!e.classList.contains(className)) {
			e.classList.add(className);
		}
	} catch (err) {
		console.log(`Element with id ${tileId} not found`);
	}
}

export function removeClassFromElement(tileId: string, className: string) {
	try {
		var e = document.getElementById(tileId);
		e.classList.remove(className);
	} catch (err) {
		console.log(`Element with id ${tileId} not found`);
	}
}

export function findLeft(n: number) {
	return (n + 3) % 4;
}

export function findRight(n: number) {
	return (n + 1) % 4;
}

export function findOpp(n: number) {
	return (n + 2) % 4;
}

export function validateEmail(email: string) {
	return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

export function comparePlayerProps(prev: PlayerComponentProps, next: PlayerComponentProps) {
	return (
		prev.player.showTiles === next.player.showTiles &&
		prev.player.allHiddenTiles().length === next.player.allHiddenTiles().length &&
		prev.player.shownTiles.length === next.player.shownTiles.length &&
		prev.player.discardedTiles.length === next.player.discardedTiles.length &&
		prev.player.unusedTiles === next.player.unusedTiles &&
		prev.hasFront === next.hasFront &&
		prev.hasBack === next.hasBack &&
		prev.tilesSize === next.tilesSize &&
		isEqual(prev.lastThrown, next.lastThrown)
	);
	/**
	 * WAS the last one to throw?
	 * 	Yes -> still IS the last one to throw? -> true/false
	 * 	No -> IS the last one to throw? -> false/true
	 */
	// prev.player.lastDiscardedTileIs(prev.lastThrown)
	// ? prev.player.lastDiscardedTileIs(next.lastThrown)
	// : next.player.lastDiscardedTileIs(next.lastThrown)
	// ? false
	// : true
}
