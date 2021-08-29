import { v4 as uuidv4 } from 'uuid';
import { findLeft, findOpp, findRight, playerToObj } from '../util/utilFns';
import { User } from './User';

export function gameToObj(game: Game) {
	return {
		id: game.id || '',
		creator: game.creator || '',
		createdAt: game.createdAt || new Date(),
		playersString: game.playersString || '',
		ongoing: game.ongoing || true,
		stage: game.stage || 0,
		previousStage: game.previousStage || 0,
		midRound: game.midRound || false,
		flagProgress: game.flagProgress || false,
		dealer: game.dealer || 0,
		whoseMove: game.whoseMove || 0,
		playerIds: game.playerIds || [],
		players: game.players
			? game.players.map(player => {
					return playerToObj(player);
			  })
			: [],
		tiles: game.tiles,
		frontTiles: game.frontTiles || 0,
		backTiles: game.backTiles || 0,
		lastThrown: game.lastThrown || {},
		thrownBy: game.thrownBy || 0,
		thrownTile: game.thrownTile || false,
		takenTile: game.takenTile || false,
		takenBy: game.takenBy || 0,
		uncachedAction: game.uncachedAction || false,
		hu: game.hu || [],
		draw: game.draw || false,
		logs: game.logs || []
	};
}

export class Game {
	id: string;
	creator: string;
	createdAt: Date;
	playersString?: string;
	ongoing?: boolean;
	stage?: number;
	previousStage?: number;
	midRound?: boolean;
	flagProgress?: boolean;
	dealer?: number;
	whoseMove?: number;
	playerIds?: string[];
	players?: User[];
	tiles?: TileI[];
	frontTiles?: number;
	backTiles?: number;
	lastThrown?: TileI;
	thrownBy?: number;
	thrownTile?: boolean;
	takenTile?: boolean;
	takenBy?: number;
	uncachedAction?: boolean;
	hu?: number[];
	draw?: boolean;
	logs?: Log[];

	constructor(
		id: string,
		creator?: string,
		createdAt?: Date,
		playersString?: string,
		ongoing?: boolean,
		stage?: number,
		previousStage?: number,
		dealer?: number,
		midRound?: boolean,
		flagProgress?: boolean,
		whoseMove?: number,
		playerIds?: string[],
		players?: User[],
		tiles?: TileI[],
		frontTiles?: number,
		backTiles?: number,
		lastThrown?: TileI,
		thrownBy?: number,
		thrownTile?: boolean,
		takenTile?: boolean,
		takenBy?: number,
		uncachedAction?: boolean,
		hu?: number[],
		draw?: boolean,
		logs?: Log[]
	) {
		this.id = id;
		this.creator = creator;
		this.createdAt = createdAt;
		this.playersString = playersString;
		this.ongoing = ongoing;
		this.stage = stage;
		this.previousStage = previousStage;
		this.dealer = dealer;
		this.midRound = midRound;
		this.flagProgress = flagProgress;
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
		this.uncachedAction = uncachedAction;
		this.hu = hu;
		this.draw = draw;
		this.logs = logs;
	}

	newLog(log: string) {
		let newLog = { msg: log, timeStamp: new Date() };
		this.logs = [...this.logs, newLog];
		if (this.logs.length >= 20) {
			this.logs = this.logs.slice(-15);
		}
	}

