import { User } from './User';

export function gameToObj(game: Game) {
	return {
		id: game.id,
		stage: game.stage || null,
		// isSet: game.isSet || false,
		ongoing: game.ongoing || null,
		players: game.players || null,
		playerIds: game.playerIds || null,
		playersString: game.playersString || null,
		player1: game.player1 || null,
		player2: game.player2 || null,
		player3: game.player3 || null,
		player4: game.player4 || null,
		tiles: game.tiles || null,
		createdAt: game.createdAt || null
	};
}

export class Game {
	id: string;
	stage?: number;
	ongoing: boolean;
	players?: User[];
	playerIds?: string[];
	playersString?: string;
	player1?: User;
	player2?: User;
	player3?: User;
	player4?: User;
	tiles?: Tile[];
	whoseMove?: 1 | 2 | 3 | 4;
	createdAt: Date;

	constructor(
		id: string,
		players?: User[],
		playerIds?: string[],
		playersString?: string,
		stage?: number,
		ongoing?: boolean,
		tiles?: Tile[],
		whoseMove?: 1 | 2 | 3 | 4,
		createdAt?: Date
	) {
		this.id = id;
		this.players = players;
		this.playerIds = playerIds;
		this.playersString = playersString;
		this.stage = stage || 0;
		this.ongoing = ongoing || true;
		this.tiles = tiles;
		this.whoseMove = whoseMove;
		this.createdAt = createdAt;
	}

	// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	shuffle(array: any[]) {
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

	// export function assignUserSeats(newGame:Game):Game {
	// 	game.1 = game.players[0];
	// 	game.2 = game.players[1];
	// 	return game
	// }

	generateShuffledTiles(): Tile[] {
		let tiles: Tile[] = [];
		const oneToFour = [1, 2, 3, 4];
		const oneToNine = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		const suits = ['万', '筒', '索'];
		const daPai = ['东', '南', '西', '北', '红中', '白般', '发财'];
		oneToFour.forEach(index => {
			suits.forEach(suit => {
				oneToNine.forEach(number => {
					let tile: Tile = { card: `${number}${suit}`, index, show: false };
					tiles.push(tile);
				});
			});
			daPai.forEach(pai => {
				let tile: Tile = { card: pai, index, show: false };
				tiles.push(tile);
			});
		});
		console.log(`Generated ${tiles.length} tiles`);
		return this.shuffle(tiles);
	}

	giveTiles(tiles: Tile[], n: number, player: User) {
		for (let i: number = 1; i <= n; i++) {
			player.tiles = [...player.tiles, tiles.pop()];
		}
	}

	distributeTiles(game: Game): Game {
		const { tiles, player1, player2, player3, player4 } = game;
		this.giveTiles(tiles, 4, player1);
		this.giveTiles(tiles, 4, player2);
		this.giveTiles(tiles, 4, player3);
		this.giveTiles(tiles, 4, player4);
		this.giveTiles(tiles, 4, player1);
		this.giveTiles(tiles, 4, player2);
		this.giveTiles(tiles, 4, player3);
		this.giveTiles(tiles, 4, player4);
		this.giveTiles(tiles, 4, player1);
		this.giveTiles(tiles, 4, player2);
		this.giveTiles(tiles, 4, player3);
		this.giveTiles(tiles, 4, player4);
		this.giveTiles(tiles, 1, player1);
		this.giveTiles(tiles, 1, player2);
		this.giveTiles(tiles, 1, player3);
		this.giveTiles(tiles, 1, player4);
		this.giveTiles(tiles, 1, player1);
		console.log('Player 1 no. tiles: ', player1.tiles.length);
		console.log('Player 2 no. tiles: ', player2.tiles.length);
		console.log('Tiles left: ', tiles.length);
		return game;
	}

	initRound(game: Game): Game {
		game.stage += 1;
		game.tiles = this.generateShuffledTiles();
		this.distributeTiles(game);
		// Update game doc
		// Update user doc x4
		return game;
	}
}
