import { tileToObj, userToObj } from '../../util/utilFns';
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
		// player1: game.player1 ? userToObj(game.player1) : null,
		// player2: game.player2 ? userToObj(game.player2) : null,
		// player3: game.player3 ? userToObj(game.player3) : null,
		// player4: game.player4 ? userToObj(game.player4) : null,
		players: game.players
			? game.players.map(player => {
					return userToObj(player);
			  })
			: [],
		// tiles: game.tiles
		// 	? game.tiles.map(tile => {
		// 			return tileToObj(tile);
		// 	  })
		// 	: [],
		tiles: game.tiles,
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
	dealer: 0 | 1 | 2 | 3 | 4;
	whoseMove?: 0 | 1 | 2 | 3 | 4;
	playerIds?: string[];
	playersString?: string;
	// player1?: User;
	// player2?: User;
	// player3?: User;
	// player4?: User;
	players?: User[];
	tiles?: Tile[];
	lastThrown?: Tile;
	thrownBy?: number;

	constructor(
		id: string,
		creator?: string,
		createdAt?: Date,
		stage?: number,
		ongoing?: boolean,
		dealer?: 0 | 1 | 2 | 3 | 4,
		midRound?: boolean,
		flagProgress?: boolean,
		whoseMove?: 0 | 1 | 2 | 3 | 4,
		playerIds?: string[],
		playersString?: string,
		players?: User[],
		tiles?: Tile[],
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
		this.lastThrown = lastThrown;
		this.thrownBy = thrownBy;
		// this.userBal = userBal
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
			const daPai = ['东', '南', '西', '北', '红中', '白般', '发财'];
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
							id: `${number}${suit}${index}`,
							show: false
						};
						tiles.push(tile);
					});
				});
				daPai.forEach(pai => {
					let tile: Tile = {
						card: pai,
						suit: '大牌',
						number: 1,
						index,
						isValidFlower: false,
						id: `${pai}${index}`,
						show: false
					};
					tiles.push(tile);
				});
			});
			animals.forEach(animal => {
				let tile: Tile = {
					card: animal,
					suit: '动物',
					number: 1,
					index: 1,
					isValidFlower: true,
					id: `${animal}`,
					show: false
				};
				tiles.push(tile);
			});
			flowers.forEach(flower => {
				let tile: Tile = {
					card: flower,
					suit: '花',
					number: 1,
					index: 1,
					isValidFlower: false,
					id: `${flower}`,
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

	async giveTiles(n: number, playerIndex: number, buHua?: boolean) {
		let player = this.players[playerIndex];
		if (!player.hiddenTiles) {
			player.hiddenTiles = [];
		}
		for (let i: number = 0; i < n; i++) {
			let newTile: Tile;
			if (buHua) {
				newTile = this.tiles.shift();
			} else {
				newTile = this.tiles.pop();
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
	}

	async assignSeats() {
		this.players[0].currentSeat = 1;
		this.players[1].currentSeat = 2;
		this.players[2].currentSeat = 3;
		this.players[3].currentSeat = 4;
		console.log('Players assigned');
		console.log('Player 1: ', this.players[0].username);
		console.log('Player 2: ', this.players[0].username);
		console.log('Player 3: ', this.players[1].username);
		console.log('Player 4: ', this.players[2].username);
	}

	async distributeTiles() {
		console.log('Distrubute tiles called');
		await this.giveTiles(14, 0);
		await this.giveTiles(13, 1);
		await this.giveTiles(13, 2);
		await this.giveTiles(13, 3);
		while (
			this.players[0].hiddenTiles.length < 14 ||
			this.players[1].hiddenTiles.length < 13 ||
			this.players[2].hiddenTiles.length < 13 ||
			this.players[3].hiddenTiles.length < 13
		) {
			this.buHua();
		}
		// LOGGING
		console.log(`Player 1 has ${this.players[0].hiddenTiles.length} tiles`);
		if (this.players[0].shownTiles.length > 0) {
			console.log(`Player 1 has ${this.players[0].shownTiles.length} flowers: `);
			this.players[0].shownTiles.forEach(hua => {
				console.log(hua.card);
			});
		}
		console.log(`Player 2 has ${this.players[1].hiddenTiles.length} tiles`);
		if (this.players[1].shownTiles.length > 0) {
			console.log(`Player 2 has ${this.players[1].shownTiles.length} flowers: `);
			this.players[1].shownTiles.forEach(hua => {
				console.log(hua.card);
			});
		}
		console.log(`Player 3 has ${this.players[2].hiddenTiles.length} tiles`);
		if (this.players[2].shownTiles.length > 0) {
			console.log(`Player 3 has ${this.players[2].shownTiles.length} flowers: `);
			this.players[2].shownTiles.forEach(hua => {
				console.log(hua.card);
			});
		}
		console.log(`Player 4 has ${this.players[3].hiddenTiles.length} tiles`);
		if (this.players[3].shownTiles.length > 0) {
			console.log(`Player 4 has ${this.players[3].shownTiles.length} flowers: `);
			this.players[3].shownTiles.forEach(hua => {
				console.log(hua.card);
			});
		}
		console.log('Tiles left: ', this.tiles.length);
	}

	async buHua() {
		if (this.players[0].hiddenTiles.length < 14) {
			this.giveTiles(this.players[0].shownTiles.length, 0, true);
		}
		if (this.players[1].hiddenTiles.length < 13) {
			this.giveTiles(this.players[1].shownTiles.length, 1, true);
		}
		if (this.players[2].hiddenTiles.length < 13) {
			this.giveTiles(this.players[2].shownTiles.length, 2, true);
		}
		if (this.players[3].hiddenTiles.length < 13) {
			this.giveTiles(this.players[3].shownTiles.length, 3, true);
		}
	}

	async initRound(flagNextRound: boolean) {
		console.log('initRound called');
		this.midRound = true;
		if (this.stage === 0 || !this.dealer) {
			this.dealer = 1;
			this.whoseMove = 1;
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

	rotateWinds() {
		console.log('Rotating winds');
		this.players.forEach(player => {
			if (player.currentSeat < 4) {
				player.currentSeat += 1;
			} else if (player.currentSeat === 4) {
				player.currentSeat = 1;
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
				if (this.dealer === 4 && this.stage === 16 && this.flagProgress) {
					console.log('Game ended');
					resolve(false);
				} else {
					switch (this.dealer) {
						case 1:
							this.dealer = 2;
							break;
						case 2:
							this.dealer = 3;
							break;
						case 3:
							this.dealer = 4;
							break;
						case 4:
							if (this.stage < 16) {
								this.dealer = 1;
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
