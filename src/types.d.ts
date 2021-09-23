interface IStore {
	game: Game;
	gameCache: Game;
	player: User;
}

interface IJwtData {
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

interface IGroup {
	name: string;
	users: User[];
}
interface IAlert {
	status: Status;
	msg: string;
}

interface ITile {
	card?: string;
	suit?: string;
	number?: number;
	id?: string;
	uuid?: string;
	index?: number;
	show?: boolean;
	isValidFlower?: boolean;
}

interface ShownTiles {
	flowers?: ITile[];
	nonFlowers?: ITile[];
	flowerIds?: string[];
	nonFlowerIds?: string[];
}

interface IUserPass {
	username: string;
	password: string;
}

interface IEmailUser {
	username: string;
	email: string;
}

interface IEmailPass {
	email: string;
	password: string;
}

interface ILog {
	msg: string;
	timeStamp: Date;
}

interface ITheme {
	backgroundColor: BackgroundColors;
	tableColor: BackgroundColors;
	tileBackColor: TileColors;
	textColor: string;
}
