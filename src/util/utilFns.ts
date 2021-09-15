import { createTheme } from '@material-ui/core/styles';
import firebase from 'firebase';
import moment from 'moment';
import { BackgroundColors, IPlayerComponentProps, Sizes, TableColors, TileColors } from '../global/enums';
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
 * Overloaded method to resolve User object from IJwtData or firebase.firestore.DocumentData
 * @param: IJwtData | firebase.firestore.DocumentData
 * @returns: new User(id, username, photoUrl, email);
 */
export function objToUser(obj: firebase.firestore.DocumentData): User;
export function objToUser(obj: IJwtData): User;
export function objToUser(obj: any): User {
	let user: User = null;
	let ref: any = null;
	let id = '';
	try {
		if (obj.docs) {
			ref = obj.docs[0].data();
			id = obj.docs[0].id;
		} else {
			ref = obj as IJwtData;
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

export function sortTiles(tiles: ITile[]): ITile[] {
	return tiles.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
}

export function indexOfCard(tile: ITile, tiles: ITile[]) {
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

export function addClassToElement(ITiled: string, className: string) {
	try {
		var e = document.getElementById(ITiled);
		if (!e.classList.contains(className)) {
			e.classList.add(className);
		}
	} catch (err) {
		console.log(`Element with id ${ITiled} not found`);
	}
}

export function removeClassFromElement(ITiled: string, className: string) {
	try {
		var e = document.getElementById(ITiled);
		e.classList.remove(className);
	} catch (err) {
		console.log(`Element with id ${ITiled} not found`);
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

//FIXME: player component not rerendering after tile is thrown and taken by another player
export function comparePlayerProps(prev: IPlayerComponentProps, next: IPlayerComponentProps) {
	return (
		prev.player.showTiles === next.player.showTiles &&
		prev.player.allHiddenTiles().length === next.player.allHiddenTiles().length &&
		prev.player.shownTiles.length === next.player.shownTiles.length &&
		prev.player.discardedTiles.length === next.player.discardedTiles.length &&
		prev.player.lastDiscardedTileUUID() === next.player.lastDiscardedTileUUID() &&
		prev.player.unusedTiles === next.player.unusedTiles &&
		prev.hasFront === next.hasFront &&
		prev.hasBack === next.hasBack &&
		prev.tilesSize === next.tilesSize &&
		prev.lastThrown?.id === next.lastThrown?.id
	);
	/**
	 * WAS the last one to throw?
	 * 	Yes -> still IS the last one to throw? -> true/false
	 * 	No -> IS the last one to throw? -> false/true
	 */
	// prev.player.lastDiscardedITiles(prev.lastThrown)
	// ? prev.player.lastDiscardedITiles(next.lastThrown)
	// : next.player.lastDiscardedITiles(next.lastThrown)
	// ? false
	// : true
}

export function sortShownTiles(tiles: ITile[]): ShownTiles {
	let flowers: ITile[] = tiles.filter(tile => tile.suit === '花' || tile.suit === '动物') || [];
	let nonFlowers: ITile[] = tiles.filter(tile => tile.suit !== '花' && tile.suit !== '动物') || [];
	return { flowers, nonFlowers };
}

export function rotateShownTiles(tiles: ITile[]): ITile[] {
	let copy = [...tiles];
	let temp: ITile;
	let j: number;
	let k: number;
	if (tiles.length > 0) {
		try {
			//TODO: edge case - 3 kangs
			if (tiles.length % 3 === 0) {
				for (let i = 0; i < tiles.length; i += 3) {
					j = i + 2;
					if (tiles[i].card !== tiles[j].card) {
						temp = tiles[i];
						tiles[i] = tiles[j];
						tiles[j] = temp;
					}
				}
			} else {
				for (let i = 0; i < tiles.length; i += 3) {
					if (tiles.length - i !== 4) {
						k = i + 3;
						if (tiles.length > k + 1 && tiles[i].card === tiles[k].card) {
							i += 1;
						} else {
							j = i + 2;
							if (tiles[i].card !== tiles[j].card) {
								temp = tiles[i];
								tiles[i] = tiles[j];
								tiles[j] = temp;
							}
						}
					}
				}
			}
		} catch (err) {
			console.log(err);
			return copy;
		}
	}
	return tiles;
}
