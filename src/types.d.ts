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

interface TileI {
	card?: string;
	suit?: string;
	number?: number;
	id?: string;
	uuid?: string;
	index?: number;
	show?: boolean;
	isValidFlower?: boolean;
}

interface PlayerComponentProps {
	tilesSize: string;
	player: User;
	dealer?: boolean;
	hasFront?: boolean;
	hasBack?: boolean;
	isPlayerTurn?: boolean;
	lastThrown?: TileI;
}

interface UserPass {
	username: string;
	password: string;
}

interface EmailUser {
	username: string;
	email: string;
}

interface EmailPass {
	email: string;
	password: string;
}

interface Log {
	msg: string;
	timeStamp: Date;
}
