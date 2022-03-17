import { Haptics, ImpactStyle } from '@capacitor/haptics';
import {
	Animal,
	AnimalIndex,
	AppFlag,
	BackgroundColor,
	BotIds,
	BotTimeout,
	CardCategory,
	CardName,
	DaPai,
	DaPaiIndex,
	DateTimeFormat,
	Exec,
	Flower,
	FlowerIndex,
	LocalFlag,
	MeldType,
	PaymentType,
	Platform,
	Suit,
	SuitName,
	SuitsIndex,
	TableColor,
	TextColor,
	TileColor,
	Wind,
	WindIndex
} from 'enums';
import { HandDescEng, HandPoint, ScoringHand, Suits } from 'handEnums';
import isEmpty from 'lodash.isempty';
import { Game, User } from 'models';
import moment from 'moment';
import { ITheme } from 'typesPlus';
import { mainLRUCache } from './LRUCache';

/* ----------------------------------- Util ----------------------------------- */

export function isEmail(s: string) {
	return s === (s.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g) || [])[0];
}

export function formatFirestoreTimestamp(date: any): string {
	try {
		return moment(date.toDate()).format('DD/MM/YY, h:mm a');
	} catch (err) {
		console.error(err);
		return '';
	}
}

export function formatDate(date: Date, format: DateTimeFormat = DateTimeFormat.DDMMYYHMMA): string {
	return moment(date).format(format);
}

export function getDateTime(dt?: any, defaultNull = false) {
	if (dt) {
		if (dt instanceof Date) {
			return dt;
		}
		try {
			if (!!dt.toDate && !!dt.toDate()) {
				let r = dt.toDate();
				if (!!r && !r.toString().toUpperCase().includes(DateTimeFormat.INVALID)) {
					return r;
				}
			}
			if (dt.seconds) {
				let r = new Date(dt.seconds);
				if (!!r && !r.toString().toUpperCase().includes(DateTimeFormat.INVALID)) {
					return r;
				}
			}
		} catch (err) {
			console.error(err);
		}
	} else {
		return defaultNull ? null : new Date();
	}
}

/**
 * @description Fisher-Yates (aka Knuth) Shuffle
 * @see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export function shuffle<T extends any[] | []>(array: T) {
	var currentIndex = array.length,
		randomIndex: number;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}

export function generateNumbers(from: number, to: number) {
	let arr = [];
	for (let i = from; i <= to; i++) {
		arr.push(i);
	}
	return arr;
}

export function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function validateEmail(email: string) {
	return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

export function findTwo(id: string, arr: any[], field?: string): boolean {
	if (!id || isEmpty(arr)) {
		return false;
	} else {
		let flag = false;
		let arrToSearch: string[] = field ? arr.map(t => t[field] || '') : arr;
		for (let n = 0; n < arrToSearch?.length; n++) {
			if (arrToSearch[n]?.includes(id)) {
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

const foodEmojis = ['🍜', '🥞', '🥘', '🍕', '🍣', '🥮', '🧁', '🍩', '🍢', '🍙', '🍫', '🥟'];

export function getRandomFoodEmoji() {
	return foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
}

export function getCountPerStr(arr: string[]) {
	let counted: IObj<string, number> = {};
	let max = 0;
	arr.forEach(s => {
		let newCount = counted[s] ? counted[s] + 1 : 1;
		counted[s] = newCount;
		max = Math.max(newCount, max);
	});
	return { counted, max };
}

export function getKeysByDescVal(obj: IObj<string, number>): string[] {
	return Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
}

/**
 * @return boolean: supplied arrays are completely exclusive
 */
export function excludes<T>(a: T[], b: T[]): boolean {
	for (let i = 0; i < a.length; i++) {
		if (b.includes(a[i])) {
			return false;
		}
	}
	return true;
}

export function countStrEle(arr: string[]): IObj<string, number> {
	let r: IObj<string, number> = {};
	arr.forEach(e => (!!r[e] ? (r[e] = r[e] + 1) : (r[e] = 1)));
	return r;
}

