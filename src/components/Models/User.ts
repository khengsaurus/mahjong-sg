export class User {
	id: string;
	username: string;
	photoUrl: string;
	currentGameId?: string;
	currentSeat?: number;
	tiles: Tile[] | null;

	constructor(id: string, username: string, photoUrl: string, tiles?: Tile[]) {
		this.id = id;
		this.username = username;
		this.photoUrl = photoUrl;
		this.tiles = tiles;
	}
}

// interface User {
// 	id: string;
// 	username: string;
// 	photoUrl: string;
// 	tiles?: Tile[];
