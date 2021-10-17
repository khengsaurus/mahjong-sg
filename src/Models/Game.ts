import { isEmpty } from 'lodash';
import { Animals, CardCategories, DaPai, Flowers, Suits, Winds } from '../global/enums';
import {
	findLeft,
	findOpp,
	findRight,
	findTwoInSorted,
	getTileHashKey,
	hashTileId,
	revealTile,
	shuffle
} from '../util/utilFns';
import { User } from './User';

export class Game {
	id: string;
	cro: string;
	crA: Date;
	// lastExec: number;
	up: Date;
	dFr: Date;
	pS?: string;
	es?: string[];
	on?: boolean;
	st?: number;
	prev?: number;
	mid?: boolean;
	fN?: boolean;
	dealer?: number;
	wM?: number;
	// pIds?: string[];
	ps?: User[];
	tiles?: IHiddenTile[];
	front?: number;
	back?: number;
	lastT?: IShownTile;
	tBy?: number;
	thrown?: boolean;
	taken?: boolean;
	takenB?: number;
	// halfMove?: boolean;
	hu?: number[];
	draw?: boolean;
	logs?: ILog[];
	// Constants
	dHTs?: number;
	nDHTs?: number;
	dTs?: number;
	nDTs?: number;

	constructor(
		id: string,
		cro?: string,
		crA?: Date,
		pS?: string,
		es?: string[],
		on?: boolean,
		// lastExec?: number,
		up?: Date,
		dFr?: Date,
		st?: number,
		prev?: number,
		dealer?: number,
		mid?: boolean,
		fN?: boolean,
		wM?: number,
		// pIds?: string[],
		ps?: User[],
		tiles?: IHiddenTile[],
		front?: number,
		back?: number,
		lastT?: IShownTile,
		tBy?: number,
		thrown?: boolean,
		taken?: boolean,
		takenB?: number,
		// halfMove?: boolean,
		hu?: number[],
		draw?: boolean,
		logs?: ILog[]
	) {
		this.id = id;
		this.cro = cro;
		this.crA = crA;
		this.pS = pS;
		this.es = es;
		this.on = on;
		// // this.lastExec = lastExec;
		this.up = up;
		this.dFr = dFr;
		this.st = st;
		this.prev = prev;
		this.dealer = dealer;
		this.mid = mid;
		this.fN = fN;
		this.wM = wM;
		// this.pIds = pIds;
		this.ps = ps;
		this.tiles = tiles;
		this.front = front;
		this.back = back;
		this.lastT = lastT;
		this.tBy = tBy;
		this.thrown = thrown;
		this.taken = taken;
		this.takenB = takenB;
		// this.halfMove = halfMove;
		this.hu = hu;
		this.draw = draw;
		this.logs = logs;
		// Constants
		this.dHTs = 38;
		this.nDHTs = 36;
		this.dTs = 14;
		this.nDTs = 13;
	}

	/*---------------------------------------- Actions ----------------------------------------*/
	findPlayerIndexByUsername(Username: string) {
		for (var n in [0, 1, 2, 3]) {
			if (this.ps[n].username === Username) {
				return n;
			}
			return -1;
		}
	}

	// execute(event: IAction) {
	// 	const { username, action, huStatus, tile, sentToUsername, amount } = event;
	// 	switch (action) {
	// 		case Actions.TAKE:
	// 			return;
	// 		case Actions.DRAW:
	// 			return;
	// 		case Actions.RETURN:
	// 			return;
	// 		case Actions.KANG:
	// 			return;
	// 		case Actions.THROW:
	// 			this.nextPlayerMove();
	// 			break;
	// 		case Actions.SHOW:
	// 			return;
	// 		case Actions.HIDE:
	// 			return;
	// 		case Actions.HU:
	// 			return;
	// 		case Actions.START:
	// 			return;
	// 		case Actions.END:
	// 			this.hu = huStatus;
	// 			this.endRound();
	// 			break;
	// 		default:
	// 			return;
	// 	}
	// }
	/*---------------------------------------- End actions ----------------------------------------*/

