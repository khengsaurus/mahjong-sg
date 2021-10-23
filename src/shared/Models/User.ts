import isEmpty from 'lodash.isempty';
import { BackgroundColors, MeldTypes, Sizes, TableColors, TileColors } from 'shared/enums';
import { indexOfCard, sortTiles } from 'shared/util/utilFns';
export class User {
	id: string;
	uN: string;
	pUrl: string;
	email: string;
	hSz: Sizes;
	tSz: Sizes;
	cSz: Sizes;
	bgC: BackgroundColors;
	tC: TableColors;
	tBC: TileColors;
	sTs?: IShownTile[];
	melds?: string[];
	hTs?: IHiddenTile[];
	dTs?: IShownTile[];
	lTaken?: IShownTile | IHiddenTile;
	uTs?: number;
	bal?: number;
	sT?: boolean;

	constructor(
		id: string,
		uN: string,
		pUrl: string,
		email: string,
		hSz?: Sizes,
		tSz?: Sizes,
		cSz?: Sizes,
		bgC?: BackgroundColors,
		tC?: TableColors,
		tBC?: TileColors,
		sTs?: IShownTile[],
		melds?: string[],
		hTs?: IHiddenTile[],
		dTs?: IShownTile[],
		lTaken?: IShownTile | IHiddenTile,
		uTs?: number,
		bal?: number,
		sT?: boolean
	) {
		this.id = id;
		this.uN = uN;
		this.pUrl = pUrl;
		this.email = email;
		this.hSz = hSz;
		this.tSz = tSz;
		this.cSz = cSz;
		this.bgC = bgC;
		this.tC = tC;
		this.tBC = tBC;
		this.sTs = sTs || [];
		this.melds = melds || [];
		this.hTs = hTs || [];
		this.dTs = dTs || [];
		this.lTaken = lTaken || {};
		this.uTs = uTs || 0;
		this.bal = bal || 0;
		this.sT = sT || false;
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

	prepareForNewRound(): void {
		this.sTs = [];
		this.melds = [];
		this.hTs = [];
		this.dTs = [];
		this.lTaken = {};
		this.uTs = 0;
		this.sT = false;
	}

	countAllHiddenTiles(): number {
		return this.hTs.length + (isEmpty(this.lTaken) ? 0 : 1);
	}

	allHiddenTiles(): IHiddenTile[] {
		return isEmpty(this.lTaken) ? this.hTs : [...this.hTs, this.lTaken];
	}

	/* ----------------------------------- Take options ----------------------------------- */
	canChi(tiles: IShownTile[]): boolean {
		if (
			tiles.length === 3 &&
			tiles[0].suit === tiles[1].suit &&
			tiles[1].suit === tiles[2].suit &&
			tiles[2].num - 1 === tiles[1].num &&
			tiles[1].num - 1 === tiles[0].num
		) {
			return true;
		}
		return false;
	}
	canPong(tiles: IShownTile[]): boolean {
		return tiles.length === 3 && tiles.every(tile => tile.card === tiles[0].card) ? true : false;
	}
	canKang(tiles: IShownTile[]): boolean {
		if (tiles.length === 1 && this.hasPong(tiles[0].card)) {
			return true;
		} else if (tiles.length === 4) {
			return tiles.every(tile => tile.card === tiles[0].card) ? true : false;
		} else {
			return false;
		}
	}

	/* ----------------------------------- Handle last taken tile ----------------------------------- */
	moveLastTakenTileIntoHidden() {
		if (!isEmpty(this.lTaken) && !this.hiddenTilesContain(this.lTaken) && this.lTaken.ix === 0) {
			this.addToHidden(this.lTaken);
		}
		this.lTaken = {};
	}

	setHiddenTiles() {
		this.moveLastTakenTileIntoHidden();
		this.hTs = sortTiles(this.hTs);
	}

	getNewTile(t: IHiddenTile) {
		this.moveLastTakenTileIntoHidden();
		this.lTaken = t;
	}

	returnNewTile(): IShownTile | IHiddenTile {
		let t = isEmpty(this.lTaken) ? {} : this.lTaken;
		this.lTaken = {};
		return t;
	}

	/* ----------------------------------- Contains ----------------------------------- */
	allHiddenTilesContain(t: IShownTile | IHiddenTile): boolean {
		return (!isEmpty(this.lTaken) ? [...this.hTs, this.lTaken] : this.hTs).map(tile => tile.ref).includes(t.ref);
	}
	hiddenTilesContain(t: IShownTile | IHiddenTile): boolean {
		return this.hTs?.map(tile => tile.ref).includes(t.ref);
	}
	shownTilesContain(t: IShownTile | IHiddenTile): boolean {
		return this.sTs?.map(tile => tile.ref).includes(t.ref);
	}
	discardedTilesContain(t: IShownTile | IHiddenTile): boolean {
		return this.dTs?.map(tile => tile.ref).includes(t.ref);
	}
	lastDiscardedTileIs(t: IShownTile | IHiddenTile): boolean {
		if (isEmpty(t) || this.dTs.length === 0) {
			return false;
		} else {
			return this.dTs.slice(-1)[0].ref === t.ref;
		}
	}
	shownTilesContainCard(card: string): boolean {
		return this.sTs?.map(tile => tile.card).includes(card);
	}

	/* ----------------------------------- Add meld ----------------------------------- */

	addMeld(card: string, type: string) {
		this.melds = [`${type}${card}`, ...this.melds];
	}
	containsMeld(card: string, type: string) {
		let repr = `${type}${card}`;
		return this.melds.find(meld => {
			return meld === repr;
		});
	}
	hasPong(card: string) {
		return this.containsMeld(card, MeldTypes.PONG);
	}
	updatePongToKang(card: string) {
		let repr = `${MeldTypes.PONG}${card}`;
		let i = this.melds.indexOf(repr);
		if (i !== -1) {
			this.melds[i] = `${MeldTypes.KANG}${card}`;
		}
	}

	/* ----------------------------------- Add ----------------------------------- */
	addToHidden(t: IHiddenTile): void;
	addToHidden(t: IHiddenTile[]): void;
	addToHidden(t: any) {
		if (!t.length) {
			this.hTs = [...this.hTs, t];
		} else {
			this.hTs = [...this.hTs, ...t];
		}
	}

	addToShown(t: IShownTile, index?: number): void;
	addToShown(t: IShownTile[]): void;
	addToShown(t: any, index?: number) {
		if (!t.length) {
			if (index) {
				let initLength = this.sTs.length;
				this.sTs = [...this.sTs.slice(0, index), t, ...this.sTs.slice(index, initLength)];
				t.card && this.updatePongToKang(t.card);
			} else {
				this.sTs = [t, ...this.sTs];
			}
		} else {
			this.sTs = [...t, ...this.sTs];
			let type = this.canKang(t) ? MeldTypes.KANG : this.canPong(t) ? MeldTypes.PONG : MeldTypes.CHI;
			this.addMeld(t[1].card, type);
		}
	}

	addToDiscarded(t: IShownTile): void;
	addToDiscarded(t: IShownTile[]): void;
	addToDiscarded(t: any) {
		if (!t.length) {
			this.dTs = [...this.dTs, t];
		} else {
			this.dTs = [...this.dTs, ...t];
		}
	}

	/* ----------------------------------- Remove ----------------------------------- */
	removeFromHidden(t: IHiddenTile | IShownTile): void;
	removeFromHidden(t: IHiddenTile[] | IShownTile[]): void;
	removeFromHidden(t: any) {
		let toRemove: number[] = t.length
			? t.map((tile: IHiddenTile) => {
					return tile.ref;
			  })
			: [t.ref];
		if (!isEmpty(this.lTaken) && toRemove.includes(this.lTaken.ref)) {
			this.lTaken = {};
		}
		this.hTs = this.hTs.filter(tile => !toRemove.includes(tile.ref));
	}

	removeFromShown(t: IShownTile): void;
	removeFromShown(t: IShownTile[]): void;
	removeFromShown(t: any) {
		let toRemove: number[] = t.length
			? t.map((tile: IShownTile) => {
					return tile.ref;
			  })
			: [t.ref];
		this.sTs = this.sTs.filter(tile => !toRemove.includes(tile.ref));
	}

	removeFromDiscarded(t: IShownTile): void;
	removeFromDiscarded(t: IShownTile[]): void;
	removeFromDiscarded(t: any) {
		let toRemove: number[] = t.length
			? t.map((tile: IShownTile) => {
					return tile.ref;
			  })
			: [t.ref];
		this.dTs = this.dTs.filter(tile => !toRemove.includes(tile.ref));
	}

	/* ----------------------------------- Take ----------------------------------- */
	discard(tile: IShownTile): IShownTile {
		this.removeFromHidden(tile);
		this.addToDiscarded(tile);
		this.moveLastTakenTileIntoHidden();
		return tile;
	}
	moveIntoShown(tiles: IShownTile[]) {
		this.removeFromHidden(tiles);
		this.addToShown(tiles);
	}
	selfKang(tile: IShownTile) {
		this.removeFromHidden(tile);
		this.addToShown(tile, indexOfCard(tile, this.sTs));
	}
}
