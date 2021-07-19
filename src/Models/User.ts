export class User {
	id: string;
	username: string;
	photoUrl: string;
	currentSeat?: number;
	shownTiles?: Tile[] | null;
	hiddenTiles?: Tile[] | null;
	discardedTiles?: Tile[] | null;
	unusedTiles?: number;

	constructor(
		id: string,
		username: string,
		photoUrl: string,
		currentSeat?: number,
		shownTiles?: Tile[],
		hiddenTiles?: Tile[],
		discardedTiles?: Tile[],
		unusedTiles?: number
	) {
		this.id = id;
		this.username = username;
		this.photoUrl = photoUrl;
		this.currentSeat = currentSeat;
		this.shownTiles = shownTiles || [];
		this.hiddenTiles = hiddenTiles || [];
		this.discardedTiles = discardedTiles || [];
		this.unusedTiles = unusedTiles || null;
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
		tiles.sort(function (a, b) {
			return a.number - b.number;
		});
		return tiles;
	}

	canChi(tiles: Tile[]): boolean {
		let sameSuit = tiles.every(tile => tile.card === tiles[0].card) ? true : false;
		let sortedTiles = this.sort(tiles);
		if (
			sameSuit &&
			sortedTiles[2].number === sortedTiles[1].number - 1 &&
			sortedTiles[1].number === sortedTiles[0].number - 1
		) {
			return true;
		} else {
			return false;
		}
	}

	canPong(tiles: Tile[]): boolean {
		return tiles.length === 3 && tiles.every(tile => tile.card === tiles[0].card) ? true : false;
	}

	canKang(tiles: Tile[]): boolean {
		return tiles.length === 4 && tiles.every(tile => tile.card === tiles[0].card) ? true : false;
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
