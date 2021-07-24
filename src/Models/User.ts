export class User {
	id: string;
	username: string;
	photoUrl: string;
	shownTiles?: Tile[] | null;
	hiddenTiles?: Tile[] | null;
	discardedTiles?: Tile[] | null;
	unusedTiles?: number;
	pongs?: string[];

	constructor(
		id: string,
		username: string,
		photoUrl: string,
		shownTiles?: Tile[],
		hiddenTiles?: Tile[],
		discardedTiles?: Tile[],
		unusedTiles?: number,
		pongs?: string[]
	) {
		this.id = id;
		this.username = username;
		this.photoUrl = photoUrl;
		this.shownTiles = shownTiles || [];
		this.hiddenTiles = hiddenTiles || [];
		this.discardedTiles = discardedTiles || [];
		this.unusedTiles = unusedTiles || null;
		this.pongs = pongs || [];
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
		if (tiles.length === 1) {
			return this.pongs.includes(tiles[0].card);
		} else if (tiles.length === 4) {
			return tiles.every(tile => tile.card === tiles[0].card) ? true : false;
		}
		return false;
	}

	chi(selectedTiles: Tile[]) {
		if (this.canChi(selectedTiles)) {
			let toShow: string[] = selectedTiles.map(function (tile: Tile) {
				return tile.id;
			});
			this.hiddenTiles = this.hiddenTiles.filter(tile => !toShow.includes(tile.id));
			this.shownTiles = [...this.shownTiles, ...selectedTiles];
		}
	}

	pong(selectedTiles: Tile[]) {
		if (this.canPong(selectedTiles)) {
			let toShow: string[] = selectedTiles.map(function (tile: Tile) {
				return tile.id;
			});
			this.hiddenTiles = this.hiddenTiles.filter(tile => !toShow.includes(tile.id));
			this.shownTiles = [...this.shownTiles, ...selectedTiles];
		}
	}

	discard(tileToThrow: Tile): Tile {
		this.hiddenTiles = this.hiddenTiles.filter(tile => tile.id !== tileToThrow.id);
		this.discardedTiles.push(tileToThrow);
		return tileToThrow;
	}

	declareHu() {}

	undo() {}
}