	newLog(log: string) {
		let newLog = { msg: log, timestamp: new Date() };
		this.logs = [...this.logs, newLog];
		if (this.logs.length >= 50) {
			this.logs = this.logs.slice(-15);
		}
	}

	generateHiddenTiles(): IHiddenTile[] {
		let tiles: IHiddenTile[] = [];
		let tileHashKey = getTileHashKey(this.id, this.st);
		const oneToFour = [1, 2, 3, 4];
		const oneToNine = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		const suits = [Suits.WAN, Suits.TONG, Suits.SUO];
		const winds = [Winds.E, Winds.S, Winds.W, Winds.N];
		const daPai = [DaPai.RED, DaPai.WHITE, DaPai.GREEN];
		const animals = [Animals.CAT, Animals.MOUSE, Animals.ROOSTER, Animals.WORM];
		const flowers = [
			Flowers.RED1,
			Flowers.RED2,
			Flowers.RED3,
			Flowers.RED4,
			Flowers.BLUE1,
			Flowers.BLUE2,
			Flowers.BLUE3,
			Flowers.BLUE4
		];
		oneToFour.forEach(index => {
			suits.forEach(suit => {
				oneToNine.forEach(number => {
					let tile: IHiddenTile = {
						id: hashTileId(`${CardCategories.REGULAR}${suit}${number}${index}`, tileHashKey)
					};
					tiles.push(tile);
				});
			});
			winds.forEach(pai => {
				let tile: IHiddenTile = {
					id: hashTileId(`${CardCategories.WINDS}${pai}${index}`, tileHashKey)
				};
				tiles.push(tile);
			});
			daPai.forEach(pai => {
				let tile: IHiddenTile = {
					id: hashTileId(`${CardCategories.HBF}${pai}${index}`, tileHashKey)
				};
				tiles.push(tile);
			});
		});
		flowers.forEach(flower => {
			let tile: IHiddenTile = {
				id: hashTileId(`${CardCategories.FLOWER}${flower}`, tileHashKey)
			};
			tiles.push(tile);
		});
		animals.forEach(animal => {
			let tile: IHiddenTile = {
				id: hashTileId(`${CardCategories.ANIMAL}${animal}`, tileHashKey)
			};
			tiles.push(tile);
		});
		this.newLog(`Generated ${tiles.length} tiles`);
		return tiles;
	}

