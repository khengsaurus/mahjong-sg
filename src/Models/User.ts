import isEmpty from 'lodash.isempty';
import { BackgroundColors, MeldTypes, Sizes, TableColors, TileColors } from '../global/enums';
import { indexOfCard, sortTiles } from '../util/utilFns';

export class User {
	id: string;
	username: string;
	photoUrl: string;
	email: string;
	handSize: Sizes;
	tilesSize: Sizes;
	controlsSize: Sizes;
	backgroundColor: BackgroundColors;
	tableColor: TableColors;
	tileBackColor: TileColors;
	shownTiles?: IShownTile[];
	melds?: string[];
	hiddenTiles?: IHiddenTile[];
	discardedTiles?: IShownTile[];
	lastTakenTile?: IHiddenTile;
	unusedTiles?: number;
	// pongs?: string[];
	balance?: number;
	showTiles?: boolean;

	constructor(
		id: string,
		username: string,
		photoUrl: string,
		email: string,
		handSize?: Sizes,
		tilesSize?: Sizes,
		controlsSize?: Sizes,
		backgroundColor?: BackgroundColors,
		tableColor?: TableColors,
		tileBackColor?: TileColors,
		shownTiles?: IShownTile[],
		melds?: string[],
		hiddenTiles?: IHiddenTile[],
		discardedTiles?: IShownTile[],
		lastTakenTile?: IShownTile,
		unusedTiles?: number,
		balance?: number,
		showTiles?: boolean
	) {
		this.id = id;
		this.username = username;
		this.photoUrl = photoUrl;
		this.email = email;
		this.handSize = handSize;
		this.tilesSize = tilesSize;
		this.controlsSize = controlsSize;
		this.backgroundColor = backgroundColor;
		this.tableColor = tableColor;
		this.tileBackColor = tileBackColor;
		this.shownTiles = shownTiles || [];
		this.melds = melds || [];
		this.hiddenTiles = hiddenTiles || [];
		this.discardedTiles = discardedTiles || [];
		this.lastTakenTile = lastTakenTile || {};
		this.unusedTiles = unusedTiles || 0;
		this.balance = balance || 0;
		this.showTiles = showTiles || false;
	}

	rollDice(): number {
		const randInt1 = Math.floor(Math.random() * 6) + 1;
		const randInt2 = Math.floor(Math.random() * 6) + 1;
		const randInt3 = Math.floor(Math.random() * 6) + 1;
		return randInt1 + randInt2 + randInt3;
	}

	draw(tiles: IHiddenTile[]): IHiddenTile[] {
		this.hiddenTiles.push(tiles.pop());
		return tiles;
	}

	sortHiddenTiles(): void {
		this.hiddenTiles = sortTiles(this.hiddenTiles);
	}

	sortShownTiles(): void {
		this.shownTiles = sortTiles(this.shownTiles);
	}

	prepareForNewRound(): void {
		this.shownTiles = [];
		this.hiddenTiles = [];
		this.discardedTiles = [];
		this.lastTakenTile = {};
		this.unusedTiles = 0;
		this.melds = [];
		this.showTiles = false;
	}

	countAllHiddenTiles(): number {
		return this.hiddenTiles.length + (isEmpty(this.lastTakenTile) ? 0 : 1);
	}

