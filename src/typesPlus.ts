import { BackgroundColor, Size, Status, TableColor, TextColor, TileColor } from 'enums';
import { HandPoint } from 'handEnums';
import { Game, User } from 'models';

export interface IUser {
	id: string;
	uN: string;
	email: string;
	_b: boolean[];
	_s: string[];
	_n: number[];
}

export interface IUserJwt extends IUser, IJwt {
	hSz: Size;
	tSz: Size;
	cSz: Size;
	bgC: BackgroundColor;
	tC: BackgroundColor;
	tBC: TileColor;
}

export interface IHasContent {
	Content?: any;
}

export interface IAlert {
	status: Status;
	msg: string;
}

export interface ITheme {
	backgroundColor?: BackgroundColor;
	tableColor?: TableColor;
	tileColor?: TileColor;
	mainTextColor?: TextColor;
	tableTextColor?: TextColor;
}

export interface ISizes {
	handSize?: Size;
	tileSize?: Size;
	controlsSize?: Size;
}

export interface IPoint {
	hD?: string;
	px?: HandPoint;
}

export interface IHWPx {
	hand?: IHand;
	self?: boolean;
	pxs?: IPoint[];
	maxPx?: HandPoint;
}

export interface IPlayerComponentP {
	player?: User;
	dealer?: boolean;
	hasFront?: boolean;
	hasBack?: boolean;
	isPlayerTurn?: boolean;
	lastThrown?: IShownTile;
	tileSize?: Size;
	highlight?: string;
	totalRounds?: number;
}

export interface IModalP extends IHasContent {
	show: boolean;
	game?: Game;
	playerSeat?: number;
	offset?: boolean;
	updateGame?: (game: Game) => void;
	onClose: (boolean?) => void;
}

export interface ITableNotifP {
	notifs: string[];
	timeout: number;
	pong?: () => void;
	kang?: () => void;
	hu?: () => void;
	skip?: () => void;
}

export interface ILeaveAlertP {
	show?: boolean;
	onClose?: (b?: boolean) => void;
}

export interface IDeclareHuModalP extends IModalP {
	HH?: IHWPx;
	handleHu?: (game: Game, _p: number, HH?: IHWPx, tai?: number, zimo?: boolean) => void;
	callback?: () => void;
}

export interface IAnnounceHuModalP extends IModalP {
	HH?: IHWPx;
	showNextRound?: boolean;
	handleHome?: () => void;
	handleChips?: () => void;
	huFirst?: (boolean?) => void;
	nextRound?: () => void;
}

export interface IControls {
	game: Game;
	player: User;
	notif: ITableNotifP;
	topLeft: ITLControlsP;
	topRight: ITRControlsP;
	bottomLeft: IBLControlsP;
	bottomRight: IBRControlsP;
	payModal: IModalP;
	settingsModal: IModalP;
	gameInfoModal: IModalP;
	declareHuModal: IDeclareHuModalP;
	announceHuModal: IAnnounceHuModalP;
	showLeaveAlert: boolean;
	showBottomControls: boolean;
	showAnnounceHuModal: boolean;
	exec: any[];
	handleChi: (cs: string[]) => void;
	setExec: (exec: any[]) => void;
	setGamePaused: (pause: boolean) => void;
}
