import { BackgroundColor, MeldType, Size, Suit, TableColor, TileColor } from 'enums';
import isEmpty from 'lodash.isempty';
import { indexOfCard, revealTile, sortTiles, tilesCanBePong } from 'utility';

/**
 * @description The user object, with/without game-related fields depending on parser used
 * @important Attribute names are shortened for memory - refer to the declaration. Note that types of ms/hTs are DIFFERENT from IHand
 */
export class User {
	id: string;
	uN: string;
	email: string;
	/**
	 * 0: English text only
	 * 1: haptic feedback
	 */
	_b: boolean[];
	_s: string[];
	_n: number[];
	// Preferences
	hSz: Size;
	tSz: Size;
	cSz: Size;
	bgC: BackgroundColor;
	tC: TableColor;
	tBC: TileColor;
	// Game related
	ms?: string[];
	hTs?: IHiddenTile[];
	sTs?: IShownTile[];
	dTs?: IShownTile[];
	lTa?: IShownTile | IHiddenTile;
	uTs?: number;
	bal?: number;
	sT?: boolean;
	cfH?: boolean;
	hp?: boolean; // haptic

	constructor(
		id?: string,
		uN?: string,
		email?: string,
		_b?: boolean[],
		_s?: string[],
		_n?: number[],
		data?: IUser
	);
	constructor(
		id?: string,
		uN?: string,
		email?: string,
		_b?: boolean[],
		_s?: string[],
		_n?: number[],
		data?: IPlayer
	);
	constructor(
		id?: string,
		uN?: string,
		email?: string,
		_b?: boolean[],
		_s?: string[],
		_n?: number[],
		data?: any
	) {
		this.id = id;
		this.uN = uN;
		this.email = email;
		this._b = _b;
		this._s = _s;
		this._n = _n;
		if (data?.hSz) {
			this.hSz = data?.hSz;
			this.tSz = data?.tSz;
			this.cSz = data?.cSz;
			this.bgC = data?.bgC;
			this.tC = data?.tC;
			this.tBC = data?.tBC;
		}
		if (data?.ms) {
			this.ms = data?.ms || [];
			this.hTs = data?.hTs || [];
			this.sTs = data?.sTs || [];
			this.dTs = data?.dTs || [];
			this.lTa = data?.lTa || {};
			this.uTs = data?.uTs || 0;
			this.bal = data?.bal || 0;
			this.sT = data?.sT || false;
			this.cfH = data?.cfH || false;
		}
	}

	rollDice(): number {
		const randInt1 = Math.floor(Math.random() * 6) + 1;
		const randInt2 = Math.floor(Math.random() * 6) + 1;
		const randInt3 = Math.floor(Math.random() * 6) + 1;
		return randInt1 + randInt2 + randInt3;
	}

	draw(tiles: IHiddenTile[]): IHiddenTile[] {
		this.hTs.push(tiles.pop());
		return tiles;
	}

	sortShownTiles(): void {
		this.sTs = sortTiles(this.sTs);
	}

	prepForNewRound(): void {
		this.sTs = [];
		this.ms = [];
		this.hTs = [];
		this.dTs = [];
		this.lTa = {};
		this.uTs = 0;
		this.sT = false;
		this.cfH = false;
	}

	countAllHiddenTiles(): number {
		return this.hTs.length + (isEmpty(this.lTa) ? 0 : 1);
	}

	allHiddenTiles(): IHiddenTile[] {
		return Number(this.lTa.r) ? [...this.hTs, this.lTa] : this.hTs;
	}

	/* ----------------------------------- Take options ----------------------------------- */
	canKang(tiles: IShownTile[]): boolean {
		if (tiles.length === 1 && this.hasPong(tiles[0].c)) {
			return true;
		} else if (tiles.length === 4) {
			return tiles.every(tile => tile.c === tiles[0].c) ? true : false;
		} else {
			return false;
		}
	}

	/* ----------------------------------- Handle last taken tile ----------------------------------- */
	moveLastTakenTileIntoHidden() {
		if (!isEmpty(this.lTa) && !Number(this.lTa?.x)) {
			this.addToHidden(this.lTa);
		}
		this.lTa = {};
	}

	setHiddenTiles() {
		this.moveLastTakenTileIntoHidden();
		this.hTs = sortTiles(this.hTs);
	}

	getNewTile(t: IHiddenTile | IShownTile) {
		this.moveLastTakenTileIntoHidden();
		this.lTa = t;
	}

	returnLastThrown(): IShownTile {
		const t = isEmpty(this.lTa) ? {} : { ...this.lTa };
		this.lTa = {};
		return t;
	}

	/* ----------------------------------- Contains ----------------------------------- */
	allHiddenTilesContain(t: IShownTile | IHiddenTile): boolean {
		return (!isEmpty(this.lTa) ? [...this.hTs, this.lTa] : this.hTs)
			.map(tile => tile.r)
			.includes(t.r);
	}
	hiddenTilesContain(t: IShownTile | IHiddenTile): boolean {
		return this.hTs?.map(tile => tile.r).includes(t.r);
	}
	shownTilesContain(t: IShownTile | IHiddenTile): boolean {
		return this.sTs?.map(tile => tile.r).includes(t.r);
	}
	discardedTilesContain(t: IShownTile | IHiddenTile): boolean {
		return this.dTs?.map(tile => tile.r).includes(t.r);
	}
	lastDiscardedTileIs(t: IShownTile | IHiddenTile): boolean {
		if (isEmpty(t) || this.dTs.length === 0) {
			return false;
		} else {
			return this.dTs.slice(-1)[0].r === t.r;
		}
	}
	shownTilesContainCard(card: string): boolean {
		return this.sTs?.map(tile => tile.c).includes(card);
	}

