interface Store {
	game: Game;
	gameCache: Game;
	player: User;
}

interface JwtData {
	id: string;
	username: string;
	photoUrl: string;
	email: string;
	handSize: Sizes;
	tilesSize: Sizes;
	controlsSize: Sizes;
	backgroundColor: BackgroundColors;
	tableColor: BackgroundColors;
	tileBackColor: TileColors;
	iat: number;
	exp: number;
}

interface Group {
	name: string;
	users: User[];
}
interface AlertI {
	status: Status;
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

interface Theme {
	backgroundColor: BackgroundColors;
	tableColor: BackgroundColors;
	tileBackColor: TileColors;
	textColor: string;
}
