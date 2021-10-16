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
	creator: string;
	createdAt: Date;
	// lastExec: number;
	updated: Date;
	delayFrom: Date;
	playersStr?: string;
	emails?: string[];
	ongoing?: boolean;
	stage?: number;
	prev?: number;
	midRound?: boolean;
	flagNext?: boolean;
	dealer?: number;
	whoseMove?: number;
	playerIds?: string[];
	players?: User[];
	tiles?: IHiddenTile[];
	frontTiles?: number;
	backTiles?: number;
	lastThrown?: IShownTile;
	thrownBy?: number;
	thrownTile?: boolean;
	takenTile?: boolean;
	takenBy?: number;
	halfMove?: boolean;
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
		creator?: string,
		createdAt?: Date,
		playersStr?: string,
		emails?: string[],
		ongoing?: boolean,
		// lastExec?: number,
		updated?: Date,
		delayFrom?: Date,
		stage?: number,
		prev?: number,
		dealer?: number,
		midRound?: boolean,
		flagNext?: boolean,
		whoseMove?: number,
		playerIds?: string[],
		players?: User[],
		tiles?: IHiddenTile[],
		frontTiles?: number,
		backTiles?: number,
		lastThrown?: IShownTile,
		thrownBy?: number,
		thrownTile?: boolean,
		takenTile?: boolean,
		takenBy?: number,
		halfMove?: boolean,
		hu?: number[],
		draw?: boolean,
		logs?: ILog[]
	) {
		this.id = id;
		this.creator = creator;
		this.createdAt = createdAt;
		this.playersStr = playersStr;
		this.emails = emails;
		this.ongoing = ongoing;
		// // this.lastExec = lastExec;
		this.updated = updated;
		this.delayFrom = delayFrom;
		this.stage = stage;
		this.prev = prev;
		this.dealer = dealer;
		this.midRound = midRound;
		this.flagNext = flagNext;
		this.whoseMove = whoseMove;
		this.playerIds = playerIds;
		this.players = players;
		this.tiles = tiles;
		this.frontTiles = frontTiles;
		this.backTiles = backTiles;
		this.lastThrown = lastThrown;
		this.thrownBy = thrownBy;
		this.thrownTile = thrownTile;
		this.takenTile = takenTile;
		this.takenBy = takenBy;
		this.halfMove = halfMove;
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
			if (this.players[n].username === Username) {
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
		let tileHashKey = getTileHashKey(this.id, this.stage);
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
						id: hashTileId(`${CardCategories.REGULAR}${number}${suit}${index}`, tileHashKey)
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
		let player = this.players[playerIndex];
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
					if (this.players[this.backTiles].unusedTiles === 1) {
						this.players[this.backTiles].unusedTiles = 0;
						this.backTiles = findRight(this.backTiles);
					} else {
						this.players[this.backTiles].unusedTiles -= 1;
					}
				}
			} else {
				hiddenTile = this.tiles.pop();
				// Logic to update shortening stack of front tiles
				if (offsetUnused) {
					if (this.players[this.frontTiles].unusedTiles === 1) {
						this.players[this.frontTiles].unusedTiles = 0;
						this.frontTiles = findLeft(this.frontTiles);
					} else {
						this.players[this.frontTiles].unusedTiles -= 1;
					}
				}
			}
			tileHashKey = getTileHashKey(this.id, this.stage);
			revealedTile = revealTile(hiddenTile, tileHashKey);
			if (revealedTile.suit === Suits.ANIMAL) {
				if (
					(this.players[playerIndex].shownTilesContainCard(`rooster`) &&
						this.players[playerIndex].shownTilesContainCard(`worm`)) ||
					(this.players[playerIndex].shownTilesContainCard(`cat`) &&
						this.players[playerIndex].shownTilesContainCard(`mouse`))
				) {
					this.newLog(`${this.players[playerIndex].username} drew matching animals`);
					this.flagNext = true;
				}
			} else if (
				revealedTile.suit === Suits.FLOWER &&
				parseInt(revealedTile.card.slice(-1)) === playerIndex + 1
			) {
				if (
					this.players[playerIndex].shownTilesContainCard(`red${revealedTile.card.slice(-1)}`) &&
					this.players[playerIndex].shownTilesContainCard(`blue${revealedTile.card.slice(-1)}`)
				) {
					this.newLog(`${this.players[playerIndex].username} drew both his/her flowers`);
					this.flagNext = true;
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
		let dealer = this.players[this.dealer];
		let leftPlayer = this.players[findLeft(this.dealer)];
		let rightPlayer = this.players[findRight(this.dealer)];
		let oppPlayer = this.players[findOpp(this.dealer)];
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
				this.newLog(`Dealing from ${this.players[findLeft(this.dealer)].username}`);
				this.backTiles = findLeft(this.dealer);
				toBeDealtByLeft = this.nDHTs - 2 * rolled;
				leftPlayer.unusedTiles = 2 * rolled;
				toBeDealtByOpp = initDealtTiles - toBeDealtByLeft;
				if (toBeDealtByOpp > this.dHTs) {
					oppPlayer.unusedTiles = 0;
					toBeDealtByRight = toBeDealtByOpp - this.dHTs;
					rightPlayer.unusedTiles = this.nDHTs - toBeDealtByRight;
					this.frontTiles = findRight(this.dealer);
				} else {
					oppPlayer.unusedTiles = this.dHTs - toBeDealtByOpp;
					rightPlayer.unusedTiles = this.nDHTs;
					this.frontTiles = findOpp(this.dealer);
				}
				dealer.unusedTiles = this.dHTs;
				break;
			case 1: // deal from dealer
				this.newLog(`Dealing from ${this.players[this.dealer].username}`);
				this.backTiles = this.dealer;
				toBeDealtByDealer = this.dHTs - 2 * rolled;
				dealer.unusedTiles = 2 * rolled;
				toBeDealtByLeft = initDealtTiles - toBeDealtByDealer;
				if (toBeDealtByLeft > this.nDHTs) {
					leftPlayer.unusedTiles = 0;
					toBeDealtByOpp = toBeDealtByLeft - this.nDHTs;
					oppPlayer.unusedTiles = this.dHTs - toBeDealtByOpp;
					this.frontTiles = findOpp(this.dealer);
				} else {
					leftPlayer.unusedTiles = this.nDHTs - toBeDealtByLeft;
					oppPlayer.unusedTiles = this.dHTs;
					this.frontTiles = findLeft(this.dealer);
				}
				rightPlayer.unusedTiles = this.nDHTs;
				break;
			case 2: // deal from right
				this.newLog(`Dealing from ${this.players[findRight(this.dealer)].username}`);
				this.backTiles = findRight(this.dealer);
				toBeDealtByRight = this.nDHTs - 2 * rolled;
				rightPlayer.unusedTiles = 2 * rolled;
				toBeDealtByDealer = initDealtTiles - toBeDealtByRight;
				if (toBeDealtByDealer > this.dHTs) {
					dealer.unusedTiles = 0;
					toBeDealtByLeft = toBeDealtByDealer - this.dHTs;
					leftPlayer.unusedTiles = this.nDHTs - toBeDealtByLeft;
					this.frontTiles = findLeft(this.dealer);
				} else {
					dealer.unusedTiles = this.dHTs - toBeDealtByDealer;
					leftPlayer.unusedTiles = this.nDHTs;
					this.frontTiles = this.dealer;
				}
				oppPlayer.unusedTiles = this.dHTs;
				break;
			case 3: // deal from opposite
				this.newLog(`Dealing from ${this.players[findOpp(this.dealer)].username}`);
				this.backTiles = findOpp(this.dealer);
				oppPlayer.unusedTiles = 2 * rolled;
				toBeDealtByOpp = this.dHTs - 2 * rolled;
				toBeDealtByRight = initDealtTiles - toBeDealtByOpp;
				if (toBeDealtByRight > this.nDHTs) {
					rightPlayer.unusedTiles = 0;
					toBeDealtByDealer = toBeDealtByRight - this.nDHTs;
					dealer.unusedTiles = this.dHTs - toBeDealtByDealer;
					this.frontTiles = this.dealer;
				} else {
					rightPlayer.unusedTiles = this.nDHTs - toBeDealtByRight;
					dealer.unusedTiles = this.dHTs;
					this.frontTiles = findRight(this.dealer);
				}
				leftPlayer.unusedTiles = this.nDHTs;
				break;
		}
		this.giveTiles(this.dTs, this.dealer, false, false);
		this.giveTiles(this.nDTs, findRight(this.dealer), false, false);
		this.giveTiles(this.nDTs, findOpp(this.dealer), false, false);
		this.giveTiles(this.nDTs, findLeft(this.dealer), false, false);
		while (
			this.players[this.dealer].countAllHiddenTiles() < this.dTs ||
			this.players[findRight(this.dealer)].countAllHiddenTiles() < this.nDTs ||
			this.players[findOpp(this.dealer)].countAllHiddenTiles() < this.nDTs ||
			this.players[findLeft(this.dealer)].countAllHiddenTiles() < this.nDTs
		) {
			this.buHua();
		}
		this.players.forEach((player: User) => {
			player.setHiddenTiles();
			player.sortShownTiles();
		});
		this.takenTile = true;
		this.takenBy = this.dealer;
		// TODO: remove
		if (!!this.players.find(player => player.username.toUpperCase() === 'TEST20TILESLEFT')) {
			this.tiles = this.tiles.slice(0, 20);
		}
	}

	buHua() {
		if (this.players[this.dealer].countAllHiddenTiles() < this.dTs) {
			this.giveTiles(this.dTs - this.players[this.dealer].countAllHiddenTiles(), this.dealer, true, true);
		}
		let others: number[] = [findRight(this.dealer), findOpp(this.dealer), findLeft(this.dealer)];
		others.forEach((n: number) => {
			if (this.players[n].countAllHiddenTiles() < this.nDTs) {
				this.giveTiles(this.nDTs - this.players[n].countAllHiddenTiles(), n, true, true);
			}
		});
	}

	handlePongDelay() {
		if (!isEmpty(this.lastThrown)) {
			for (let n = 0; n < this.players.length; n++) {
				if (
					n !== this.thrownBy &&
					n !== findRight(this.thrownBy) &&
					findTwoInSorted(this.lastThrown, this.players[n].hiddenTiles, 'card')
				) {
					this.delayFrom = new Date();
				}
			}
		}
	}

	nextPlayerMove() {
		this.whoseMove = findRight(this.whoseMove);
		this.takenTile = false;
		this.thrownTile = false;
		this.halfMove = false;
		this.newLog(`${this.players[this.whoseMove].username}'s turn`);
	}

	repr(): any[] {
		let res: any[];
		if (this.stage <= 4) {
			res = ['東', this.stage];
		} else if (this.stage <= 8) {
			res = ['南', ((this.stage - 1) % 4) + 1];
		} else if (this.stage <= 12) {
			res = ['西', ((this.stage - 1) % 8) + 1];
		} else if (this.stage <= 16) {
			res = ['北', ((this.stage - 1) % 12) + 1];
		}
		if (this.stage === this.prev) {
			res.push(['连']);
		}
		return res;
	}

	prepForNewRound() {
		this.midRound = true;
		this.whoseMove = this.dealer;
		this.players.forEach(player => {
			player.prepareForNewRound();
		});
		this.tiles = [];
		this.frontTiles = null;
		this.backTiles = null;
		this.lastThrown = {};
		this.thrownBy = null;
		this.thrownTile = false;
		this.takenTile = true;
		this.takenBy = this.dealer;
		this.halfMove = false;
		this.hu = [];
		this.draw = false;
		this.logs = [];
		this.flagNext = false;
	}

	initRound() {
		if (this.flagNext) {
			this.stage += 1;
		}
		if (this.stage === 1) {
			// TODO: remove
			if (!!this.players.find(player => player.username.toUpperCase() === 'TEST2ROUNDSLEFT')) {
				this.stage = 15;
				this.dealer = 2;
			} else {
				this.dealer = 0;
			}
		}
		this.newLog(`Starting round ${this.stage}${this.prev === this.stage ? ` 连` : ``}`);
		this.prepForNewRound();

		let hiddenTiles = this.generateHiddenTiles();
		let shuffledTiles = shuffle(hiddenTiles);
		for (let i = 0; i < shuffledTiles.length; i++) {
			shuffledTiles[i].ref = i;
		}
		this.tiles = shuffledTiles;
		this.distributeTiles();
		this.newLog(`${this.players[this.dealer].username}'s turn - to throw`);
	}

	/**
	 * => this.prev(stage),
	 * if game is to continue => this.midRound(false), this.stage+=1, next this.dealer
	 */
	endRound() {
		if (this.hu.length === 3) {
			let huLog: string = `${this.players[this.hu[0]].username} hu with ${this.hu[1]}台`;
			if (this.hu[2] === 1) {
				huLog += ` 自摸`;
			} else if (this.thrownBy && this.players[this.thrownBy].username !== this.players[this.hu[0]].username) {
				huLog += `, last tile thrown by ${this.players[this.thrownBy].username}`;
			}
			this.newLog(huLog);
		}
		this.midRound = false;
		this.prev = this.stage;
		if (this.dealer === 3 && this.stage === 16 && this.flagNext) {
			this.dealer = 10;
			this.newLog('Game ended');
			this.ongoing = false;
		} else if (this.flagNext) {
			this.dealer = (this.dealer + 1) % 4;
			this.newLog('Round ended');
		}
	}

	tileThrown(tile: IShownTile, player: number) {
		this.lastThrown = tile;
		this.thrownBy = player;
		this.thrownTile = true;
		this.newLog(`${this.players[player].username} discarded ${tile.card}`);
	}
}
