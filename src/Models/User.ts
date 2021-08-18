import _ from 'lodash';
import { indexOfCard, sortTiles } from '../util/utilFns';

export class User {
	id: string;
	username: string;
	photoUrl: string;
	shownTiles?: Tile[];
	hiddenTiles?: Tile[];
	discardedTiles?: Tile[];
	lastTakenTile?: Tile;
	unusedTiles?: number;
	pongs?: string[];
	balance?: number;
	showTiles?: boolean;

	constructor(
		id: string,
		username: string,
		photoUrl: string,
		shownTiles?: Tile[],
		hiddenTiles?: Tile[],
		discardedTiles?: Tile[],
		lastTakenTile?: Tile,
		unusedTiles?: number,
		pongs?: string[],
		balance?: number,
		showTiles?: boolean
	) {
		this.id = id;
		this.username = username;
		this.photoUrl = photoUrl;
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

	draw(tiles: Tile[]): Tile[] {
		this.hiddenTiles.push(tiles.pop());
		return tiles;
	}

	buHua(tiles: Tile[]): Tile[] {
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
		return this.hiddenTiles.length + (_.isEmpty(this.lastTakenTile) ? 0 : 1);
	}

	allHiddenTiles(): Tile[] {
		return _.isEmpty(this.lastTakenTile) ? this.hiddenTiles : [...this.hiddenTiles, this.lastTakenTile];
	}

	/* ----------------------------------- Take options ----------------------------------- */
	canChi(tiles: Tile[]): boolean {
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
	canPong(tiles: Tile[]): boolean {
		return tiles.length === 3 && tiles.every(tile => tile.card === tiles[0].card) ? true : false;
	}
	canKang(tiles: Tile[]): boolean {
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
		if (!_.isEmpty(this.lastTakenTile) && !this.hiddenTilesContain(this.lastTakenTile)) {
			this.addToHidden(this.lastTakenTile);
		}
		this.lastTakenTile = {};
	}

	setHiddenTiles() {
		this.putNewTileIntoHidden();
		this.sortHiddenTiles();
	}

	getNewTile(t: Tile) {
		this.putNewTileIntoHidden();
		this.lastTakenTile = t;
	}

	returnNewTile(): Tile {
		let t = !_.isEmpty(this.lastTakenTile) ? null : this.lastTakenTile;
		this.lastTakenTile = {};
		return t;
	}

	/* ----------------------------------- Contains ----------------------------------- */
	allHiddenTilesContain(t: Tile): boolean {
		return (this.lastTakenTile ? [...this.hiddenTiles, this.lastTakenTile] : this.hiddenTiles)
			.map(tile => tile.id)
			.includes(t.id);
	}
	hiddenTilesContain(t: Tile): boolean {
		return this.hiddenTiles.map(tile => tile.id).includes(t.id);
	}
	shownTilesContain(t: Tile): boolean {
		return this.shownTiles.map(tile => tile.id).includes(t.id);
	}
	discardedTilesContain(t: Tile): boolean {
		return this.discardedTiles.map(tile => tile.id).includes(t.id);
	}

	/* ----------------------------------- Add ----------------------------------- */
	addToHidden(t: Tile): void;
	addToHidden(t: Tile[]): void;
	addToHidden(t: any) {
		if (!t.length) {
			this.hiddenTiles = [...this.hiddenTiles, t];
		} else {
			this.hiddenTiles = [...this.hiddenTiles, ...t];
		}
	}

	addToShown(t: Tile, index?: number): void;
	addToShown(t: Tile[]): void;
	addToShown(t: any, index?: number) {
		if (!t.length) {
			if (index) {
				let initLength = this.shownTiles.length;
				this.shownTiles = [...this.shownTiles.slice(0, index), t, ...this.shownTiles.slice(index, initLength)];
			} else {
				this.shownTiles = [...this.shownTiles, t];
			}
		} else {
			this.shownTiles = [...this.shownTiles, ...t];
		}
	}

	addToDiscarded(t: Tile): void;
	addToDiscarded(t: Tile[]): void;
	addToDiscarded(t: any) {
		if (!t.length) {
			this.discardedTiles = [...this.discardedTiles, t];
		} else {
			this.discardedTiles = [...this.discardedTiles, ...t];
		}
	}

	// /* ----------------------------------- Remove ----------------------------------- */
	removeFromHidden(t: Tile): void;
	removeFromHidden(t: Tile[]): void;
	removeFromHidden(t: any) {
		let toRemove: string[] = t.length
			? t.map((tile: Tile) => {
					return tile.id;
			  })
			: [t.id];
		this.hiddenTiles = this.hiddenTiles.filter(tile => !toRemove.includes(tile.id));
	}

	removeFromShown(t: Tile): void;
	removeFromShown(t: Tile[]): void;
	removeFromShown(t: any) {
		let toRemove: string[] = t.length
			? t.map((tile: Tile) => {
					return tile.id;
			  })
			: [t.id];
		this.shownTiles = this.shownTiles.filter(tile => !toRemove.includes(tile.id));
	}

	removeFromDiscarded(t: Tile): void;
	removeFromDiscarded(t: Tile[]): void;
	removeFromDiscarded(t: any) {
		let toRemove: string[] = t.length
			? t.map((tile: Tile) => {
					return tile.id;
			  })
			: [t.id];
		this.discardedTiles = this.discardedTiles.filter(tile => !toRemove.includes(tile.id));
	}

	/* ----------------------------------- Take ----------------------------------- */
	discard(tileToThrow: Tile): Tile {
		this.removeFromHidden(tileToThrow);
		this.addToDiscarded(tileToThrow);
		return tileToThrow;
	}
	take(tiles: Tile[]) {
		this.removeFromHidden(tiles);
		this.addToShown(tiles);
	}
	pongOrKang(tiles: Tile[]) {
		this.take(tiles);
		this.pongs = [...this.pongs, tiles[0].card];
	}
	selfKang(toKang: Tile) {
		this.removeFromHidden(toKang);
		this.addToShown(toKang, indexOfCard(toKang, this.shownTiles));
	}

	/* ----------------------------------- Hu: show/hide tiles ----------------------------------- */

	showTilesHu(lastThrown?: Tile) {
		this.shownTiles = lastThrown
			? [...this.shownTiles, ...this.hiddenTiles, lastThrown]
			: [...this.shownTiles, ...this.hiddenTiles];
		this.hiddenTiles = [];
	}

	hideTilesHu(lastThrown?: Tile) {
		this.hiddenTiles = this.shownTiles.filter((tile: Tile) => {
			return tile.show === false && lastThrown?.id !== tile.id;
		});
		this.shownTiles = this.shownTiles.filter((tile: Tile) => {
			return tile.show === true && lastThrown?.id !== tile.id;
		});
		if (!lastThrown) {
			console.log('Zimo ??');
		}
	}
}
