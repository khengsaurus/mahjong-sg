import isEmpty from 'lodash.isempty';
import { BackgroundColors, Sizes, TableColors, TileColors } from '../global/enums';
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
	shownTiles?: TileI[];
	hiddenTiles?: TileI[];
	discardedTiles?: TileI[];
	lastTakenTile?: TileI;
	unusedTiles?: number;
	pongs?: string[];
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
		shownTiles?: TileI[],
		hiddenTiles?: TileI[],
		discardedTiles?: TileI[],
		lastTakenTile?: TileI,
		unusedTiles?: number,
		pongs?: string[],
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
		this.hiddenTiles = hiddenTiles || [];
		this.discardedTiles = discardedTiles || [];
		this.lastTakenTile = lastTakenTile || {};
		this.unusedTiles = unusedTiles || 0;
		this.pongs = pongs || [];
		this.balance = balance || 0;
		this.showTiles = showTiles || false;
	}

	rollDice(): number {
		const randInt1 = Math.floor(Math.random() * 6) + 1;
		const randInt2 = Math.floor(Math.random() * 6) + 1;
		const randInt3 = Math.floor(Math.random() * 6) + 1;
		return randInt1 + randInt2 + randInt3;
	}

	draw(tiles: TileI[]): TileI[] {
		this.hiddenTiles.push(tiles.pop());
		return tiles;
	}

	buHua(tiles: TileI[]): TileI[] {
		this.hiddenTiles.push(tiles.shift());
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
		this.pongs = [];
		this.showTiles = false;
	}

	countAllHiddenTiles(): number {
		return this.hiddenTiles.length + (isEmpty(this.lastTakenTile) ? 0 : 1);
	}

	allHiddenTiles(): TileI[] {
		return isEmpty(this.lastTakenTile) ? this.hiddenTiles : [...this.hiddenTiles, this.lastTakenTile];
	}

	/* ----------------------------------- Take options ----------------------------------- */
	canChi(tiles: TileI[]): boolean {
		if (
			tiles.length === 3 &&
			tiles[0].suit === tiles[1].suit &&
			tiles[1].suit === tiles[2].suit &&
			tiles[2].number - 1 === tiles[1].number &&
			tiles[1].number - 1 === tiles[0].number
		) {
			return true;
		}
		return false;
	}
	canPong(tiles: TileI[]): boolean {
		return tiles.length === 3 && tiles.every(tile => tile.card === tiles[0].card) ? true : false;
	}
	canKang(tiles: TileI[]): boolean {
		if (tiles.length === 1 && this.pongs.includes(tiles[0].card)) {
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

	getNewTile(t: TileI) {
		this.putNewTileIntoHidden();
		this.lastTakenTile = t;
	}

	returnNewTile(): TileI {
		let t = !isEmpty(this.lastTakenTile) ? null : this.lastTakenTile;
		this.lastTakenTile = {};
		return t;
	}

	/* ----------------------------------- Contains ----------------------------------- */
	allHiddenTilesContain(t: TileI): boolean {
		return (!isEmpty(this.lastTakenTile) ? [...this.hiddenTiles, this.lastTakenTile] : this.hiddenTiles)
			.map(tile => tile.id)
			.includes(t.id);
	}
	hiddenTilesContain(t: TileI): boolean {
		return this.hiddenTiles?.map(tile => tile.id).includes(t.id);
	}
	shownTilesContain(t: TileI): boolean {
		return this.shownTiles?.map(tile => tile.id).includes(t.id);
	}
	shownTilesContainCard(card: string): boolean {
		return this.shownTiles?.map(tile => tile.card).includes(card);
	}
	discardedTilesContain(t: TileI): boolean {
		return this.discardedTiles?.map(tile => tile.id).includes(t.id);
	}
	lastTakenTileUUID(): string {
		let all = this.allHiddenTiles();
		return all.length > 0 ? all[all.length - 1].uuid : '';
	}
	lastDiscardedTileUUID(): string {
		let all = this.discardedTiles;
		return all.length > 0 ? all[all.length - 1].uuid : '';
	}
	lastDiscardedTileIs(t: TileI): boolean {
		let all = this.discardedTiles;
		return all.length > 0 ? all[all.length - 1].id === t.id : false;
	}

	/* ----------------------------------- Add ----------------------------------- */
	addToHidden(t: TileI): void;
	addToHidden(t: TileI[]): void;
	addToHidden(t: any) {
		if (!t.length) {
			this.hiddenTiles = [...this.hiddenTiles, t];
		} else {
			this.hiddenTiles = [...this.hiddenTiles, ...t];
		}
	}

	addToShown(t: TileI, index?: number): void;
	addToShown(t: TileI[]): void;
	addToShown(t: any, index?: number) {
		if (!t.length) {
			if (index) {
				let initLength = this.shownTiles.length;
				this.shownTiles = [...this.shownTiles.slice(0, index), t, ...this.shownTiles.slice(index, initLength)];
			} else {
				this.shownTiles = [t, ...this.shownTiles];
			}
		} else {
			this.shownTiles = [...t, ...this.shownTiles];
		}
	}

	addToDiscarded(t: TileI): void;
	addToDiscarded(t: TileI[]): void;
	addToDiscarded(t: any) {
		if (!t.length) {
			this.discardedTiles = [...this.discardedTiles, t];
		} else {
			this.discardedTiles = [...this.discardedTiles, ...t];
		}
	}

	// /* ----------------------------------- Remove ----------------------------------- */
	removeFromHidden(t: TileI): void;
	removeFromHidden(t: TileI[]): void;
	removeFromHidden(t: any) {
		let toRemove: string[] = t.length
			? t.map((tile: TileI) => {
					return tile.id;
			  })
			: [t.id];
		this.hiddenTiles = this.hiddenTiles.filter(tile => !toRemove.includes(tile.id));
	}

	removeFromShown(t: TileI): void;
	removeFromShown(t: TileI[]): void;
	removeFromShown(t: any) {
		let toRemove: string[] = t.length
			? t.map((tile: TileI) => {
					return tile.id;
			  })
			: [t.id];
		this.shownTiles = this.shownTiles.filter(tile => !toRemove.includes(tile.id));
	}

	removeFromDiscarded(t: TileI): void;
	removeFromDiscarded(t: TileI[]): void;
	removeFromDiscarded(t: any) {
		let toRemove: string[] = t.length
			? t.map((tile: TileI) => {
					return tile.id;
			  })
			: [t.id];
		this.discardedTiles = this.discardedTiles.filter(tile => !toRemove.includes(tile.id));
	}

	/* ----------------------------------- Take ----------------------------------- */
	discard(tileToThrow: TileI): TileI {
		this.putNewTileIntoHidden();
		this.removeFromHidden(tileToThrow);
		this.addToDiscarded(tileToThrow);
		return tileToThrow;
	}
	moveMeldFromHiddenIntoShown(tiles: TileI[]) {
		this.removeFromHidden(tiles);
		this.addToShown(tiles);
	}
	pongOrKang(tiles: TileI[]) {
		this.moveMeldFromHiddenIntoShown(tiles);
		this.pongs = [...this.pongs, tiles[0].card];
	}
	selfKang(toKang: TileI) {
		this.removeFromHidden(toKang);
		this.addToShown(toKang, indexOfCard(toKang, this.shownTiles));
	}

	/* ----------------------------------- Hu: show/hide tiles ----------------------------------- */

	showTilesHu(lastThrown?: TileI) {
		this.shownTiles = lastThrown
			? [...this.shownTiles, ...this.hiddenTiles, lastThrown]
			: [...this.shownTiles, ...this.hiddenTiles];
		this.hiddenTiles = [];
	}

	hideTilesHu(lastThrown?: TileI) {
		this.hiddenTiles = this.shownTiles.filter((tile: TileI) => {
			return tile.show === false && lastThrown?.id !== tile.id;
		});
		this.shownTiles = this.shownTiles.filter((tile: TileI) => {
			return tile.show === true && lastThrown?.id !== tile.id;
		});
		if (!lastThrown) {
			// TODO:
			console.log('Zimo ??');
		}
	}
}