	giveTiles(n: number, playerIndex: number, buHua?: boolean, offsetUnused?: boolean): IHiddenTile {
		let player = this.ps[playerIndex];
		let hiddenTile: IHiddenTile;
		let revealedTile: IShownTile;
		let tileHashKey: number;
		let receivedFlower: boolean = false;
		let log = `${player.username} ${buHua ? `bu hua, ` : ``} received `;
		let flowerReceived = '';
		let flowersReceived = ', including';
		if (!player.hiddenTiles) {
			player.hiddenTiles = [];
		}
		for (let i: number = 0; i < n; i++) {
			if (buHua) {
				hiddenTile = this.tiles.shift();
				// Logic to update shortening stack of back(hua) tiles
				if (offsetUnused) {
					if (this.ps[this.back].unusedTiles === 1) {
						this.ps[this.back].unusedTiles = 0;
						this.back = findRight(this.back);
					} else {
						this.ps[this.back].unusedTiles -= 1;
					}
				}
			} else {
				hiddenTile = this.tiles.pop();
				// Logic to update shortening stack of front tiles
				if (offsetUnused) {
					if (this.ps[this.front].unusedTiles === 1) {
						this.ps[this.front].unusedTiles = 0;
						this.front = findLeft(this.front);
					} else {
						this.ps[this.front].unusedTiles -= 1;
					}
				}
			}
			tileHashKey = getTileHashKey(this.id, this.st);
			revealedTile = revealTile(hiddenTile, tileHashKey);
			if (revealedTile.suit === Suits.ANIMAL) {
				if (
					(this.ps[playerIndex].shownTilesContainCard(`rooster`) &&
						this.ps[playerIndex].shownTilesContainCard(`worm`)) ||
					(this.ps[playerIndex].shownTilesContainCard(`cat`) &&
						this.ps[playerIndex].shownTilesContainCard(`mouse`))
				) {
					this.newLog(`${this.ps[playerIndex].username} drew matching animals`);
					this.fN = true;
				}
			} else if (
				revealedTile.suit === Suits.FLOWER &&
				parseInt(revealedTile.card.slice(-1)) === playerIndex + 1
			) {
				if (
					this.ps[playerIndex].shownTilesContainCard(`red${revealedTile.card.slice(-1)}`) &&
					this.ps[playerIndex].shownTilesContainCard(`blue${revealedTile.card.slice(-1)}`)
				) {
					this.newLog(`${this.ps[playerIndex].username} drew both his/her flowers`);
					this.fN = true;
				}
			}
			if (revealedTile.suit === Suits.FLOWER || revealedTile.suit === Suits.ANIMAL) {
				receivedFlower = true;
				flowerReceived = revealedTile.card;
				flowersReceived += ` ${revealedTile.card}`;
				player.shownTiles = [...player.shownTiles, hiddenTile];
			} else {
				player.getNewTile(hiddenTile);
			}
		}
		if (n === 1 && receivedFlower) {
			log += flowerReceived;
		} else {
			log += `${n} tile(s)`;
			if (receivedFlower) {
				log += flowersReceived;
			}
		}
		this.newLog(log);
		return hiddenTile;
	}

