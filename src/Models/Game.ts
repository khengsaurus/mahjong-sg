import { sortTiles, userToObj } from '../util/utilFns';
import { User } from './User';

export function gameToObj(game: Game) {
	return {
		id: game.id,
		creator: game.creator,
		createdAt: game.createdAt,
		stage: game.stage,
		ongoing: game.ongoing,
		midRound: game.midRound,
		flagProgress: game.flagProgress,
		dealer: game.dealer,
		whoseMove: game.whoseMove,
		playerIds: game.playerIds,
		playersString: game.playersString,
		players: game.players
			? game.players.map(player => {
					return userToObj(player);
			  })
			: [],
		tiles: game.tiles,
		frontTiles: game.frontTiles,
		backTiles: game.backTiles,
		lastThrown: game.lastThrown,
		thrownBy: game.thrownBy
	};
}

export class Game {
	id: string;
	creator: string;
	createdAt: Date;
	stage?: number;
	ongoing: boolean;
	midRound: boolean;
	flagProgress: boolean;
	dealer: 0 | 1 | 2 | 3;
	whoseMove?: 0 | 1 | 2 | 3;
	playerIds?: string[];
	playersString?: string;
	players?: User[];
	tiles?: Tile[];
	frontTiles?: number;
	backTiles?: number;
	lastThrown?: Tile;
	thrownBy?: number;

	constructor(
		id: string,
		creator?: string,
		createdAt?: Date,
		stage?: number,
		ongoing?: boolean,
		dealer?: 0 | 1 | 2 | 3,
		midRound?: boolean,
		flagProgress?: boolean,
		whoseMove?: 0 | 1 | 2 | 3,
		playerIds?: string[],
		playersString?: string,
		players?: User[],
		tiles?: Tile[],
		frontTiles?: number,
		backTiles?: number,
		lastThrown?: Tile,
		thrownBy?: number
	) {
		this.id = id;
		this.creator = creator;
		this.createdAt = createdAt;
		this.stage = stage;
		this.ongoing = ongoing;
		this.dealer = dealer;
		this.midRound = midRound;
		this.flagProgress = flagProgress;
		this.whoseMove = whoseMove;
		this.playerIds = playerIds;
		this.playersString = playersString;
		this.players = players;
		this.tiles = tiles;
		this.frontTiles = frontTiles;
		this.backTiles = backTiles;
		this.lastThrown = lastThrown;
		this.thrownBy = thrownBy;
	}

	// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	async shuffle(array: any[]) {
		var currentIndex = array.length,
			randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}
		return array;
	}

	async generateShuffledTiles(): Promise<Tile[]> {
		return new Promise(async (resolve, reject) => {
			let tiles: Tile[] = [];
			const oneToFour = [1, 2, 3, 4];
			const oneToNine = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			const suits = ['万', '筒', '索'];
			const winds = ['东', '南', '西', '北'];
			const daPai = ['红中', '白板', '发财'];
			const animals = ['cat', 'mouse', 'rooster', 'worm'];
			const flowers = ['red1', 'red2', 'red3', 'red4', 'blue1', 'blue2', 'blue3', 'blue4'];

			oneToFour.forEach(index => {
				suits.forEach(suit => {
					oneToNine.forEach(number => {
						let tile: Tile = {
							card: `${number}${suit}`,
							suit,
							number,
							index,
							isValidFlower: false,
							id: `a${suit}${number}${index}`,
							show: false
						};
						tiles.push(tile);
					});
				});
				winds.forEach(pai => {
					let tile: Tile = {
						card: pai,
						suit: '大牌',
						number: 1,
						index,
						isValidFlower: false,
						id: `b${pai}${index}`,
						show: false
					};
					tiles.push(tile);
				});
				daPai.forEach(pai => {
					let tile: Tile = {
						card: pai,
						suit: '大牌',
						number: 1,
						index,
						isValidFlower: false,
						id: `c${pai}${index}`,
						show: false
					};
					tiles.push(tile);
				});
			});
			flowers.forEach(flower => {
				let tile: Tile = {
					card: flower,
					suit: '花',
					number: 1,
					index: 1,
					isValidFlower: false,
					id: `y${flower}`,
					show: false
				};
				tiles.push(tile);
			});

			animals.forEach(animal => {
				let tile: Tile = {
					card: animal,
					suit: '动物',
					number: 1,
					index: 1,
					isValidFlower: true,
					id: `z${animal}`,
					show: false
				};
				tiles.push(tile);
			});
			console.log(`Generated ${tiles.length} tiles`);
			if (tiles.length === 148) {
				resolve(await this.shuffle(tiles));
			} else {
				reject(new Error('Tiles not generated'));
			}
		});
	}

	async giveTiles(n: number, playerIndex: number, buHua?: boolean, offsetUnused?: boolean) {
		let player = this.players[playerIndex];
		if (!player.hiddenTiles) {
			player.hiddenTiles = [];
		}
		for (let i: number = 0; i < n; i++) {
			let newTile: Tile;
			if (buHua) {
				newTile = this.tiles.shift();
				// Logic to update shortening stack of back(hua) tiles
				if (offsetUnused) {
					if (this.players[this.backTiles].unusedTiles === 1) {
						this.players[this.backTiles].unusedTiles = 0;
						if (this.backTiles === 3) {
							this.backTiles = 0;
						} else {
							this.backTiles += 1;
						}
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
						if (this.frontTiles === 0) {
							this.frontTiles = 3;
						} else {
							this.frontTiles -= 1;
						}
					} else {
						this.players[this.frontTiles].unusedTiles -= 1;
					}
				}
			}
			if (newTile.suit === '花' && parseInt(newTile.card.slice(-1)) === playerIndex + 1) {
				newTile.isValidFlower = true;
			}
			if (newTile.suit === '花' || newTile.suit === '动物') {
				player.shownTiles = [...player.shownTiles, newTile];
			} else {
				player.hiddenTiles = [...player.hiddenTiles, newTile];
			}
		}
		console.log(`${player.username} received ${n} tile(s)`);
	}

	async assignSeats() {
		this.players[0].currentSeat = 0;
		this.players[1].currentSeat = 1;
		this.players[2].currentSeat = 2;
		this.players[3].currentSeat = 3;
		console.log('Players assigned');
		console.log('Player 1: ', this.players[0].username);
		console.log('Player 2: ', this.players[1].username);
		console.log('Player 3: ', this.players[2].username);
		console.log('Player 4: ', this.players[3].username);
	}

	findLeft(n: number) {
		if (n === 0) {
			return 3;
		} else {
			return n - 1;
		}
	}

	findRight(n: number) {
		if (n === 3) {
			return 0;
		} else {
			return n + 1;
		}
	}

	findOpp(n: number) {
		switch (n) {
			case 0:
				return 2;
			case 1:
				return 3;
			case 2:
				return 0;
			case 3:
				return 1;
			default:
				break;
		}
	}

	// Too tired to think of a better way to do this
	async distributeTiles() {
		let dealer = this.players[this.dealer];
		let rolled = dealer.rollDice();
		console.log(rolled);
		let leftPlayer = this.players[this.findLeft(this.dealer)];
		let rightPlayer = this.players[this.findRight(this.dealer)];
		let oppPlayer = this.players[this.findOpp(this.dealer)];
		let toBeDealtByLeft: number;
		let toBeDealtByDealer: number;
		let toBeDealtByRight: number;
		let toBeDealtByOpp: number;

		switch (rolled % 4) {
			case 0: // deal from left
				console.log('Dealing from left');
				this.backTiles = this.findLeft(this.dealer);
				toBeDealtByLeft = 36 - 2 * rolled;
				leftPlayer.unusedTiles = 2 * rolled;
				toBeDealtByOpp = 53 - toBeDealtByLeft;
				if (toBeDealtByOpp > 38) {
					oppPlayer.unusedTiles = 0;
					toBeDealtByRight = toBeDealtByOpp - 38;
					rightPlayer.unusedTiles = 36 - toBeDealtByRight;
					this.frontTiles = this.findRight(this.dealer);
				} else {
					oppPlayer.unusedTiles = 38 - toBeDealtByOpp;
					rightPlayer.unusedTiles = 36;
					this.frontTiles = this.findOpp(this.dealer);
				}
				dealer.unusedTiles = 38;
				break;
			case 1: // deal from dealer
				console.log('Dealing from dealer');
				this.backTiles = this.dealer;
				toBeDealtByDealer = 38 - 2 * rolled;
				dealer.unusedTiles = 2 * rolled;
				toBeDealtByLeft = 53 - toBeDealtByDealer;
				if (toBeDealtByLeft > 36) {
					leftPlayer.unusedTiles = 0;
					toBeDealtByOpp = toBeDealtByLeft - 36;
					oppPlayer.unusedTiles = 38 - toBeDealtByOpp;
					this.frontTiles = this.findOpp(this.dealer);
				} else {
					leftPlayer.unusedTiles = 36 - toBeDealtByLeft;
					oppPlayer.unusedTiles = 38;
					this.frontTiles = this.findLeft(this.dealer);
				}
				rightPlayer.unusedTiles = 36;
				break;
			case 2: // deal from right
				console.log('Dealing from right');
				this.backTiles = this.findRight(this.dealer);
				toBeDealtByRight = 36 - 2 * rolled;
				rightPlayer.unusedTiles = 2 * rolled;
				toBeDealtByDealer = 53 - toBeDealtByRight;
				if (toBeDealtByDealer > 38) {
					dealer.unusedTiles = 0;
					toBeDealtByLeft = toBeDealtByDealer - 38;
					leftPlayer.unusedTiles = 36 - toBeDealtByLeft;
					this.frontTiles = this.findLeft(this.dealer);
				} else {
					dealer.unusedTiles = 38 - toBeDealtByDealer;
					leftPlayer.unusedTiles = 36;
					this.frontTiles = this.dealer;
				}
				oppPlayer.unusedTiles = 38;
				break;
			case 3: // deal from opposite
				console.log('Dealing from opposite');
				this.backTiles = this.findOpp(this.dealer);
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
					this.frontTiles = this.findRight(this.dealer);
				}
				leftPlayer.unusedTiles = 36;
				break;
		}

		console.log('front:', this.frontTiles);
		console.log('back:', this.backTiles);
		console.log(this.players[0].unusedTiles);
		console.log(this.players[1].unusedTiles);
		console.log(this.players[2].unusedTiles);
		console.log(this.players[3].unusedTiles);

		console.log('Distrubite tiles called');
		await this.giveTiles(14, 0, false, false);
		await this.giveTiles(13, 1, false, false);
		await this.giveTiles(13, 2, false, false);
		await this.giveTiles(13, 3, false, false);
		while (
			this.players[0].hiddenTiles.length < 14 ||
			this.players[1].hiddenTiles.length < 13 ||
			this.players[2].hiddenTiles.length < 13 ||
			this.players[3].hiddenTiles.length < 13
		) {
			this.buHua();
		}
		this.players.forEach((player: User) => {
			player.hiddenTiles = sortTiles(player.hiddenTiles);
			player.shownTiles = sortTiles(player.shownTiles);
		});

		console.log('front:', this.frontTiles);
		console.log('back:', this.backTiles);
		console.log(this.players[0].unusedTiles);
		console.log(this.players[1].unusedTiles);
		console.log(this.players[2].unusedTiles);
		console.log(this.players[3].unusedTiles);
	}

	async buHua() {
		if (this.players[0].hiddenTiles.length < 14) {
			this.giveTiles(this.players[0].shownTiles.length, 0, true, true);
		}
		if (this.players[1].hiddenTiles.length < 13) {
			this.giveTiles(this.players[1].shownTiles.length, 1, true, true);
		}
		if (this.players[2].hiddenTiles.length < 13) {
			this.giveTiles(this.players[2].shownTiles.length, 2, true, true);
		}
		if (this.players[3].hiddenTiles.length < 13) {
			this.giveTiles(this.players[3].shownTiles.length, 3, true, true);
		}
	}

	async initRound(flagNextRound: boolean) {
		console.log('initRound called');
		this.midRound = true;
		if (this.stage === 0) {
			this.dealer = 0;
			this.whoseMove = 0;
			await this.assignSeats();
			console.log('Starting game');
		}
		await this.generateShuffledTiles()
			.then(generatedTiles => {
				this.tiles = generatedTiles;
			})
			.catch(err => {
				// if(err.message === 'Tiles not generated'){
				// 	this.generateShuffledTiles()
				// }
			});
		await this.distributeTiles();
		if (flagNextRound) {
			this.stage += 1;
		}
		console.log('Round started');
	}

	nextPlayerMove() {
		if (this.whoseMove === 3) {
			this.whoseMove = 0;
		} else {
			this.whoseMove += 1;
		}
	}

	rotateWinds() {
		console.log('Rotating winds');
		this.players.forEach(player => {
			if (player.currentSeat === 3) {
				player.currentSeat = 0;
			} else {
				player.currentSeat += 1;
			}
		});
		this.players.forEach(player => {
			console.log(`${player.username}'s current seat: ${player.currentSeat}`);
		});
	}

	async endRound(): Promise<boolean> {
		// -> to continue
		return new Promise((resolve, reject) => {
			this.midRound = false;
			if (this.flagProgress) {
				if (this.dealer === 3 && this.stage === 16 && this.flagProgress) {
					console.log('Game ended');
					resolve(false);
				} else {
					switch (this.dealer) {
						case 0:
							this.dealer = 1;
							break;
						case 1:
							this.dealer = 2;
							break;
						case 2:
							this.dealer = 3;
							break;
						case 3:
							if (this.stage < 16) {
								this.dealer = 0;
							}
							break;
						default:
							break;
					}
					this.rotateWinds();
					this.initRound(true);
				}
			} else {
				this.initRound(false);
			}
			resolve(true);
		});
	}
}
