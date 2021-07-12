import { User } from './User';

export class Game {
	id: string;
	stage?: number;
	ongoing: boolean;
	players?: User[];
	player1?: User;
	player2?: User;
	player3?: User;
	player4?: User;
	tiles?: Tile[];

	constructor(id: string, players?: User[], stage?: number, ongoing?: boolean, tiles?: Tile[]) {
		this.id = id;
		this.players = players;
		this.stage = stage || 0;
		this.ongoing = ongoing || true;
		this.tiles = tiles;
	}
}

export function gameToObj(game: Game) {
	return {
		id: game.id,
		stage: game.stage || null,
		// isSet: game.isSet || false,
		ongoing: game.ongoing || null,
		players: game.players || null,
		player1: game.player1 || null,
		player2: game.player2 || null,
		player3: game.player3 || null,
		player4: game.player4 || null,
		tiles: game.tiles || null
	};
}
// interface Game {
// 	id: string;
// 	// stage?: Stage;
// 	stage: number;
// 	ongoing: boolean;
// 	players?: User[];
// 	player1?: User;
// 	player2?: User;
// 	player3?: User;
// 	player4?: User;
// 	tiles?: Tile[];
// }
