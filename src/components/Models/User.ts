export class User {
	id: string;
	username: string;
	photoUrl: string;
	currentSeat?: number;
	tiles?: Tile[] | null;

	constructor(id: string, username: string, photoUrl: string, currentSeat?: number, tiles?: Tile[]) {
		this.id = id;
		this.username = username;
		this.photoUrl = photoUrl;
		this.currentSeat = currentSeat;
		this.tiles = tiles || [];
	}
}
