import firebase from 'firebase';
import moment from 'moment';
import { BackgroundColors, Sizes, TableColors, TileColors } from '../global/enums';
import { Game } from '../Models/Game';
import { User } from '../Models/User';

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
		Sizes.MEDIUM,
		Sizes.MEDIUM,
		Sizes.MEDIUM,
		BackgroundColors.BROWN,
		TableColors.BROWN,
		TileColors.GREEN,
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
		return new Game(doc.id, ref.creator, ref.createdAt.toDate(), ref.playersString, ref.emails, ref.ongoing);
	} else {
		return new Game(
			doc.id,
			ref.creator,
			ref.createdAt.toDate(),
			ref.playersString,
			ref.emails,
			Boolean(ref.ongoing),
			Number(ref.lastExec),
			ref.lastUpdated.toDate(),
			ref.pongDelayFrom.toDate(),
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

export function gameToObj(game: Game) {
	return {
		id: game.id || '',
		creator: game.creator || '',
		createdAt: game.createdAt || new Date(),
		lastExec: game.lastExec || 0,
		lastUpdated: game.lastUpdated || new Date(),
		pongDelayFrom: game.pongDelayFrom || new Date(),
		playersString: game.playersString || '',
		emails: game.emails || [],
		ongoing: game.ongoing || true,
		stage: game.stage || 0,
		previousStage: game.previousStage || 0,
		dealer: game.dealer || 0,
		midRound: game.midRound || false,
		flagProgress: game.flagProgress || false,
		whoseMove: game.whoseMove || 0,
		playerIds: game.playerIds || [],
		players: game.players
			? game.players.map(player => {
					return playerToObj(player);
			  })
			: [],
		tiles: game.tiles,
		frontTiles: game.frontTiles || 0,
		backTiles: game.backTiles || 0,
		lastThrown: game.lastThrown || {},
		thrownBy: game.thrownBy || 0,
		thrownTile: game.thrownTile || false,
		takenTile: game.takenTile || false,
		takenBy: game.takenBy || 0,
		uncachedAction: game.uncachedAction || false,
		hu: game.hu || [],
		draw: game.draw || false,
		logs: game.logs || []
	};
}

export function shuffle<T extends any[] | []>(array: T) {
	// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	var currentIndex = array.length,
		randomIndex: number;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}

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

export function sortShownTiles(tiles: ITile[]): ShownTiles {
	const flowers: ITile[] = tiles.filter(tile => tile.suit === '花' || tile.suit === '动物') || [];
	const nonFlowers: ITile[] = tiles.filter(tile => tile.suit !== '花' && tile.suit !== '动物') || [];
	const flowerIds = flowers.map(tile => tile.id);
	const nonFlowerIds = nonFlowers.map(tile => tile.id);
	return { flowers, nonFlowers, flowerIds, nonFlowerIds };
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

export function findTwoInSorted<T extends any>(i: T, arr: T[], field: string) {
	let flag = false;
	for (let n = 0; n < arr.length; n++) {
		if (i[field] && arr[n][field]) {
			if (arr[n][field] === i[field]) {
				if (flag === true) {
					return true;
				} else {
					flag = true;
				}
			}
		} else {
			if (arr[n] === i) {
				if (flag === true) {
					return true;
				} else {
					flag = true;
				}
			}
		}
	}
	return false;
}

export function addSecondsToDate(t: Date, s: number): Date {
	t.setSeconds(t.getSeconds() + s);
	return t;
}
