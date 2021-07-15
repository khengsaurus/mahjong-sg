export class User {
	id: string;
	username: string;
	photoUrl: string;
	currentSeat?: number;
	shownTiles?: Tile[] | null;
	hiddenTiles?: Tile[] | null;
	discardedTiles?: Tile[] | null;

	constructor(
		id: string,
		username: string,
		photoUrl: string,
		currentSeat?: number,
		shownTiles?: Tile[],
		hiddenTiles?: Tile[],
		discardedTiles?: Tile[]
	) {
		this.id = id;
		this.username = username;
		this.photoUrl = photoUrl;
		this.currentSeat = currentSeat;
		this.shownTiles = shownTiles || [];
		this.hiddenTiles = hiddenTiles || [];
		this.discardedTiles = discardedTiles || [];
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
		let sortedTiles = this.sort(tiles);
		if (
			sortedTiles[2].number === sortedTiles[1].number - 1 &&
			sortedTiles[1].number === sortedTiles[0].number - 1 &&
			sortedTiles[2].suit === sortedTiles[1].suit &&
			sortedTiles[1].suit === sortedTiles[0].suit
		) {
			return true;
		} else {
			return false;
		}
	}

	canPong(tiles: Tile[]): boolean {
		if (tiles[2].card === tiles[1].card && tiles[1].card === tiles[0].card) {
			return true;
		} else {
			return false;
		}
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