/**
 * @param arr: any[]
 * @returns arr
 * @description
 * Will return unique elements of the input array, preserving their initial order.
 */
export function arrToSetArr<T>(arr: T[]): T[] {
	if (arr.length <= 1) {
		return arr;
	} else {
		const key = `atsa-${JSON.stringify(arr)}`;
		const cached = mainLRUCache.read(key);
		if (cached) {
			return cached;
		} else {
			if (typeof arr[0] === 'string') {
				const set = new Set<T>();
				arr.forEach(e => set.add(e));
				const r = Array.from(set);
				mainLRUCache.write(key, r);
				return r;
			} else {
				const set = new Set<string>();
				const r = [];
				arr.forEach(e => {
					if (isNewInSet(JSON.stringify(e), set)) {
						r.push(e);
					}
				});
				mainLRUCache.write(key, r);
				return r;
			}
		}
	}
}

/**
 *
 * @param arr1
 * @param arr2
 * @param field
 * @returns An array of elements common to both arr1 and arr2
 * @description Preserves the initial order in arr1
 */
export function commonEs<T>(arr1: T[], arr2: T[], field?: string): T[] {
	if (isEmpty(arr2)) {
		return arr1;
	}
	let r: T[] = [];
	if (field) {
		const _arr1F = arr1.map(e => e[field]);
		const _arr2F = arr2.map(e => e[field]);
		_arr1F.forEach(eF => {
			if (_arr2F.includes(eF)) {
				r.push(arr1.find(e => e[field] === eF));
			}
		});
	} else {
		arr1.forEach(e => {
			if (arr2.includes(e)) {
				r.push(e);
			}
		});
	}
	return arrToSetArr(r);
}

export function hasAll<T>(arr1: T[], arr2: T[]): boolean {
	let _arr1: T[] = arr2;
	let _arr2: T[] = arr1;
	if (arr1.length <= arr2.length) {
		_arr1 = arr1;
		_arr2 = arr2;
	}
	let flag = true;
	for (let i = 0; i < _arr1.length; i++) {
		if (!_arr2.includes(_arr1[i])) {
			flag = false;
			break;
		}
	}
	return flag;
}

export function getInclExcl(arr1: string[], req?: string[], fn?: (c: string) => boolean) {
	const incl = [];
	const excl = [];
	if (!isEmpty(req)) {
		arr1.forEach(s => {
			(req.includes(s) ? incl : excl).push(s);
		});
	} else if (fn) {
		arr1.forEach(s => {
			(fn(s) ? incl : excl).push(s);
		});
	}
	return { incl, excl };
}

export async function triggerHaptic(impact = ImpactStyle.Light) {
	if (isMobile()) {
		try {
			await Haptics.impact({ style: impact });
		} catch (err) {
			console.info('Platform does not support Haptics');
		}
	}
}

export function isDev() {
	return process.env.REACT_APP_FLAG?.startsWith(AppFlag.DEV);
}

export function isDevBot() {
	return process.env.REACT_APP_FLAG?.startsWith(AppFlag.DEV_BOT);
}

export function getPlatform() {
	return process.env.REACT_APP_PLATFORM === Platform.MOBILE ? Platform.MOBILE : Platform.WEB;
}

export function isMobile() {
	return getPlatform() === Platform.MOBILE;
}

/* ----------------------------------- Game ----------------------------------- */

export async function createLocalGame(
	user: User,
	ps: User[],
	random?: boolean,
	gMinPx = HandPoint.MIN,
	gMaxPx = HandPoint.MAX,
	mHu = false,
	pay = PaymentType.SHOOTER,
	sHs: ScoringHand[] = [],
	easyAI = false
): Promise<Game> {
	return new Promise(resolve => {
		try {
			const shuffledPlayers: User[] = random ? shuffle(ps) : ps;
			const es: string[] = [];
			let pS: string = '';
			shuffledPlayers.forEach(player => {
				es.push(player.email);
				pS = pS === '' ? player.uN : pS + `, ${player.uN}`;
				player.bal = 1000;
			});
			const cA = new Date();
			const game = new Game(
				LocalFlag as string,
				user.uN,
				pS,
				es,
				[cA, cA, null],
				[true, true, false, false, false, false, mHu, false, easyAI],
				[1, 0, 0, 0, 0, 0, 0, 0, gMinPx, gMaxPx, isDev() ? BotTimeout.FAST : BotTimeout.MEDIUM, 0, 0],
				shuffledPlayers,
				[],
				{},
				[],
				[],
				[],
				{},
				sHs,
				pay
			);
			resolve(game);
		} catch (err) {
			console.error(`Failed to create local game: 🥞`);
			isDev() && console.error(err);
			resolve(null);
		}
	});
}

