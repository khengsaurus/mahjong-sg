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
	uN: string;
	pUrl: string;
	email: string;
	hSz: Sizes;
	tSz: Sizes;
	cSz: Sizes;
	bgC: BackgroundColors;
	tC: BackgroundColors;
	tBC: TileColors;
	iat: number;
	exp: number;
}

interface IAction {
	timestamp: Date;
	index: number;
	uN: string;
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
	ix?: number;
}

interface ShownTiles {
	flowers?: IShownTile[];
	nonFlowers?: IShownTile[];
	flowerIds?: string[];
	nonFlowerIds?: string[];
}

interface IUserPass {
	uN: string;
	password: string;
}

interface IEmailUser {
	uN: string;
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
	bgC: BackgroundColors;
	tC: BackgroundColors;
	tBC: TileColors;
	textColor: string;
}
