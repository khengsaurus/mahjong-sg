interface Store {
	game: Game;
	gameCache: Game;
	player: User;
}

interface jwtData {
	id: string;
	username: string;
	photoUrl: string;
	iat: number;
	exp: number;
}

interface Group {
	name: string;
	users: User[];
}
interface alert {
	status: Color;
	msg: string;
}

interface Tile {
	card?: string;
	suit?: string;
	number?: number;
	id?: string;
	index?: number;
	show?: boolean;
	isValidFlower?: boolean;
}

interface PlayerComponentProps {
	player: User;
	dealer?: boolean;
	hasFront?: boolean;
	hasBack?: boolean;
	isPlayerTurn?: boolean;
	lastThrownTile?: Tile;
}

interface loginParams {
	username: string;
	password: string;
}

interface RegisterEmail {
	username: string;
	email: string;
}

interface RegisterUserPass {
	username: string;
	password: string;
}

interface Log {
	msg: string;
	timeStamp: Date;
}