function getMainTextColor(bgc: BackgroundColor) {
	return bgc
		? [BackgroundColor.BLUE, BackgroundColor.DARK, BackgroundColor.GREEN, BackgroundColor.RED].includes(bgc)
			? TextColor.LIGHT
			: TextColor.DARK
		: TextColor.DARK;
}

function getTableTextColor(tc: TableColor) {
	return tc
		? [TableColor.BLUE, TableColor.DARK, TableColor.GREEN, TableColor.RED].includes(tc)
			? TextColor.LIGHT
			: TextColor.DARK
		: TextColor.DARK;
}

export function getTheme(bgc: BackgroundColor, tc: TableColor, tbc: TileColor): ITheme {
	return {
		backgroundColor: bgc || BackgroundColor.BROWN,
		tableColor: tc || TableColor.GREEN,
		tileColor: tbc || TileColor.DARK,
		mainTextColor: getMainTextColor(bgc) || TextColor.DARK,
		tableTextColor: getTableTextColor(tc) || TextColor.DARK
	};
}

export function sortTiles<T extends IHiddenTile>(tiles: T[]): T[] {
	return tiles.sort((a, b) => (a.i > b.i ? 1 : b.i > a.i ? -1 : 0));
}

export function indexOfCard(tile: IShownTile, tiles: IShownTile[]) {
	for (var i = 0; i < tiles.length; i++) {
		if (tiles[i].c === tile.c) {
			return i;
		}
	}
	return -1;
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

export function sortShownTiles(tiles: IShownTile[]): ShownTiles {
	const flowers: IShownTile[] = tiles.filter(tile => tile.s === Suit.FLOWER || tile.s === Suit.ANIMAL) || [];
	const nonFlowers: IShownTile[] = tiles.filter(tile => tile.s !== Suit.FLOWER && tile.s !== Suit.ANIMAL) || [];
	const flowerRefs = flowers.map(tile => tile.i);
	const nonFlowerRefs = nonFlowers.map(tile => tile.i);
	return { fs: flowers, nFs: nonFlowers, fIds: flowerRefs, nFIds: nonFlowerRefs };
}

export function rotateShownTiles(tiles: IShownTile[], ms: string[]): IShownTile[] {
	let temp: IShownTile;
	let i = 0;
	let j = 0;
	while (i < tiles.length && j < ms.length) {
		if (ms[j][0] === MeldType.KANG) {
			i += 4;
		} else if (ms[j][0] === MeldType.CHI) {
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

export function countHashedCards(id: string, ids: string[]): number {
	if (!id || isEmpty(ids)) {
		return 0;
	} else {
		const arrToSearch = id.includes('|')
			? ids.map(h => h.split('|').slice(2, 4).join('|'))
			: ids.map(h => h.split('|')[2]);
		return arrToSearch.filter(i => i === id).length;
	}
}

export function addSecondsToDate(t: Date, s: number): Date {
	return t ? new Date(t?.getTime() + s * 1000) : null;
}

export function indexToWind(n: number): Wind {
	switch (n) {
		case 0:
			return Wind.E;
		case 1:
			return Wind.S;
		case 2:
			return Wind.W;
		case 3:
			return Wind.N;
		default:
			return null;
	}
}

export function stageToWindName(n: number): String {
	switch (Math.floor(n / 4)) {
		case 0:
			return CardName[Wind.E];
		case 1:
			return CardName[Wind.S];
		case 2:
			return CardName[Wind.W];
		case 3:
			return CardName[Wind.N];
		default:
			return null;
	}
}

export function randomNum(n: number) {
	return Math.round(Math.random() * n);
}

export function isHua(tile: IShownTile) {
	return tile.s === Suit.ANIMAL || tile.s === Suit.FLOWER;
}

export function getPlayerSeat(_p: number, _d: number) {
	switch (_p) {
		case _d:
			return 0;
		case findRight(_d):
			return 1;
		case findOpp(_d):
			return 2;
		case findLeft(_d):
			return 3;
		default:
			return -1;
	}
}

export function getTileHashKey(gameId: string, st: number) {
	if (gameId === (LocalFlag as string)) {
		return 111;
	} else {
		let i = Math.min(st, gameId.length - 1);
		return gameId.charCodeAt(i) + st || 1;
	}
}

export function getHashed(id: string, tHK: number): string {
	let hashId = '';
	if (id) {
		const ids = id.split('');
		ids.forEach((i, ix) => (hashId += `${i.charCodeAt(0) + tHK}${ix !== ids.length - 1 ? '|' : ''}`));
	}
	return hashId;
}

export function hashTile(tile: IShownTile, tHK: number): IHiddenTile {
	return { i: getHashed(tile.i, tHK), r: tile.r };
}

export function getCardFromUnhashedId(id: string): string {
	return id.slice(2, 4);
}

export function getSuitFromUnhashedId(id: string): Suit {
	switch (id[0]) {
		case CardCategory.REGULAR:
			return `${id[3]}` as Suit;
		case CardCategory.WINDS:
		case CardCategory.HBF:
			return Suit.DAPAI;
		case CardCategory.FLOWER:
			return Suit.FLOWER;
		case CardCategory.ANIMAL:
			return Suit.ANIMAL;
		default:
			return Suit._;
	}
}

export function getIxFromUnhashedId(id: string): number {
	return Number(id[4]) || 1;
}

export function revealTile(hashT: IHiddenTile, tHK: number): IShownTile {
	if (!Number(hashT.x)) {
		let nums = [];
		hashT.i.split('|').forEach(piece => {
			if (!!Number(piece)) {
				let num = Number(piece) - tHK;
				nums = [...nums, num];
			}
		});
		let i = String.fromCharCode(...nums);
		return {
			i,
			c: getCardFromUnhashedId(i),
			s: getSuitFromUnhashedId(i),
			n: i[0] === CardCategory.REGULAR ? Number(i[2]) : 1,
			x: getIxFromUnhashedId(i),
			r: hashT.r
		};
	} else {
		return hashT;
	}
}

export function getCardFromHashId(id: string, tHK: number): string {
	let nums = [];
	id.split('|').forEach(piece => {
		if (!!Number(piece)) {
			let num = Number(piece) - tHK;
			nums = [...nums, num];
		}
	});
	let _id = String.fromCharCode(...nums);
	return getCardFromUnhashedId(_id);
}

export function tilesCanBeChi(ts: IShownTile[]): boolean {
	if (
		ts.length === 3 &&
		ts[0].s === ts[1].s &&
		ts[1].s === ts[2].s &&
		ts[2].n - 1 === ts[1].n &&
		ts[1].n - 1 === ts[0].n
	) {
		return true;
	}
	return false;
}

export function tilesCanBePong(ts: IShownTile[]): boolean {
	return ts.length === 3 && ts.every(t => t.c === ts[0].c);
}

export function isMeld(ts: IShownTile[]) {
	return ts.length === 3 && (tilesCanBeChi(ts) || tilesCanBePong(ts));
}

export function isNewInSet<T>(e: T, set: Set<T>): boolean {
	if (set.has(e)) {
		return false;
	} else {
		set.add(e);
		return true;
	}
}

export function isSuitedTile(t: IShownTile): boolean {
	return t.s === Suit.WAN || t.s === Suit.TONG || t.s === Suit.SUO;
}

export function isBigThree(t: IShownTile | string): boolean {
	if (typeof t === 'string') {
		return t === DaPai.RED || t === DaPai.WHITE || t === DaPai.GREEN;
	} else {
		return t.c === DaPai.RED || t.c === DaPai.WHITE || t.c === DaPai.GREEN;
	}
}

export function containsX<T extends any>(ts: T[], t: T, field: string = 'c'): number {
	let n = 0;
	for (let i = 0; i < ts.length; i++) {
		if (t[field] ? ts[i][field] === t[field] : ts[i] === t) {
			n += 1;
		}
	}
	return n;
}

export function getSuitFromStr(m: string) {
	if (!m || m === '') {
		return null;
	}
	for (let i = 0; i < Suits.length; i++) {
		if (m[m.length - 1] === Suits[i]) {
			return Suits[i];
		}
	}
	return Suit.DAPAI;
}

export function getSuitsFromHand(h: IHand) {
	const { openMsStr = [], hideMsStr = [] } = h;
	const msStr = [...openMsStr, ...hideMsStr];
	let suits = new Set<string>();
	let allSuits: string[] = [];
	if (!isEmpty(msStr)) {
		allSuits = msStr.map(m => getSuitFromStr(m));
	}
	if (!isEmpty(h.pair)) {
		allSuits = [...allSuits, h.pair[0].s];
	}
	if (!isEmpty(h.tsL)) {
		allSuits = [...allSuits, ...h.tsL.map(t => t.s)];
	}
	allSuits.forEach(s => suits.add(s));
	return Array.from(suits);
}

export function getTilesBySuit(ts: IShownTile[], full = false): IObj<Suit, string | number | IShownTile> {
	let suits = {};
	if (full) {
		ts.forEach(t => {
			if (!suits[t.s]) {
				suits[t.s] = [t];
			} else {
				suits[t.s] = [...suits[t.s], t];
			}
		});
	} else {
		ts.forEach(t => {
			if (!suits[t.s]) {
				suits[t.s] = isSuitedTile(t) ? [t.n] : [t.c];
			} else {
				suits[t.s] = [...suits[t.s], isSuitedTile(t) ? t.n : t.c];
			}
		});
	}
	return suits;
}

export function countTilesBySuit(ts: IShownTile[]): IObj<Suit, number> {
	let suits = {};
	ts.forEach(t => {
		if (!suits[t.s]) {
			suits[t.s] = 1;
		} else {
			suits[t.s] = suits[t.s] + 1;
		}
	});
	return suits;
}

export function getCountPerSuit(ts: IShownTile[] | string[]): IObj<Suit, number> {
	let suits = {};
	ts.forEach(t => {
		if (typeof t === 'string') {
			if (!suits[getSuitFromStr(t)]) {
				suits[getSuitFromStr(t)] = 1;
			} else {
				suits[getSuitFromStr(t)] = suits[getSuitFromStr(t)] + 1;
			}
		} else {
			if (!suits[t.s]) {
				suits[t.s] = 1;
			} else {
				suits[t.s] = suits[t.s] + 1;
			}
		}
	});
	return suits;
}

export function getHandDesc(hD: string) {
	let arr = hD.split('-');
	switch (arr[0] as ScoringHand) {
		case ScoringHand.FS:
			return `${arr[1]} ${HandDescEng[arr[0]]}${Number(arr[1]) === 1 ? `` : `s`}`;
		case ScoringHand.MELDED:
			let cardName = '';
			const card = arr[1];
			if (card.length === 1) {
				cardName = CardName[card] || card;
			} else {
				cardName = `${card[0]}${SuitName[card[1]] || card[1]}`;
			}
			return `${HandDescEng[arr[0]]} ${cardName}`;
		default:
			return HandDescEng[arr[0]];
	}
}

export function getTileSN(c: string): IHasSuitNum {
	return c.length <= 1 ? {} : { n: Number(c[0]), s: c[1] as Suit };
}

export function firstNeighbors(t: IShownTile, ts: IShownTile[]): string[] {
	if (!t?.n || !isSuitedTile(t)) {
		return [];
	}
	const toSearch = ts.filter(s => s.s === t.s);
	let waiting: IShownTile[] = [];
	switch (t.n) {
		case 1:
			waiting = toSearch.filter(s => s.n === 2 && s.s === t.s);
			break;
		case 9:
			waiting = toSearch.filter(s => s.n === 8 && s.s === t.s);
			break;
		default:
			waiting = toSearch.filter(s => s.n === t.n - 1 || s.n === t.n + 1);
			break;
	}
	return waiting.length === 0 ? [] : waiting.map(t => t.c);
}

export function secondNeighbors(t: IShownTile, ts: IShownTile[]): string[] {
	if (!t?.n || !isSuitedTile(t)) {
		return [];
	}
	const toSearch = ts.filter(s => s.s === t.s);
	let waiting: IShownTile[] = [];
	switch (t.n) {
		case 1:
			waiting = toSearch.filter(s => s.n === 3 && s.s === t.s);
			break;
		case 2:
			waiting = toSearch.filter(s => s.n === 4 && s.s === t.s);
			break;
		case 8:
			waiting = toSearch.filter(s => s.n === 6 && s.s === t.s);
			break;
		case 9:
			waiting = toSearch.filter(s => s.n === 7 && s.s === t.s);
			break;
		default:
			waiting = toSearch.filter(s => s.n === t.n - 2 || s.n === t.n + 2);
			break;
	}
	return waiting.length === 0 ? [] : waiting.map(t => t.c);
}

export function getChiWaitingTs(c1: string, c2?: string): string[] {
	if (!c2) {
		return [];
	}
	const t1 = getTileSN(c1);
	const t2 = getTileSN(c2);
	if (t1.s !== t2.s || Math.abs(t1.n - t2.n) > 2) {
		return [];
	}
	const ns = [t1.n, t2.n].sort();
	if (ns[1] - ns[0] === 2) {
		return [`${ns[0] + 1}${t1.s}`];
	}
	if (ns[1] === 2) {
		return [`3${t1.s}`];
	}
	if (ns[0] === 8) {
		return [`7${t1.s}`];
	} else {
		return [`${ns[0] - 1}${t1.s}`, `${ns[1] + 1}${t1.s}`];
	}
}

export function terminalSortTs<T extends IShownTile>(ts: T[]): T[] {
	if (ts.length <= 1) {
		return ts;
	}
	const key = `tsTs-${JSON.stringify(ts.map(t => t.r))}`;
	const cached = mainLRUCache.read(key);
	if (cached) {
		return cached;
	}
	ts.sort((a, b) => (Math.abs(5 - a.n) > Math.abs(5 - b.n) ? -1 : 1));
	mainLRUCache.write(key, ts);
	return ts;
}

export function terminalSortCs(cs: string[]): string[] {
	if (cs.length <= 1) {
		return cs;
	}
	cs.sort((a, b) => {
		return a[0] === b[0] ? 0 : Math.abs(5 - (Number(a[0]) || 5)) > Math.abs(5 - (Number(b[0]) || 5)) ? -1 : 1;
	});
	return cs;
}

export function isBefore(playerSeat: number, currentHu: number, thB: number): boolean {
	const first = findRight(thB);
	const second = findRight(first);
	const third = findRight(second);
	const order = [thB, first, second, third];

	return order.indexOf(playerSeat) < order.indexOf(currentHu);
}

export function getAttr<T>(field: string, arr: T[]): string[] {
	return arr.map(e => e[field]);
}

export function cardsWithoutNeighbors(cs: string[]): string[] {
	return cs.filter(c => {
		const cN = Number(c[0]);
		return !cs.find(t => t[1] === c[1] && (cN === Number(t[0]) - 1 || cN === Number(t[0]) + 1));
	});
}

export function processChiArr(arr1: string[], arr2: string[], multis: string[]): string[] {
	return multis.length > 1
		? [
				...terminalSortCs(arr1.length > 0 ? arr1 : arr2).filter(c => !multis.includes(c)),
				...terminalSortCs(arr1.length > 0 ? arr1 : arr2).filter(c => multis.includes(c))
		  ]
		: terminalSortCs(arr1.length > 0 ? arr1 : arr2);
}

export function trimCs(arr1: string[], excl: string[], c1 = true, hard = false): string[] {
	if (c1) {
		const _arr1 = arr1.filter(c => !excl.includes(getSuitFromStr(c)));
		return hard ? _arr1 : _arr1.length > 0 ? _arr1 : arr1;
	} else {
		return arr1;
	}
}

/**
 * @return MeldType
 * @param ts: completed meld
 * @description This fn takes a completed meld as its argument
 */
export function getTypeOfMeld(ts: IShownTile[]): MeldType {
	if (ts.length === 4) {
		return MeldType.KANG;
	}
	if (ts.every(t => t.c === ts[0].c)) {
		return MeldType.PONG;
	}
	return MeldType.CHI;
}

export function getDefaultAmt(hu: (string | number)[], pay: PaymentType, _p: number, thB: number) {
	if (isEmpty(hu) || pay === PaymentType.NONE) {
		return 0;
	} else {
		const didShoot = _p === thB;
		const zimo = Number(hu[2]) === 1;
		const defaultAmt = 2 ** Number(hu[1]) || 0;
		if (pay === PaymentType.HALF_SHOOTER) {
			if (zimo || didShoot) {
				return defaultAmt;
			} else {
				return defaultAmt / 2;
			}
		} else {
			return defaultAmt * (zimo ? 1 : didShoot ? 2 : 0);
		}
	}
}

export function getCardName(c: string) {
	return Number(c[0]) ? `${c[0]}${SuitName[c[1]] || c[1]}` : CardName[c] || c;
}

export function isEmptyTile(tile: IShownTile) {
	return isEmpty(tile) || (Number(tile.r) && !Number(tile.x));
}

export function isTakenTile(tile: IShownTile) {
	return Number(tile.r) && !Number(tile.x);
}

/**
 * Tbvvh I think this is shit but I'm just trying to make the bot chi more...
 */
export function shouldChi(tile: IShownTile, shown_hTs: IShownTile[]) {
	const sameSuitNs = shown_hTs.filter(t => t.s === tile.s).map(t => t.n);
	if (sameSuitNs.length < 2) {
		return [];
	}
	let inHand = 0;
	let has1Less = 0;
	let has2Less = 0;
	let has3Less = 0;
	// let has4Less = 0;
	let has1More = 0;
	let has2More = 0;
	let has3More = 0;
	// let has4More = 0;
	const countMore = sameSuitNs.filter(n => n > tile.n);
	const countLess = sameSuitNs.filter(n => n < tile.n);
	sameSuitNs.forEach(n => {
		switch (n) {
			// case tile.n - 4:
			// 	has4Less += 1;
			// 	break;
			case tile.n - 3:
				has3Less += 1;
				break;
			case tile.n - 2:
				has2Less += 1;
				break;
			case tile.n - 1:
				has1Less += 1;
				break;
			case tile.n:
				inHand += 1;
				break;
			// case tile.n + 4:
			// 	has4More += 1;
			// 	break;
			case tile.n + 3:
				has3More += 1;
				break;
			case tile.n + 2:
				has2More += 1;
				break;
			case tile.n + 1:
				has1More += 1;
				break;
			default:
				break;
		}
	});
	// chi up
	if (
		shown_hTs.length !== 4 &&
		((!inHand && has1More > 0 && has2More > 0) || (has1More > inHand && has2More > inHand)) && // 0 1 1 || 1 2 2
		(!has1Less ||
			(has1Less && countLess > countMore) ||
			!has3More ||
			(has3More > 0 && has3More < has2More && has3More < has1More))
	) {
		return [Exec.TAKE, tile.c, `${tile.n + 1}${tile.s}`, `${tile.n + 2}${tile.s}`];
	}
	// chi down
	if (
		shown_hTs.length !== 4 &&
		((!inHand && has1Less > 0 && has2Less > 0) || (has1Less > inHand && has2Less > inHand)) &&
		(!has1More ||
			(has1More && countMore > countLess) ||
			!has3Less ||
			(has3Less > 0 && has3Less < has2Less && has3Less < has1Less))
	) {
		return [Exec.TAKE, `${tile.n - 2}${tile.s}`, `${tile.n - 1}${tile.s}`, tile.c];
	}
	// chi middle
	if ((!inHand && has1Less > 0 && has1More > 0) || (has1Less > inHand && has1More > inHand)) {
		if (!has2Less || !has2More) {
			return [Exec.TAKE, `${tile.n - 1}${tile.s}`, tile.c, `${tile.n + 1}${tile.s}`];
		}
	}
	return [];
}

export function sortDaPaiDiscards(
	cs: string[],
	scoringPongs: string[],
	ownSingles: string[],
	countAllKnownCs: IObj<string, number>
): string[] {
	const cs1: string[] = [];
	const cs2: string[] = [];
	cs.sort((a, b) => {
		const ca = countAllKnownCs[a];
		const cb = countAllKnownCs[b];
		return ca === cb
			? (scoringPongs.includes(a) ? 1 : 0) >= (scoringPongs.includes(b) ? 1 : 0)
				? 1
				: -1
			: ca > cb
			? -1
			: 1;
	}).forEach(c => {
		if (ownSingles.includes(c)) {
			cs1.push(c);
		} else {
			cs2.push(c);
		}
	});
	return [...cs1, ...cs2];
}

export function isBot(id: string) {
	return BotIds.includes(id);
}

/* ----------------------------------- Mocks ----------------------------------- */

export function getSuitedTileMock(s: Suit | string, n: number, ix: number = 1): IShownTile {
	return { c: `${n}${s}`, n, s, i: `a${SuitsIndex[s as string]}${n}${s}${ix}`, r: Math.random(), x: ix };
}

export function getWindTileMock(w: Wind | string, ix: number = 1): IShownTile {
	return { c: w, s: Suit.DAPAI, i: `b${WindIndex[w as string]}${w}${ix}9`, r: Math.random(), x: ix };
}

export function getHBFMock(p: DaPai | string, ix: number = 1): IShownTile {
	return { c: p, s: Suit.DAPAI, i: `c${DaPaiIndex[p as string]}${p}${ix}9`, r: Math.random(), x: ix };
}

export function getAnimalMock(a: Animal | string): IShownTile {
	return { c: a, s: Suit.ANIMAL, i: `c${AnimalIndex[a]}${a}19`, r: Math.random() };
}

export function getFlowerMock(f: Flower | string, isValid = false): IShownTile {
	return { c: f, s: Suit.FLOWER, i: `c${FlowerIndex[f]}${f}19`, r: Math.random(), v: isValid };
}

// Hash mocks
export function getSuitedHashTileMock(tHK: number, s: Suit | string, n: number, ix: number = 1): IHiddenTile {
	return { i: getHashed(`${CardCategory.REGULAR}${SuitsIndex[s]}${n}${s}${ix}`, tHK), x: 0, r: Math.random() };
}

export function getHBFHashTileMock(tHK: number, d: DaPai | string, ix: number = 1): IHiddenTile {
	return { i: getHashed(`${CardCategory.HBF}${DaPaiIndex[d]}${d}${ix}${randomNum(9)}`, tHK), x: 0, r: Math.random() };
}

export function getWindHashTileMock(tHK: number, w: Wind | string, ix: number = 1): IHiddenTile {
	return {
		i: getHashed(`${CardCategory.WINDS}${WindIndex[w]}${w}${ix}${randomNum(9)}`, tHK),
		x: 0,
		r: Math.random()
	};
}

export function getAnimalHashTileMock(tHK: number, a: Animal, ix: number = 1): IHiddenTile {
	return {
		i: getHashed(`${CardCategory.ANIMAL}${AnimalIndex[a]}${a}${ix}${randomNum(9)}`, tHK),
		x: 0,
		r: Math.random()
	};
}

export function containsPongOrKang(h: IHand, card: string): boolean {
	const { openMsStr = [], hideMsStr = [] } = h;
	return !![...openMsStr, ...hideMsStr].find(
		m => m === `${MeldType.PONG}-${card}` || m === `${MeldType.KANG}-${card}`
	);
}
