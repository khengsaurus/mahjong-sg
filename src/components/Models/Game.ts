import { tileToObj, userToObj } from '../../util/utilFns';
import { User } from './User';

export function gameToObj(game: Game) {
	return {
		id: game.id,
		createdAt: game.createdAt || null,
		stage: game.stage || null,
		ongoing: game.ongoing || null,
		dealer: game.dealer ? userToObj(game.dealer) : null,
		midRound: game.midRound || null,
		whoseMove: game.whoseMove || null,
		playerIds: game.playerIds || [],
		playersString: game.playersString || null,
		player1: game.player1 ? userToObj(game.player1) : null,
		player2: game.player2 ? userToObj(game.player2) : null,
		player3: game.player3 ? userToObj(game.player3) : null,
		player4: game.player4 ? userToObj(game.player4) : null,
		players: game.players
			? game.players.map(player => {
					return userToObj(player);
			  })
			: [],
		tiles: game.tiles
			? game.tiles.map(tile => {
					return tileToObj(tile);
			  })
			: [],
		lastThrown: game.lastThrown ? tileToObj(game.lastThrown) : null,
		thrownBy: game.thrownBy || null
	};
}

export class Game {
	id: string;
	createdAt: Date;
	stage?: number;
	ongoing: boolean;
	dealer: User;
	midRound: boolean;
	whoseMove?: 1 | 2 | 3 | 4;
	playerIds?: string[];
	playersString?: string;
	player1?: User;
	player2?: User;
	player3?: User;
	player4?: User;
	players?: User[];
	tiles?: Tile[];
	lastThrown?: Tile;
	thrownBy?: number;
	// userBal?: number[];

	constructor(
		id: string,
		createdAt?: Date,
		stage?: number,
		ongoing?: boolean,
		dealer?: User,
		midRound?: boolean,
		whoseMove?: 1 | 2 | 3 | 4,
		playerIds?: string[],
		playersString?: string,
		player1?: User,
		player2?: User,
		player3?: User,
		player4?: User,
		players?: User[],
		tiles?: Tile[],
		lastThrown?: Tile,
		thrownBy?: number
		// userBal?: number[]
	) {
		this.id = id;
		this.createdAt = createdAt;
		this.stage = stage || 0;
		this.ongoing = ongoing || true;
		this.dealer = dealer || null;
		this.midRound = midRound || true; // if false by default may cause initRound
		this.whoseMove = whoseMove || null;
		this.playerIds = playerIds || [];
		this.playersString = playersString || '';
		this.player1 = player1 || null;
		this.player2 = player2 || null;
		this.player3 = player3 || null;
		this.player4 = player4 || null;
		this.players = players || [];
		this.tiles = tiles || [];
		this.lastThrown = lastThrown || null;
		this.thrownBy = thrownBy || null;
		// this.userBal = userBal || [];
	}

	// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	async shuffle(array: any[]) {
		var currentIndex = array.length,
			randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			// And swap it with the current element.
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
			const hua = [
				'cat',
				'mouse',
				'rooster',
				'worm',
				'red1',
				'red2',
				'red3',
				'red4',
				'blue1',
				'blue2',
				'blue3',
				'blue4'
			];
			oneToFour.forEach(index => {
				suits.forEach(suit => {
					oneToNine.forEach(number => {
						let tile: Tile = {
							card: `${number}${suit}`,
							suit,
							number,
							index,
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
						id: `${pai}${index}`,
						show: false
					};
					tiles.push(tile);
				});
			});
			hua.forEach(flower => {
				let tile: Tile = {
					card: flower,
					suit: '花',
					number: 1,
					index: 1,
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

	async giveTiles(tiles: Tile[], n: number, player: User) {
		if (!player.hiddenTiles) {
			player.hiddenTiles = [];
		}
		if (player.username === 'user1') {
			console.log(player);
			console.log(tiles.length);
		}
		for (let i: number = 0; i < n; i++) {
			player.hiddenTiles = [...player.hiddenTiles, tiles.pop()];
		}
		return { tiles, player };
	}

	async assignPlayers() {
		this.player1 = this.players[0];
		this.player2 = this.players[1];
		this.player3 = this.players[2];
		this.player4 = this.players[3];
		console.log('Players assigned');
		console.log('Player 1', this.player1.username);
		console.log('Player 2', this.player2.username);
		console.log('Player 3', this.player3.username);
		console.log('Player 4', this.player4.username);
	}

	async distributeTiles() {
		console.log('Distrubute tiles called');
		await this.giveTiles(this.tiles, 14, this.player1).then(res => {
			this.tiles = res.tiles;
			this.player1 = res.player;
		});
		console.log(`Player 1 received ${this.player1.hiddenTiles.length} tiles`);
		// this.player1.tiles.forEach(tile => {
		// 	console.log(tile.card);
		// });
		await this.giveTiles(this.tiles, 13, this.player2).then(res => {
			this.tiles = res.tiles;
			this.player2 = res.player;
		});
		console.log(`Player 2 received ${this.player2.hiddenTiles.length} tiles`);
		await this.giveTiles(this.tiles, 13, this.player3).then(res => {
			this.tiles = res.tiles;
			this.player3 = res.player;
		});
		console.log(`Player 3 received ${this.player3.hiddenTiles.length} tiles`);
		await this.giveTiles(this.tiles, 13, this.player4).then(res => {
			this.tiles = res.tiles;
			this.player4 = res.player;
		});
		console.log(`Player 4 received ${this.player4.hiddenTiles.length} tiles`);
		console.log('Tiles left: ', this.tiles.length);
	}

	async startGame() {
		if (this.stage === 0) {
			this.stage += 1;
		}
		if (!this.player1) {
			await this.assignPlayers();
		}
	}

	async initRound() {
		if (this.stage === 0 || !this.player1) {
			await this.startGame();
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
		console.log('Round initialised');
	}
}