	allHiddenTiles(): IHiddenTile[] {
		return isEmpty(this.lastTakenTile) ? this.hiddenTiles : [...this.hiddenTiles, this.lastTakenTile];
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
	putNewTileIntoHidden() {
		if (!isEmpty(this.lastTakenTile) && !this.hiddenTilesContain(this.lastTakenTile)) {
			this.addToHidden(this.lastTakenTile);
		}
		this.lastTakenTile = {};
	}

	setHiddenTiles() {
		this.putNewTileIntoHidden();
		this.sortHiddenTiles();
	}

	getNewTile(t: IHiddenTile) {
		this.putNewTileIntoHidden();
		this.lastTakenTile = t;
	}

	returnNewTile(): IShownTile {
		let t = !isEmpty(this.lastTakenTile) ? null : this.lastTakenTile;
		this.lastTakenTile = {};
		return t;
	}

	/* ----------------------------------- Contains ----------------------------------- */
	allHiddenTilesContain(t: IShownTile | IHiddenTile): boolean {
		return (!isEmpty(this.lastTakenTile) ? [...this.hiddenTiles, this.lastTakenTile] : this.hiddenTiles)
			.map(tile => tile.ref)
			.includes(t.ref);
	}
	hiddenTilesContain(t: IShownTile | IHiddenTile): boolean {
		return this.hiddenTiles?.map(tile => tile.ref).includes(t.ref);
	}
	shownTilesContain(t: IShownTile | IHiddenTile): boolean {
		return this.shownTiles?.map(tile => tile.ref).includes(t.ref);
	}
	discardedTilesContain(t: IShownTile | IHiddenTile): boolean {
		return this.discardedTiles?.map(tile => tile.ref).includes(t.ref);
	}
	lastDiscardedTileIs(t: IShownTile | IHiddenTile): boolean {
		if (isEmpty(t) || this.discardedTiles.length === 0) {
			return false;
		} else {
			return this.discardedTiles.slice(-1)[0].ref === t.ref;
		}
	}
	shownTilesContainCard(card: string): boolean {
		return this.shownTiles?.map(tile => tile.card).includes(card);
	}

	/* ----------------------------------- Add meld ----------------------------------- */

	addMeld(card: string, type: string) {
		this.melds = [`${type}-${card}`, ...this.melds];
	}
	containsMeld(card: string, type: string) {
		let repr = `${type}-${card}`;
		return this.melds.find(meld => {
			return meld === repr;
		});
	}
	hasPong(card: string) {
		return this.containsMeld(card, MeldTypes.PONG);
	}
	updatePongToKang(card: string) {
		let repr = `${MeldTypes.PONG}-${card}`;
		let i = this.melds.indexOf(repr);
		if (i !== -1) {
			this.melds[i] = `${MeldTypes.KANG}-${card}`;
		}
	}

	/* ----------------------------------- Add ----------------------------------- */
	addToHidden(t: IHiddenTile): void;
	addToHidden(t: IHiddenTile[]): void;
	addToHidden(t: any) {
		if (!t.length) {
			this.hiddenTiles = [...this.hiddenTiles, t];
		} else {
			this.hiddenTiles = [...this.hiddenTiles, ...t];
		}
	}

	addToShown(t: IShownTile, index?: number): void;
	addToShown(t: IShownTile[]): void;
	addToShown(t: any, index?: number) {
		if (!t.length) {
			if (index) {
				let initLength = this.shownTiles.length;
				this.shownTiles = [...this.shownTiles.slice(0, index), t, ...this.shownTiles.slice(index, initLength)];
				t.card && this.updatePongToKang(t.card);
			} else {
				this.shownTiles = [t, ...this.shownTiles];
			}
		} else {
			this.shownTiles = [...t, ...this.shownTiles];
			let type = this.canKang(t) ? MeldTypes.KANG : this.canPong(t) ? MeldTypes.PONG : MeldTypes.CHI;
			this.addMeld(t[1].card, type);
		}
	}

	addToDiscarded(t: IShownTile): void;
	addToDiscarded(t: IShownTile[]): void;
	addToDiscarded(t: any) {
		if (!t.length) {
			this.discardedTiles = [...this.discardedTiles, t];
		} else {
			this.discardedTiles = [...this.discardedTiles, ...t];
		}
	}

	/* ----------------------------------- Remove ----------------------------------- */
	removeFromHidden(t: IHiddenTile | IShownTile): void;
	removeFromHidden(t: IHiddenTile[] | IShownTile[]): void;
	removeFromHidden(t: any) {
		let toRemove: string[] = t.length
			? t.map((tile: IHiddenTile) => {
					return tile.id;
			  })
			: [t.id];
		if (!isEmpty(this.lastTakenTile) && toRemove.includes(this.lastTakenTile.id)) {
			this.lastTakenTile = {};
		}
		this.hiddenTiles = this.hiddenTiles.filter(tile => !toRemove.includes(tile.id));
	}

	removeFromShown(t: IShownTile): void;
	removeFromShown(t: IShownTile[]): void;
	removeFromShown(t: any) {
		let toRemove: string[] = t.length
			? t.map((tile: IShownTile) => {
					return tile.ref;
			  })
			: [t.ref];
		this.shownTiles = this.shownTiles.filter(tile => !toRemove.includes(tile.id));
	}

	removeFromDiscarded(t: IShownTile): void;
	removeFromDiscarded(t: IShownTile[]): void;
	removeFromDiscarded(t: any) {
		let toRemove: string[] = t.length
			? t.map((tile: IShownTile) => {
					return tile.ref;
			  })
			: [t.ref];
		this.discardedTiles = this.discardedTiles.filter(tile => !toRemove.includes(tile.id));
	}

	/* ----------------------------------- Take ----------------------------------- */
	discard(tile: IShownTile): IShownTile {
		this.putNewTileIntoHidden();
		this.removeFromHidden(tile);
		this.addToDiscarded(tile);
		return tile;
	}
	moveIntoShown(tiles: IShownTile[]) {
		this.removeFromHidden(tiles);
		this.addToShown(tiles);
	}
	selfKang(tile: IShownTile) {
		this.removeFromHidden(tile);
		this.addToShown(tile, indexOfCard(tile, this.shownTiles));
	}
}