	//TODO: optimise
	distributeTiles() {
		this.newLog('Distributing tiles');
		let dealer = this.ps[this.dealer];
		let leftPlayer = this.ps[findLeft(this.dealer)];
		let rightPlayer = this.ps[findRight(this.dealer)];
		let oppPlayer = this.ps[findOpp(this.dealer)];
		let toBeDealtByDealer: number;
		let toBeDealtByLeft: number;
		let toBeDealtByRight: number;
		let toBeDealtByOpp: number;
		let initDealtTiles = this.dTs + 3 * this.nDTs;
		let rolled = dealer.rollDice();
		this.newLog(`${dealer.username} rolled: ${rolled}`);

		// Set front and back, and how many unused tiles each dealer has
		switch (rolled % 4) {
			case 0: // deal from left
				this.newLog(`Dealing from ${this.ps[findLeft(this.dealer)].username}`);
				this.back = findLeft(this.dealer);
				toBeDealtByLeft = this.nDHTs - 2 * rolled;
				leftPlayer.unusedTiles = 2 * rolled;
				toBeDealtByOpp = initDealtTiles - toBeDealtByLeft;
				if (toBeDealtByOpp > this.dHTs) {
					oppPlayer.unusedTiles = 0;
					toBeDealtByRight = toBeDealtByOpp - this.dHTs;
					rightPlayer.unusedTiles = this.nDHTs - toBeDealtByRight;
					this.front = findRight(this.dealer);
				} else {
					oppPlayer.unusedTiles = this.dHTs - toBeDealtByOpp;
					rightPlayer.unusedTiles = this.nDHTs;
					this.front = findOpp(this.dealer);
				}
				dealer.unusedTiles = this.dHTs;
				break;
			case 1: // deal from dealer
				this.newLog(`Dealing from ${this.ps[this.dealer].username}`);
				this.back = this.dealer;
				toBeDealtByDealer = this.dHTs - 2 * rolled;
				dealer.unusedTiles = 2 * rolled;
				toBeDealtByLeft = initDealtTiles - toBeDealtByDealer;
				if (toBeDealtByLeft > this.nDHTs) {
					leftPlayer.unusedTiles = 0;
					toBeDealtByOpp = toBeDealtByLeft - this.nDHTs;
					oppPlayer.unusedTiles = this.dHTs - toBeDealtByOpp;
					this.front = findOpp(this.dealer);
				} else {
					leftPlayer.unusedTiles = this.nDHTs - toBeDealtByLeft;
					oppPlayer.unusedTiles = this.dHTs;
					this.front = findLeft(this.dealer);
				}
				rightPlayer.unusedTiles = this.nDHTs;
				break;
			case 2: // deal from right
				this.newLog(`Dealing from ${this.ps[findRight(this.dealer)].username}`);
				this.back = findRight(this.dealer);
				toBeDealtByRight = this.nDHTs - 2 * rolled;
				rightPlayer.unusedTiles = 2 * rolled;
				toBeDealtByDealer = initDealtTiles - toBeDealtByRight;
				if (toBeDealtByDealer > this.dHTs) {
					dealer.unusedTiles = 0;
					toBeDealtByLeft = toBeDealtByDealer - this.dHTs;
					leftPlayer.unusedTiles = this.nDHTs - toBeDealtByLeft;
					this.front = findLeft(this.dealer);
				} else {
					dealer.unusedTiles = this.dHTs - toBeDealtByDealer;
					leftPlayer.unusedTiles = this.nDHTs;
					this.front = this.dealer;
				}
				oppPlayer.unusedTiles = this.dHTs;
				break;
			case 3: // deal from opposite
				this.newLog(`Dealing from ${this.ps[findOpp(this.dealer)].username}`);
				this.back = findOpp(this.dealer);
				oppPlayer.unusedTiles = 2 * rolled;
				toBeDealtByOpp = this.dHTs - 2 * rolled;
				toBeDealtByRight = initDealtTiles - toBeDealtByOpp;
				if (toBeDealtByRight > this.nDHTs) {
					rightPlayer.unusedTiles = 0;
					toBeDealtByDealer = toBeDealtByRight - this.nDHTs;
					dealer.unusedTiles = this.dHTs - toBeDealtByDealer;
					this.front = this.dealer;
				} else {
					rightPlayer.unusedTiles = this.nDHTs - toBeDealtByRight;
					dealer.unusedTiles = this.dHTs;
					this.front = findRight(this.dealer);
				}
				leftPlayer.unusedTiles = this.nDHTs;
				break;
		}
		this.giveTiles(this.dTs, this.dealer, false, false);
		this.giveTiles(this.nDTs, findRight(this.dealer), false, false);
		this.giveTiles(this.nDTs, findOpp(this.dealer), false, false);
		this.giveTiles(this.nDTs, findLeft(this.dealer), false, false);
		while (
			this.ps[this.dealer].countAllHiddenTiles() < this.dTs ||
			this.ps[findRight(this.dealer)].countAllHiddenTiles() < this.nDTs ||
			this.ps[findOpp(this.dealer)].countAllHiddenTiles() < this.nDTs ||
			this.ps[findLeft(this.dealer)].countAllHiddenTiles() < this.nDTs
		) {
			this.buHua();
		}
		this.ps.forEach((player: User) => {
			player.setHiddenTiles();
			player.sortShownTiles();
		});
		this.taken = true;
		this.takenB = this.dealer;
		// TODO: remove
		if (!!this.ps.find(player => player.username.toUpperCase() === 'TEST20TILESLEFT')) {
			this.tiles = this.tiles.slice(0, 20);
		}
	}

	buHua() {
		if (this.ps[this.dealer].countAllHiddenTiles() < this.dTs) {
			this.giveTiles(this.dTs - this.ps[this.dealer].countAllHiddenTiles(), this.dealer, true, true);
		}
		let others: number[] = [findRight(this.dealer), findOpp(this.dealer), findLeft(this.dealer)];
		others.forEach((n: number) => {
			if (this.ps[n].countAllHiddenTiles() < this.nDTs) {
				this.giveTiles(this.nDTs - this.ps[n].countAllHiddenTiles(), n, true, true);
			}
		});
	}

