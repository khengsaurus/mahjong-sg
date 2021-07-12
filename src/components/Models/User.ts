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

export function userToObj(user: User) {
	return {
		id: user.id,
		username: user.username,
		photoUrl: user.photoUrl,
		currentGameId: user.currentGameId || '',
		currentSeat: user.currentSeat || 0,
		tiles: user.tiles || []
	};
}

// interface User {
// 	id: string;
// 	username: string;
// 	photoUrl: string;
// 	tiles?: Tile[];
