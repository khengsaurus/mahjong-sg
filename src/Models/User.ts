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
	shownTiles?: ITile[];
	melds?: string[];
	hiddenTiles?: ITile[];
	discardedTiles?: ITile[];
	lastTakenTile?: ITile;
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
		shownTiles?: ITile[],
		melds?: string[],
		hiddenTiles?: ITile[],
		discardedTiles?: ITile[],
		lastTakenTile?: ITile,
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

	draw(tiles: ITile[]): ITile[] {
		this.hiddenTiles.push(tiles.pop());
		return tiles;
	}

	buHua(tiles: ITile[]): ITile[] {
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
		this.melds = [];
		this.showTiles = false;
	}

	countAllHiddenTiles(): number {
		return this.hiddenTiles.length + (isEmpty(this.lastTakenTile) ? 0 : 1);
	}

	allHiddenTiles(): ITile[] {
		return isEmpty(this.lastTakenTile) ? this.hiddenTiles : [...this.hiddenTiles, this.lastTakenTile];
	}

	/* ----------------------------------- Take options ----------------------------------- */
	canChi(tiles: ITile[]): boolean {
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
	canPong(tiles: ITile[]): boolean {
		return tiles.length === 3 && tiles.every(tile => tile.card === tiles[0].card) ? true : false;
	}
	canKang(tiles: ITile[]): boolean {
		if (tiles.length === 1 && this.hasPong(tiles[0].card)) {
			return true;
		} else if (tiles.length === 4) {
			return tiles.every(tile => tile.card === tiles[0].card) ? true : false;
		} else {
			return false;
		}
	}

	/* ----------------------------------- Handle last taken tile ----------------------------------- */
	putNewITilentoHidden() {
		if (!isEmpty(this.lastTakenTile) && !this.hiddenTilesContain(this.lastTakenTile)) {
			this.addToHidden(this.lastTakenTile);
		}
		this.lastTakenTile = {};
	}

	setHiddenTiles() {
		this.putNewITilentoHidden();
		this.sortHiddenTiles();
	}

	getNewTile(t: ITile) {
		this.putNewITilentoHidden();
		this.lastTakenTile = t;
	}

	returnNewTile(): ITile {
		let t = !isEmpty(this.lastTakenTile) ? null : this.lastTakenTile;
		this.lastTakenTile = {};
		return t;
	}

	/* ----------------------------------- Contains ----------------------------------- */
	allHiddenTilesContain(t: ITile): boolean {
		return (!isEmpty(this.lastTakenTile) ? [...this.hiddenTiles, this.lastTakenTile] : this.hiddenTiles)
			.map(tile => tile.id)
			.includes(t.id);
	}
	hiddenTilesContain(t: ITile): boolean {
		return this.hiddenTiles?.map(tile => tile.id).includes(t.id);
	}
	shownTilesContain(t: ITile): boolean {
		return this.shownTiles?.map(tile => tile.id).includes(t.id);
	}
	shownTilesContainCard(card: string): boolean {
		return this.shownTiles?.map(tile => tile.card).includes(card);
	}
	discardedTilesContain(t: ITile): boolean {
		return this.discardedTiles?.map(tile => tile.id).includes(t.id);
	}
	lastTakenTileUUID(): string {
		let all = this.allHiddenTiles();
		return all.length > 0 ? all[all.length - 1].uuid : '';
	}
	lastDiscardedTileUUID(): string {
		return this.discardedTiles.length > 0 ? this.discardedTiles.slice(-1)[0].uuid : '';
	}
	lastDiscardedTileIs(t: ITile): boolean {
		if (isEmpty(t) || this.discardedTiles.length === 0) {
			return false;
		} else {
			return this.discardedTiles.slice(-1)[0].id === t.id;
		}
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
		return this.containsMeld(card, 'p');
	}
	updatePongToKang(card: string) {
		let repr = `p-${card}`;
		let i = this.melds.indexOf(repr);
		if (i !== -1) {
			this.melds[i] = `k-${card}`;
		}
	}

	/* ----------------------------------- Add ----------------------------------- */
	addToHidden(t: ITile): void;
	addToHidden(t: ITile[]): void;
	addToHidden(t: any) {
		if (!t.length) {
			this.hiddenTiles = [...this.hiddenTiles, t];
		} else {
			this.hiddenTiles = [...this.hiddenTiles, ...t];
		}
	}

	addToShown(t: ITile, index?: number): void;
	addToShown(t: ITile[]): void;
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
			let type = this.canKang(t) ? 'k' : this.canPong(t) ? 'p' : 'c';
			this.addMeld(t[1].card, type);
		}
	}

	addToDiscarded(t: ITile): void;
	addToDiscarded(t: ITile[]): void;
	addToDiscarded(t: any) {
		if (!t.length) {
			this.discardedTiles = [...this.discardedTiles, t];
		} else {
			this.discardedTiles = [...this.discardedTiles, ...t];
		}
	}

	/* ----------------------------------- Remove ----------------------------------- */
	removeFromHidden(t: ITile): void;
	removeFromHidden(t: ITile[]): void;
	removeFromHidden(t: any) {
		let toRemove: string[] = t.length
			? t.map((tile: ITile) => {
					return tile.id;
			  })
			: [t.id];
		if (!isEmpty(this.lastTakenTile) && toRemove.includes(this.lastTakenTile.id)) {
			this.lastTakenTile = {};
		}
		this.hiddenTiles = this.hiddenTiles.filter(tile => !toRemove.includes(tile.id));
	}

	removeFromShown(t: ITile): void;
	removeFromShown(t: ITile[]): void;
	removeFromShown(t: any) {
		let toRemove: string[] = t.length
			? t.map((tile: ITile) => {
					return tile.id;
			  })
			: [t.id];
		this.shownTiles = this.shownTiles.filter(tile => !toRemove.includes(tile.id));
	}

	removeFromDiscarded(t: ITile): void;
	removeFromDiscarded(t: ITile[]): void;
	removeFromDiscarded(t: any) {
		let toRemove: string[] = t.length
			? t.map((tile: ITile) => {
					return tile.id;
			  })
			: [t.id];
		this.discardedTiles = this.discardedTiles.filter(tile => !toRemove.includes(tile.id));
	}

	/* ----------------------------------- Take ----------------------------------- */
	discard(tileToThrow: ITile): ITile {
		this.putNewITilentoHidden();
		this.removeFromHidden(tileToThrow);
		this.addToDiscarded(tileToThrow);
		return tileToThrow;
	}
	moveIntoShown(tiles: ITile[]) {
		this.removeFromHidden(tiles);
		this.addToShown(tiles);
		// this.pongs = [...this.pongs, tiles[0].card];
	}
	selfKang(toKang: ITile) {
		this.removeFromHidden(toKang);
		this.addToShown(toKang, indexOfCard(toKang, this.shownTiles));
	}

	/* ----------------------------------- Hu: show/hide tiles ----------------------------------- */

	showTilesHu(lastThrown?: ITile) {
		this.shownTiles = lastThrown
			? [...this.shownTiles, ...this.hiddenTiles, lastThrown]
			: [...this.shownTiles, ...this.hiddenTiles];
		this.hiddenTiles = [];
	}

	hideTilesHu(lastThrown?: ITile) {
		this.hiddenTiles = this.shownTiles.filter((tile: ITile) => {
			return tile.show === false && lastThrown?.id !== tile.id;
		});
		this.shownTiles = this.shownTiles.filter((tile: ITile) => {
			return tile.show === true && lastThrown?.id !== tile.id;
		});
		if (!lastThrown) {
			// TODO:
			// console.log('Zimo ??');
		}
	}
}
