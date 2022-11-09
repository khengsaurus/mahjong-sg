interface IJwt {
	iat?: number;
	exp?: number;
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

interface IHasFontSize {
	fontSize: Size;
}

interface IFBLog {
	userId?: string;
	username?: string;
	timestamp?: Date;
	event?: UserActivity;
	message?: string;
}

interface IUser {
	hSz?: Size;
	tSz?: Size;
	cSz?: Size;
	bgC?: BackgroundColor;
	tC?: TableColor;
	tBC?: TileColor;
}

interface IPlayer {
	sTs?: IShownTile[];
	ms?: string[];
	hTs?: IHiddenTile[];
	dTs?: IShownTile[];
	lTa?: IShownTile | IHiddenTile;
	uTs?: number;
	bal?: number;
	sT?: boolean;
	cfH?: boolean;
}

interface IPreference {
	label: string;
	size?: Size;
	selectedColor?: BackgroundColor | TableColor | TileColor;
	colors?: any[];
	handleSelect: (value: Size | BackgroundColor | TableColor | TileColor) => void;
}

interface IAboutContent {
	descMobile: string;
	descWeb: string;
	reachOut: string;
}

interface IHelpItem {
	title: string;
	points: string[];
	ps?: string;
}

interface IHelpContent {
	sections: IHelpItem[];
}

interface IPolicyItem {
	title: string;
	content: string;
}

type IPolicyContent = { policies: IPolicyItem[] };

interface IHomeNotif {
	key: number;
	message: string;
}

interface INotifsContent {
	latestIOSVersion: number;
	latestAndVersion: number;
	notifs: IHomeNotif[];
}

/* ------------------------------ Props ------------------------------*/

interface ITLControlsP {
	toggleShowSettings: () => void;
	toggleShowAdmin: () => void;
	toggleShowScreenText: () => void;
	handleBotExec?: () => void;
	setShowLeaveAlert?: (b?: boolean) => void;
	showText: boolean;
	texts: string[];
}

interface ITRControlsP {
	toggleShowPay: () => void;
	toggleShowLogs: () => void;
	showText: boolean;
	showLogs: boolean;
}

interface IBLControlsP {
	handleChi: () => void;
	handlePong: () => void;
	openDeclareHuDialog: () => void;
	setShowChiAlert?: (show: false) => void;
	disableChi: boolean;
	disablePong: boolean;
	disableHu: boolean;
	pongText: string;
	confirmHu: boolean;
	showDeclareHu: boolean;
	highlight?: string;
	HH: IHWPx;
}

interface IBRControlsP {
	handleThrow: () => void;
	handleDraw: () => void;
	handleOpen: () => void;
	setShowChiAlert?: (show: false) => void;
	confirmHu: boolean;
	disableThrow: boolean;
	disableDraw: boolean;
	drawText: string;
	highlight?: string;
	showDeclareHu: boolean;
	showChiAlert?: boolean;
	taken?: boolean;
	HH: IHWPx;
}

/* ------------------------------ Game related ------------------------------*/

interface IHiddenTile {
	i?: string;
	r?: number;
	x?: number;
}

interface IHasSuit {
	s?: Suit;
}

interface IHasNum {
	n?: number;
}

interface IHasSuitNum extends IHasSuit, IHasNum {}

interface IShownTile extends IHiddenTile, IHasSuitNum {
	v?: boolean;
	c?: string;
}

interface IShownTileWNeighbors extends IShownTile {
	_1?: string[];
	_2?: string[];
	wChi?: string[];
}

interface ShownTiles {
	fs?: IShownTile[]; // flowers
	nFs?: IShownTile[]; // nonFlowers
	fIds?: string[];
	nFIds?: string[];
}

interface IHand {
	openMsStr?: string[];
	openTs?: IShownTile[];
	hideMsStr?: string[];
	hideMs?: IShownTile[][];
	pStr?: string;
	pair?: IShownTile[];
	tsL?: IShownTile[];
	lTa?: IShownTile;
}

interface IUseHand {
	hStr?: string;
	hs?: IHand[];
	vHs?: IHand[];
	aHsWM?: IHand[];
	aHsWP?: IHand[];
	aHsWMP?: IHand[];
	hsWPx?: IHWPx[];
	HH?: IHWPx;
}

interface IObj<T, P> {
	[key: T]: P;
}

interface IHasStyle {
	style?: any;
}

interface IHasLabel {
	label?: string | PageName | ButtonText;
}

interface IHomeButtonP extends IHasStyle, IHasLabel {
	disableShortcut?: boolean;
	callback?: () => void;
}

interface ITilesBySuit {
	[Suit.WAN]?: IShownTile[];
	[Suit.TONG]?: IShownTile[];
	[Suit.SUO]?: IShownTile[];
	[Suit.DAPAI]?: IShownTile[];
}

interface IHandObjectives {
	priorMeld: MeldType;
	priorSuits: Suit[];
	keepDaPai: boolean;
	scoringPongs: string[];
}

interface IDiscardCategories {
	ownCs?: string[];
	ownSingles?: string[];
	multis?: string[];
	loneTs?: string[];
	deadPairs?: string[];
	easyChi?: string[];
	okayChi?: string[];
	hardChi?: string[];
	deadChi?: string[];
	easyPong?: string[];
	okayPong?: string[];
	hardPong?: string[];
	deadPong?: string[];
	waitingTwoChi?: string[];
	countHandCs?: IObj<string, number>;
	countOwnCsByS?: IObj<string, number>;
	countAllKnownCs?: IObj<string, number>;
	manyDaPai?: boolean;
}

interface IPreEnd {
	pr?: number;
	st?: number;
	_d?: number;
	fN?: boolean;
}