	/* ----------------------------------- Add meld ----------------------------------- */

	addMeld(card: string, type: string) {
		this.ms = [`${type}-${card}`, ...this.ms];
	}
	containsMeld(card: string, type: string) {
		let repr = `${type}-${card}`;
		return this.ms.find(meld => {
			return meld === repr;
		});
	}
	hasPong(card: string) {
		return this.containsMeld(card, MeldType.PONG);
	}
	hasKang(card: string) {
		return this.containsMeld(card, MeldType.KANG);
	}
	updatePongToKang(card: string) {
		let repr = `${MeldType.PONG}-${card}`;
		let i = this.ms.indexOf(repr);
		if (i !== -1) {
			this.ms[i] = `${MeldType.KANG}-${card}`;
		}
	}
	updateKangToPong(card: string) {
		let repr = `${MeldType.KANG}-${card}`;
		let i = this.ms.indexOf(repr);
		if (i !== -1) {
			this.ms[i] = `${MeldType.PONG}-${card}`;
		}
	}

	/* ----------------------------------- Add ----------------------------------- */
	addToHidden(t: IHiddenTile): void;
	addToHidden(t: IHiddenTile[]): void;
	addToHidden(t: any) {
		if (!Number(t.length)) {
			this.hTs = [...this.hTs, t];
		} else {
			this.hTs = [...this.hTs, ...t];
		}
	}

	addToShown(t: IShownTile, index?: number): void;
	addToShown(t: IShownTile[]): void;
	addToShown(t: any, index?: number) {
		if (!Number(t.length)) {
			if (index) {
				let initLength = this.sTs.length;
				this.sTs = [
					...this.sTs.slice(0, index),
					t,
					...this.sTs.slice(index, initLength)
				];
			} else {
				this.sTs = [t, ...this.sTs];
			}
			t.c && this.updatePongToKang(t.c);
		} else if (t.length > 0) {
			this.sTs = [...t, ...this.sTs];
			let type = this.canKang(t)
				? MeldType.KANG
				: tilesCanBePong(t)
				? MeldType.PONG
				: MeldType.CHI;
			this.addMeld(t[1].c, type);
		}
	}

	addToDiscarded(t: IShownTile): void;
	addToDiscarded(t: IShownTile[]): void;
	addToDiscarded(t: any) {
		if (!Number(t.length)) {
			this.dTs = [...this.dTs, t];
		} else {
			this.dTs = [...this.dTs, ...t];
		}
	}

	/* ----------------------------------- Remove ----------------------------------- */
	removeFromHidden(t: IHiddenTile | IShownTile): void;
	removeFromHidden(t: IHiddenTile[] | IShownTile[]): void;
	removeFromHidden(t: any) {
		let toRemove: number[] = t.length ? t.map((tile: IHiddenTile) => tile.r) : [t.r];
		if (!isEmpty(this.lTa) && toRemove.includes(this.lTa.r)) {
			this.lTa = {};
		}
		this.hTs = this.hTs.filter(tile => !toRemove.includes(tile.r));
	}

	removeFromShown(t: IShownTile): void;
	removeFromShown(t: IShownTile[]): void;
	removeFromShown(t: any) {
		let toRemove: number[] = t.length ? t.map((tile: IShownTile) => tile.r) : [t.r];
		this.sTs = this.sTs.filter(tile => !toRemove.includes(tile.r));
	}

	removeFromDiscarded(t: IShownTile): void;
	removeFromDiscarded(t: IShownTile[]): void;
	removeFromDiscarded(t: any) {
		let toRemove: number[] = t.length ? t.map((tile: IShownTile) => tile.r) : [t.r];
		this.dTs = this.dTs.filter(tile => !toRemove.includes(tile.r));
	}

	/* ----------------------------------- Take ----------------------------------- */
	discard(tile: IShownTile): IShownTile {
		this.removeFromHidden(tile);
		this.addToDiscarded(tile);
		this.moveLastTakenTileIntoHidden();
		return tile;
	}

	createMeld(tiles: IShownTile[], pongToKang = false) {
		if (tiles.length > 1 && tiles.every(t => t.c === tiles[0].c)) {
			// To show last taken for pong/kang on player's left. @see useControls.handleTake
			tiles.reverse();
		}
		this.removeFromHidden(tiles);
		if (pongToKang && tiles.length === 1) {
			this.addToShown(tiles[0], indexOfCard(tiles[0], this.sTs));
		} else {
			this.addToShown(tiles);
		}
	}

	/* ----------------------------------- Util ----------------------------------- */
	/**
	 * @returns [animals, vFs, totalFs]
	 */
	flowersRepr(): number[] {
		let animals = this.sTs.filter(t => t.s === Suit.ANIMAL).length || 0;
		let vFs = this.sTs.filter(t => t.s === Suit.FLOWER && t.v).length || 0;
		let totalFs = this.sTs.filter(t => t.s === Suit.FLOWER).length || 0;
		return [animals, vFs, totalFs];
	}

	handRef(): number[] {
		return this.hTs.map(t => t.r);
	}

	handIds(): string[] {
		return this.hTs.map(t => t.i);
	}

	revealedHTs(tHK: number, includingLTa = false): IShownTile[] {
		return (
			(includingLTa ? this.allHiddenTiles() : this.hTs).map(t =>
				Number(t.x) ? t : revealTile(t, tHK)
			) || []
		);
	}

	revealedLTa(tHK: number): IShownTile {
		return isEmpty(this.lTa)
			? {}
			: Number(this.lTa.x)
			? this.lTa
			: revealTile(this.lTa, tHK);
	}
}