	handlePongDelay() {
		if (!isEmpty(this.lastT)) {
			for (let n = 0; n < this.ps.length; n++) {
				if (
					n !== this.tBy &&
					n !== findRight(this.tBy) &&
					findTwoInSorted(this.lastT, this.ps[n].hiddenTiles, 'card')
				) {
					this.dFr = new Date();
				}
			}
		}
	}

	nextPlayerMove() {
		this.wM = findRight(this.wM);
		this.taken = false;
		this.thrown = false;
		// this.halfMove = false;
		this.newLog(`${this.ps[this.wM].username}'s turn`);
	}

	repr(): any[] {
		let res: any[];
		if (this.st <= 4) {
			res = ['東', this.st];
		} else if (this.st <= 8) {
			res = ['南', ((this.st - 1) % 4) + 1];
		} else if (this.st <= 12) {
			res = ['西', ((this.st - 1) % 8) + 1];
		} else if (this.st <= 16) {
			res = ['北', ((this.st - 1) % 12) + 1];
		}
		if (this.st === this.prev) {
			res.push(['连']);
		}
		return res;
	}

	prepForNewRound() {
		this.mid = true;
		this.wM = this.dealer;
		this.ps.forEach(player => {
			player.prepareForNewRound();
		});
		this.tiles = [];
		this.front = null;
		this.back = null;
		this.lastT = {};
		this.tBy = null;
		this.thrown = false;
		this.taken = true;
		this.takenB = this.dealer;
		// this.halfMove = false;
		this.hu = [];
		this.draw = false;
		this.logs = [];
		this.fN = false;
	}

	initRound() {
		if (this.fN) {
			this.st += 1;
		}
		if (this.st === 1) {
			// TODO: remove
			if (!!this.ps.find(player => player.username.toUpperCase() === 'TEST2ROUNDSLEFT')) {
				this.st = 15;
				this.dealer = 2;
			} else {
				this.dealer = 0;
			}
		}
		this.newLog(`Starting round ${this.st}${this.prev === this.st ? ` 连` : ``}`);
		this.prepForNewRound();

		let hiddenTiles = this.generateHiddenTiles();
		let shuffledTiles = shuffle(hiddenTiles);
		for (let i = 0; i < shuffledTiles.length; i++) {
			shuffledTiles[i].ref = i;
		}
		this.tiles = shuffledTiles;
		this.distributeTiles();
		this.newLog(`${this.ps[this.dealer].username}'s turn - to throw`);
	}

	/**
	 * => this.prev(st),
	 * if game is to continue => this.mid(false), this.st+=1, next this.dealer
	 */
	endRound() {
		if (this.hu.length === 3) {
			let huLog: string = `${this.ps[this.hu[0]].username} hu with ${this.hu[1]}台`;
			if (this.hu[2] === 1) {
				huLog += ` 自摸`;
			} else if (this.tBy && this.ps[this.tBy].username !== this.ps[this.hu[0]].username) {
				huLog += `, last tile thrown by ${this.ps[this.tBy].username}`;
			}
			this.newLog(huLog);
		}
		this.mid = false;
		this.prev = this.st;
		if (this.dealer === 3 && this.st === 16 && this.fN) {
			this.dealer = 10;
			this.newLog('Game ended');
			this.on = false;
		} else if (this.fN) {
			this.dealer = (this.dealer + 1) % 4;
			this.newLog('Round ended');
		}
	}

	tileThrown(tile: IShownTile, player: number) {
		this.lastT = tile;
		this.tBy = player;
		this.thrown = true;
		this.newLog(`${this.ps[player].username} discarded ${tile.card}`);
	}
}
