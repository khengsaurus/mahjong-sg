import firebase from 'firebase';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { BackgroundColors, CardCategories, Sizes, Suits, TableColors, TileColors } from 'shared/enums';
import { Game, User } from 'shared/models2';

export function userToObj(user: User) {
	return {
		id: user.id,
		uN: user.uN,
		pUrl: user.pUrl,
		email: user.email,
		hSz: user.hSz,
		tSz: user.tSz,
		cSz: user.cSz,
		bgC: user.bgC,
		tC: user.tC,
		tBC: user.tBC
	};
}

/**
 * Overloaded method to resolve User object from IJwtData or firebase.firestore.DocumentData
 * @param: IJwtData | firebase.firestore.DocumentData
 * @returns: new User(id, uN, pUrl, email);
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
		user = new User(id, ref.uN, ref.pUrl, ref.email, ref.hSz, ref.tSz, ref.cSz, ref.bgC, ref.tC, ref.tBC);
	} catch (err) {
		console.error(err.message + 'Failed to resolve user object');
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
		data.uN,
		data.pUrl,
		data.email || '',
		Sizes.MEDIUM,
		Sizes.MEDIUM,
		Sizes.MEDIUM,
		BackgroundColors.BROWN,
		TableColors.BROWN,
		TileColors.GREEN,
		data.sTs,
		data.melds,
		data.hTs,
		data.dTs,
		data.lTaken,
		data.uTs,
		data.bal,
		data.sT
	);
}

export function playerToObj(user: User) {
	return {
		id: user.id,
		uN: user.uN,
		pUrl: user.pUrl,
		email: '',
		hTs: user.hTs || [],
		sTs: user.sTs || [],
		melds: user.melds || [],
		dTs: user.dTs || [],
		lTaken: user.lTaken || {},
		uTs: user.uTs || 0,
		bal: user.bal || 0,
		sT: user.sT || false
	};
}

export const objToGame = (doc: firebase.firestore.DocumentData, repr: boolean): Game => {
	let ref = doc.data();
	if (repr) {
		// return new Game(doc.id, ref.cro, ref.crA.toDate(), ref.pS, ref.es, ref.on);
		return new Game(doc.id, ref.cro, ref.crA.toDate(), ref.pS, ref.on);
	} else {
		return new Game(
			doc.id,
			ref.cro,
			ref.crA.toDate(),
			ref.pS,
			ref.es,
			Boolean(ref.on),
			// Number(ref.lastExec),
			ref.up.toDate(),
			ref.dFr.toDate(),
			Number(ref.st),
			Number(ref.prev),
			Number(ref.dealer),
			Boolean(ref.mid),
			Boolean(ref.fN),
			Number(ref.wM),
			ref.ps.map((player: any) => {
				return objToPlayer(player);
			}),
			ref.tiles,
			Number(ref.front),
			Number(ref.back),
			ref.lastT,
			Number(ref.tBy),
			Boolean(ref.thrown),
			Boolean(ref.taken),
			Number(ref.takenB),
			ref.hu,
			Boolean(ref.draw),
			ref.logs
		);
	}
};

export function gameToObj(game: Game) {
	return {
		id: game.id || '',
		cro: game.cro || '',
		crA: game.crA || new Date(),
		pS: game.pS || '',
		es: game.es || [],
		on: game.on || true,
		// lastExec: game.lastExec || 0,
		up: game.up || new Date(),
		dFr: game.dFr || new Date(),
		st: game.st || 0,
		prev: game.prev || 0,
		dealer: game.dealer || 0,
		mid: game.mid || false,
		fN: game.fN || false,
		wM: game.wM || 0,
		ps: game.ps
			? game.ps.map(player => {
					return playerToObj(player);
			  })
			: [],
		tiles: game.tiles,
		front: game.front || 0,
		back: game.back || 0,
		lastT: game.lastT || {},
		tBy: game.tBy || 0,
		thrown: game.thrown || false,
		taken: game.taken || false,
		takenB: game.takenB || 0,
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

export function sortTiles(tiles: IShownTile[]): IShownTile[] {
	return tiles.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
}

export function indexOfCard(tile: IShownTile, tiles: IShownTile[]) {
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
		console.error(`Element with id ${ITiled} not found`);
	}
}

export function removeClassFromElement(ITiled: string, className: string) {
	try {
		var e = document.getElementById(ITiled);
		e.classList.remove(className);
	} catch (err) {
		console.error(`Element with id ${ITiled} not found`);
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

export function sortShownTiles(tiles: IShownTile[]): ShownTiles {
	const flowers: IShownTile[] = tiles.filter(tile => tile.suit === Suits.FLOWER || tile.suit === Suits.ANIMAL) || [];
	const nonFlowers: IShownTile[] =
		tiles.filter(tile => tile.suit !== Suits.FLOWER && tile.suit !== Suits.ANIMAL) || [];
	const flowerIds = flowers.map(tile => tile.id);
	const nonFlowerIds = nonFlowers.map(tile => tile.id);
	return { flowers, nonFlowers, flowerIds, nonFlowerIds };
}

export function rotateShownTiles(tiles: IShownTile[], melds: string[]): IShownTile[] {
	let temp: IShownTile;
	let i = 0;
	let j = 0;
	while (i < tiles.length && j < melds.length) {
		if (melds[j][0] === 'k') {
			i += 4;
		} else if (melds[j][0] === 'c') {
			temp = tiles[i];
			tiles[i] = tiles[i + 2];
			tiles[i + 2] = temp;
			i += 3;
		} else {
			i += 3;
		}
		j += 1;
	}
	return tiles;
}

export function findTwo(id: string, arr: any[], field?: string): boolean {
	if (!id || id === '' || isEmpty(arr)) {
		return false;
	} else {
		let flag = false;
		let arrToSearch: string[] = arr.map(t => t[field] || '');
		for (let n = 0; n < arrToSearch?.length; n++) {
			if (arrToSearch[n].includes(id)) {
				if (flag) {
					return true;
				} else {
					flag = true;
				}
			}
		}
		return false;
	}
}

export function addSecondsToDate(t: Date, s: number): Date {
	return t ? new Date(t?.getTime() + s * 1000) : null;
}

export function indexToWind(n: number): string {
	switch (n) {
		case 0:
			return '東';
		case 1:
			return '南';
		case 2:
			return '西';
		case 3:
			return '北';
		default:
			return '';
	}
}

export function randomNum(n: number) {
	return Math.round(Math.random() * n);
}

export function isHua(tile: IShownTile) {
	return tile.suit === Suits.ANIMAL || tile.suit === Suits.FLOWER;
}

export function getTileHashKey(gameId: string, st: number) {
	let i = Math.min(st, gameId.length - 1);
	return gameId.charCodeAt(i) + st;
}

export function hashTileString(id: string, tileHashKey: number): string {
	let hashId = '';
	if (id && id !== '') {
		id.split('').forEach(i => {
			hashId += `${i.charCodeAt(0) + tileHashKey}|`;
		});
	}
	return hashId;
}

export function hashTile(tile: IShownTile, tileHashKey: number): IHiddenTile {
	return { id: hashTileString(tile.id, tileHashKey), ref: tile.ref };
}

export function getHashCardFromHashId(id: string): string {
	let pieces = id.split('|');
	switch (String.fromCharCode(Number(pieces[0]))) {
		case CardCategories.REGULAR:
			return `${pieces[3]}|${pieces[2]}`;
		case CardCategories.WINDS:
		case CardCategories.HBF:
		case CardCategories.FLOWER:
		case CardCategories.ANIMAL:
			return pieces[2];
		default:
			return '';
	}
}

export function getCardFromUnhashedId(id: string): string {
	switch (id[0]) {
		case CardCategories.REGULAR:
		case CardCategories.HBF:
			return `${id[2]}${id[3]}`;
		case CardCategories.WINDS:
		case CardCategories.FLOWER:
		case CardCategories.ANIMAL:
			return `${id[2]}`;
		default:
			return ``;
	}
}

export function getSuitFromUnhashedId(id: string): Suits {
	switch (id[0]) {
		case CardCategories.REGULAR:
			return `${id[3]}` as Suits;
		case CardCategories.WINDS:
		case CardCategories.HBF:
			return Suits.DAPAI;
		case CardCategories.FLOWER:
			return Suits.FLOWER;
		case CardCategories.ANIMAL:
			return Suits.ANIMAL;
		default:
			return Suits._;
	}
}

export function getIxFromUnhashedId(id: string): number {
	switch (id[0]) {
		case CardCategories.REGULAR:
			return Number(id[4]);
		case CardCategories.WINDS:
		case CardCategories.HBF:
			return Number(id[3]);
		default:
			return 1;
	}
}

export function revealTile(hashedTile: IHiddenTile, tileHashKey: number): IShownTile {
	let nums = [];
	hashedTile.id.split('|').forEach(piece => {
		if (!!Number(piece)) {
			let num = Number(piece) - tileHashKey;
			nums = [...nums, num];
		}
	});
	let id = String.fromCharCode(...nums);
	return {
		id,
		card: getCardFromUnhashedId(id),
		suit: getSuitFromUnhashedId(id),
		num: id[0] === CardCategories.REGULAR ? Number(id[2]) : 1,
		ix: getIxFromUnhashedId(id),
		ref: hashedTile.ref
	};
}
