interface IStore {
	game: Game;
	gameCache: Game;
	player: User;
}

interface IHasId {
	id?: string;
}

interface IHasIndex {
	index?: string;
}

interface IHasTimestamp {
	timestamp?: Date;
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

interface IAction {
	timestamp: Date;
	index: number;
	username: string;
	action: Actions;
	huStatus: number[];
	tile: IShownTile[] | IHiddenTile[];
	sentToUsername: string;
	amount: Amounts;
}

interface IGroup {
	name: string;
	users: User[];
}
interface IAlert {
	status: Status;
	msg: string;
}

interface IShownTile {
	id?: string;
	ref?: number;
	v?: boolean;
	card?: string;
	suit?: Suits;
	num?: number;
	ix?: number;
}

interface IHiddenTile {
	id?: string;
	ref?: number;
}

interface ShownTiles {
	flowers?: IShownTile[];
	nonFlowers?: IShownTile[];
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
	timestamp: Date;
}

interface ITheme {
	backgroundColor: BackgroundColors;
	tableColor: BackgroundColors;
	tileBackColor: TileColors;
	textColor: string;
}
