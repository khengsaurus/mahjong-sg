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

interface IPlayerComponentProps {
	player?: User;
	dealer?: boolean;
	hasFront?: boolean;
	hasBack?: boolean;
	isPlayerTurn?: boolean;
	lastThrown?: IShownTile;
	tilesSize?: Sizes;
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

interface IModalProps {
	onClose: (boolean?) => void;
	show: boolean;
	game?: Game;
	playerSeat?: number;
}

interface ITopLeftControls {
	handleHome: () => void;
	handleSettings: () => void;
	texts?: string[];
	notif?: string;
}

interface ITopRightControls {
	handlePay: () => void;
	handleLogs: () => void;
	showLogs: boolean;
	logs: ILog[];
}

interface IBottomLeftControls {
	handleChi: () => void;
	handlePong: () => void;
	handleHu: () => void;
	disableChi: boolean;
	disablePong: boolean;
	disableHu: boolean;
	pongText: string;
	confirmHu: boolean;
	showHu: boolean;
}

interface IBottomRightControls {
	handleThrow: () => void;
	handleDraw: () => void;
	handleOpen: () => void;
	disableThrow: boolean;
	disableDraw: boolean;
	drawText: string;
	confirmHu: boolean;
	showHu: boolean;
}