	shuffle(array: any[]) {
		this.newLog('Shuffling tiles');
		// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		var currentIndex = array.length,
			randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}
		return array;
	}

	generateShuffledTiles(): TileI[] {
		let tiles: TileI[] = [];
		const oneToFour = [1, 2, 3, 4];
		const oneToNine = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		const suits = ['万', '筒', '索'];
		const winds = ['東', '南', '西', '北'];
		const daPai = ['红中', '白板', '发财'];
		const animals = ['cat', 'mouse', 'rooster', 'worm'];
		const flowers = ['red1', 'red2', 'red3', 'red4', 'blue1', 'blue2', 'blue3', 'blue4'];

		oneToFour.forEach(index => {
			suits.forEach(suit => {
				oneToNine.forEach(number => {
					let tile: TileI = {
						card: `${number}${suit}`,
						suit,
						number,
						index,
						isValidFlower: false,
						id: `a${suit}${number}${index}`,
						uuid: uuidv4(),
						show: false
					};
					tiles.push(tile);
				});
			});
			winds.forEach(pai => {
				let tile: TileI = {
					card: pai,
					suit: '大牌',
					number: 1,
					index,
					isValidFlower: false,
					id: `b${pai}${index}`,
					uuid: uuidv4(),
					show: false
				};
				tiles.push(tile);
			});
			daPai.forEach(pai => {
				let tile: TileI = {
					card: pai,
					suit: '大牌',
					number: 1,
					index,
					isValidFlower: false,
					id: `c${pai}${index}`,
					uuid: uuidv4(),
					show: false
				};
				tiles.push(tile);
			});
		});
		flowers.forEach(flower => {
			let tile: TileI = {
				card: flower,
				suit: '花',
				number: 1,
				index: 1,
				isValidFlower: false,
				id: `y${flower}`,
				uuid: uuidv4(),
				show: false
			};
			tiles.push(tile);
		});

		animals.forEach(animal => {
			let tile: TileI = {
				card: animal,
				suit: '动物',
				number: 1,
				index: 1,
				isValidFlower: true,
				id: `z${animal}`,
				uuid: uuidv4(),
				show: false
			};
			tiles.push(tile);
		});
		this.newLog(`Generated ${tiles.length} tiles`);
		return this.shuffle(tiles);
	}

	giveTiles(n: number, playerIndex: number, buHua?: boolean, offsetUnused?: boolean): TileI {
		let player = this.players[playerIndex];
		let newTile: TileI;
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
			if (newTile.suit === '动物') {
				if (
					(this.players[playerIndex].shownTilesContainCard(`rooster`) &&
						this.players[playerIndex].shownTilesContainCard(`worm`)) ||
					(this.players[playerIndex].shownTilesContainCard(`cat`) &&
						this.players[playerIndex].shownTilesContainCard(`mouse`))
				) {
					this.newLog(`${this.players[playerIndex].username} drew matching animals`);
					this.flagProgress = true;
				}
			} else if (newTile.suit === '花' && parseInt(newTile.card.slice(-1)) === playerIndex + 1) {
				newTile.isValidFlower = true;
				if (
					this.players[playerIndex].shownTilesContainCard(`red${newTile.card.slice(-1)}`) &&
					this.players[playerIndex].shownTilesContainCard(`blue${newTile.card.slice(-1)}`)
				) {
					this.newLog(`${this.players[playerIndex].username} drew both his/her flowers`);
					this.flagProgress = true;
				}
			}
			if (newTile.suit === '花' || newTile.suit === '动物') {
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
		if (this.players[0].username === 'test20Left') {
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

	nextPlayerMove() {
		this.whoseMove = findRight(this.whoseMove);
		this.takenTile = false;
		this.thrownTile = false;
		this.uncachedAction = false;
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
		if (this.stage === this.previousStage) {
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
		this.uncachedAction = false;
		this.hu = [];
		this.draw = false;
		this.logs = [];
		this.flagProgress = false;
	}

	initRound() {
		if (this.flagProgress) {
			this.stage += 1;
		}
		if (this.stage === 1) {
			this.dealer = 0;
		}
		this.newLog(`Starting round ${this.stage}${this.previousStage === this.stage ? ` 连` : ``}`);
		this.prepForNewRound();
		this.tiles = this.generateShuffledTiles();
		this.distributeTiles();
		this.newLog(`${this.players[this.dealer].username}'s turn - to throw`);
	}

	/**
	 * => this.previousStage(stage),
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
		this.previousStage = this.stage;
		if (this.dealer === 3 && this.stage === 16 && this.flagProgress) {
			this.dealer = 10;
			this.newLog('Game ended');
			this.ongoing = false;
		} else if (this.flagProgress) {
			this.dealer = (this.dealer + 1) % 4;
			this.newLog('Round ended');
		}
	}

	tileThrown(tile: TileI, player: number) {
		this.lastThrown = tile;
		this.thrownBy = player;
		this.thrownTile = true;
		this.newLog(`${this.players[player].username} discarded ${tile.card}`);
	}
}
