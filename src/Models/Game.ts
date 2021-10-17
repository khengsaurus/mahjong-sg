import { isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Animals, CardCategories, DaPai, Flowers, Suits, Winds } from '../global/enums';
import { createJwt, findLeft, findOpp, findRight, findTwoInSorted, shuffle } from '../util/utilFns';
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
	tiles?: ITile[];
	frontTiles?: number;
	backTiles?: number;
	lastThrown?: ITile;
	thrownBy?: number;
	thrownTile?: boolean;
	takenTile?: boolean;
	takenBy?: number;
	halfMove?: boolean;
	hu?: number[];
	draw?: boolean;
	logs?: ILog[];

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
		tiles?: ITile[],
		frontTiles?: number,
		backTiles?: number,
		lastThrown?: ITile,
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

	createHashedTilesRef(tiles: ITile[]): string {
		let cards = tiles.map(tile => tile.id);
		return createJwt(cards, `${this.id}-${this.stage}`);
	}

	generateShuffledTiles(): ITile[] {
		let tiles: ITile[] = [];
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
					let tile: ITile = {
						card: `${number}${suit}`,
						suit,
						number,
						index,
						isVF: false,
						id: `${CardCategories.REGULAR}${suit}${number}${index}`,
						uuid: uuidv4(),
						show: false
					};
					tiles.push(tile);
				});
			});
			winds.forEach(pai => {
				let tile: ITile = {
					card: pai,
					suit: Suits.DAPAI,
					number: 1,
					index,
					isVF: false,
					id: `${CardCategories.WINDS}${pai}${index}`,
					uuid: uuidv4(),
					show: false
				};
				tiles.push(tile);
			});
			daPai.forEach(pai => {
				let tile: ITile = {
					card: pai,
					suit: Suits.DAPAI,
					number: 1,
					index,
					isVF: false,
					id: `${CardCategories.HBF}${pai}${index}`,
					uuid: uuidv4(),
					show: false
				};
				tiles.push(tile);
			});
		});
		flowers.forEach(flower => {
			let tile: ITile = {
				card: flower,
				suit: Suits.FLOWER,
				number: 1,
				index: 1,
				isVF: false,
				id: `${CardCategories.FLOWER}${flower}`,
				uuid: uuidv4(),
				show: false
			};
			tiles.push(tile);
		});
		animals.forEach(animal => {
			let tile: ITile = {
				card: animal,
				suit: Suits.ANIMAL,
				number: 1,
				index: 1,
				isVF: true,
				id: `${CardCategories.ANIMAL}${animal}`,
				uuid: uuidv4(),
				show: false
			};
			tiles.push(tile);
		});
		this.newLog(`Generated ${tiles.length} tiles`);
		return shuffle(tiles);
	}

	giveTiles(n: number, playerIndex: number, buHua?: boolean, offsetUnused?: boolean): ITile {
		let player = this.players[playerIndex];
		let newTile: ITile;
		let receivedFlower: boolean = false;
		let log = `${player.username} ${buHua ? `bu hua, ` : ``} received `;
		let flowerReceived = '';
		let flowersReceived = ', including';
		if (!player.hiddenTiles) {
			player.hiddenTiles = [];
		}
		for (let i: number = 0; i < n; i++) {
			if (buHua) {
				newTile = this.tiles.shift();
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
				newTile = this.tiles.pop();
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
			if (newTile.suit === Suits.ANIMAL) {
				if (
					(this.players[playerIndex].shownTilesContainCard(`rooster`) &&
						this.players[playerIndex].shownTilesContainCard(`worm`)) ||
					(this.players[playerIndex].shownTilesContainCard(`cat`) &&
						this.players[playerIndex].shownTilesContainCard(`mouse`))
				) {
					this.newLog(`${this.players[playerIndex].username} drew matching animals`);
					this.flagNext = true;
				}
			} else if (newTile.suit === Suits.FLOWER && parseInt(newTile.card.slice(-1)) === playerIndex + 1) {
				newTile.isVF = true;
				if (
					this.players[playerIndex].shownTilesContainCard(`red${newTile.card.slice(-1)}`) &&
					this.players[playerIndex].shownTilesContainCard(`blue${newTile.card.slice(-1)}`)
				) {
					this.newLog(`${this.players[playerIndex].username} drew both his/her flowers`);
					this.flagNext = true;
				}
			}
			if (newTile.suit === Suits.FLOWER || newTile.suit === Suits.ANIMAL) {
				newTile.show = true;
				receivedFlower = true;
				flowerReceived = newTile.card;
				flowersReceived += ` ${newTile.card}`;
				player.shownTiles = [...player.shownTiles, newTile];
			} else {
				// player.hiddenTiles = [...player.hiddenTiles, newTile];
				player.getNewTile(newTile);
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
		return newTile;
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

		let rolled = dealer.rollDice();
		this.newLog(`${dealer.username} rolled: ${rolled}`);

		// Set front and back, and how many unused tiles each dealer has
		switch (rolled % 4) {
			case 0: // deal from left
				this.newLog(`Dealing from ${this.players[findLeft(this.dealer)].username}`);
				this.backTiles = findLeft(this.dealer);
				toBeDealtByLeft = 36 - 2 * rolled;
				leftPlayer.unusedTiles = 2 * rolled;
				toBeDealtByOpp = 53 - toBeDealtByLeft;
				if (toBeDealtByOpp > 38) {
					oppPlayer.unusedTiles = 0;
					toBeDealtByRight = toBeDealtByOpp - 38;
					rightPlayer.unusedTiles = 36 - toBeDealtByRight;
					this.frontTiles = findRight(this.dealer);
				} else {
					oppPlayer.unusedTiles = 38 - toBeDealtByOpp;
					rightPlayer.unusedTiles = 36;
					this.frontTiles = findOpp(this.dealer);
				}
				dealer.unusedTiles = 38;
				break;
			case 1: // deal from dealer
				this.newLog(`Dealing from ${this.players[this.dealer].username}`);
				this.backTiles = this.dealer;
				toBeDealtByDealer = 38 - 2 * rolled;
				dealer.unusedTiles = 2 * rolled;
				toBeDealtByLeft = 53 - toBeDealtByDealer;
				if (toBeDealtByLeft > 36) {
					leftPlayer.unusedTiles = 0;
					toBeDealtByOpp = toBeDealtByLeft - 36;
					oppPlayer.unusedTiles = 38 - toBeDealtByOpp;
					this.frontTiles = findOpp(this.dealer);
				} else {
					leftPlayer.unusedTiles = 36 - toBeDealtByLeft;
					oppPlayer.unusedTiles = 38;
					this.frontTiles = findLeft(this.dealer);
				}
				rightPlayer.unusedTiles = 36;
				break;
			case 2: // deal from right
				this.newLog(`Dealing from ${this.players[findRight(this.dealer)].username}`);
				this.backTiles = findRight(this.dealer);
				toBeDealtByRight = 36 - 2 * rolled;
				rightPlayer.unusedTiles = 2 * rolled;
				toBeDealtByDealer = 53 - toBeDealtByRight;
				if (toBeDealtByDealer > 38) {
					dealer.unusedTiles = 0;
					toBeDealtByLeft = toBeDealtByDealer - 38;
					leftPlayer.unusedTiles = 36 - toBeDealtByLeft;
					this.frontTiles = findLeft(this.dealer);
				} else {
					dealer.unusedTiles = 38 - toBeDealtByDealer;
					leftPlayer.unusedTiles = 36;
					this.frontTiles = this.dealer;
				}
				oppPlayer.unusedTiles = 38;
				break;
			case 3: // deal from opposite
				this.newLog(`Dealing from ${this.players[findOpp(this.dealer)].username}`);
				this.backTiles = findOpp(this.dealer);
				oppPlayer.unusedTiles = 2 * rolled;
				toBeDealtByOpp = 38 - 2 * rolled;
				toBeDealtByRight = 53 - toBeDealtByOpp;
				if (toBeDealtByRight > 36) {
					rightPlayer.unusedTiles = 0;
					toBeDealtByDealer = toBeDealtByRight - 36;
					dealer.unusedTiles = 38 - toBeDealtByDealer;
					this.frontTiles = this.dealer;
				} else {
					rightPlayer.unusedTiles = 36 - toBeDealtByRight;
					dealer.unusedTiles = 38;
					this.frontTiles = findRight(this.dealer);
				}
				leftPlayer.unusedTiles = 36;
				break;
		}
		this.giveTiles(14, this.dealer, false, false);
		this.giveTiles(13, findRight(this.dealer), false, false);
		this.giveTiles(13, findOpp(this.dealer), false, false);
		this.giveTiles(13, findLeft(this.dealer), false, false);
		while (
			this.players[this.dealer].countAllHiddenTiles() < 14 ||
			this.players[findRight(this.dealer)].countAllHiddenTiles() < 13 ||
			this.players[findOpp(this.dealer)].countAllHiddenTiles() < 13 ||
			this.players[findLeft(this.dealer)].countAllHiddenTiles() < 13
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
		if (this.players[this.dealer].countAllHiddenTiles() < 14) {
			this.giveTiles(14 - this.players[this.dealer].countAllHiddenTiles(), this.dealer, true, true);
		}
		let others: number[] = [findRight(this.dealer), findOpp(this.dealer), findLeft(this.dealer)];
		others.forEach((n: number) => {
			if (this.players[n].countAllHiddenTiles() < 13) {
				this.giveTiles(13 - this.players[n].countAllHiddenTiles(), n, true, true);
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
		let generatedTiles = this.generateShuffledTiles();
		this.tiles = generatedTiles;
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

	tileThrown(tile: ITile, player: number) {
		this.lastThrown = tile;
		this.thrownBy = player;
		this.thrownTile = true;
		this.newLog(`${this.players[player].username} discarded ${tile.card}`);
	}
}
