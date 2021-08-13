import { search } from '../util/utilFns';

export class User {
	id: string;
	username: string;
	photoUrl: string;
	shownTiles?: Tile[] | null;
	hiddenTiles?: Tile[] | null;
	discardedTiles?: Tile[] | null;
	unusedTiles?: number;
	pongs?: string[];
	balance?: number;

	constructor(
		id: string,
		username: string,
		photoUrl: string,
		shownTiles?: Tile[],
		hiddenTiles?: Tile[],
		discardedTiles?: Tile[],
		unusedTiles?: number,
		pongs?: string[],
		balance?: number
	) {
		this.id = id;
		this.username = username;
		this.photoUrl = photoUrl;
		this.shownTiles = shownTiles || [];
		this.hiddenTiles = hiddenTiles || [];
		this.discardedTiles = discardedTiles || [];
		this.unusedTiles = unusedTiles || null;
		this.pongs = pongs || [];
		this.balance = balance || 0;
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

	sort(tiles: Tile[]) {
		tiles.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
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

	/* ----------------------------------- Take ----------------------------------- */
	discard(tileToThrow: Tile): Tile {
		this.removeTileFromHidden(tileToThrow);
		this.addTileToDiscarded(tileToThrow);
		return tileToThrow;
	}
	take(tiles: Tile[]) {
		this.removeNTilesFromHidden(tiles);
		this.addNTilesToShown(tiles);
	}
	pongOrKang(tiles: Tile[]) {
		this.take(tiles);
		this.pongs = [...this.pongs, tiles[0].card];
	}
	selfKang(toKang: Tile) {
		this.removeTileFromHidden(toKang);
		this.addTileToShownTiles(toKang, search(toKang, this.shownTiles));
	}

	/* ----------------------------------- Contains ----------------------------------- */
	hiddenTilesContain(tile: Tile): boolean {
		return this.hiddenTiles
			.map(tile => {
				return tile.id;
			})
			.includes(tile.id);
	}
	shownTilesContain(tile: Tile): boolean {
		return this.shownTiles
			.map(tile => {
				return tile.id;
			})
			.includes(tile.id);
	}
	discardedTilesContain(tile: Tile): boolean {
		return this.discardedTiles
			.map(tile => {
				return tile.id;
			})
			.includes(tile.id);
	}

	/* ----------------------------------- Remove 1 tile ----------------------------------- */
	removeTileFromHidden(tile: Tile) {
		this.hiddenTiles = this.hiddenTiles.filter(hiddenTile => {
			return hiddenTile.id !== tile.id;
		});
	}
	removeTileFromShownTiles(tile: Tile) {
		this.shownTiles = this.shownTiles.filter(shownTile => {
			return shownTile.id !== tile.id;
		});
	}
	removeTileFromDiscardedTiles(tile: Tile) {
		this.discardedTiles = this.discardedTiles.filter(discardedTile => {
			return discardedTile.id !== tile.id;
		});
	}

	/* ----------------------------------- Remove N tiles ----------------------------------- */
	removeNTilesFromHidden(tiles: Tile[]) {
		let toShow: string[] = tiles.map(function (tile: Tile) {
			return tile.id;
		});
		this.hiddenTiles = this.hiddenTiles.filter(tile => !toShow.includes(tile.id));
	}
	removeNTilesFromShown(tiles: Tile[]) {
		let toShow: string[] = tiles.map(function (tile: Tile) {
			return tile.id;
		});
		this.shownTiles = this.shownTiles.filter(tile => !toShow.includes(tile.id));
	}
	removeNTilesFromDiscarded(tiles: Tile[]) {
		let toShow: string[] = tiles.map(function (tile: Tile) {
			return tile.id;
		});
		this.discardedTiles = this.discardedTiles.filter(tile => !toShow.includes(tile.id));
	}

	/* ----------------------------------- Add 1 tile ----------------------------------- */
	addTileToHiddenTiles(tile: Tile) {
		this.hiddenTiles = [...this.hiddenTiles, tile];
	}
	addTileToShownTiles(tile: Tile, index?: number) {
		if (index) {
			let initLength = this.shownTiles.length;
			this.shownTiles = [...this.shownTiles.slice(0, index), tile, ...this.shownTiles.slice(index, initLength)];
		} else {
			this.shownTiles = [...this.shownTiles, tile];
		}
	}
	addTileToDiscarded(tile: Tile) {
		this.discardedTiles = [...this.discardedTiles, tile];
	}

	/* ----------------------------------- Add N tiles ----------------------------------- */
	addNTilesToHiddenTiles(tiles: Tile[]) {
		this.hiddenTiles = [...this.hiddenTiles, ...tiles];
	}
	addNTilesToShown(tiles: Tile[]) {
		this.shownTiles = [...this.shownTiles, ...tiles];
	}
	addNTilesToDiscardedTiles(tiles: Tile[]) {
		this.discardedTiles = [...this.discardedTiles, ...tiles];
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
