export const LocalFlag = 'local';
export const Visitor = 'Visitor';
export const DisallowedUsernames = ['admin', 'test'];

export type AlertStatus = 'success' | 'info' | 'warning' | 'error';

export enum Content {
	ABOUT = 'about',
	HELP = 'helpNew',
	POLICY = 'policyNew',
	NOTIFS = 'notifs'
}

export enum UserActivity {
	REGISTER = 'Register',
	LOGIN = 'Login',
	ACCOUNT_DELETE = 'Account deletion',
	GAME_CREATE = 'Account deletion',
	GAME_JOIN = 'Account deletion'
}

export enum EEvent {
	ANDROID_BACK = 'backButton',
	CLICK = 'click',
	KEYBOARDSHOW = 'keyboardDidShow',
	KEYBOARDHIDE = 'keyboardDidHide',
	KEYBOARDWILLSHOW = 'keyboardWillShow',
	KEYBOARDWILLHIDE = 'keyboardWillHide',
	KEYDOWN = 'keydown',
	KEYPRESS = 'keypress',
	NETWORK_CHANGE = 'networkStatusChange',
	MOUSEDOWN = 'mousedown',
	RESIZE = 'resize'
}

export enum Offset {
	HALF_MOBILE = '0',
	HOMEPAGE_MOBILE = '0'
	// HALF_MOBILE = '5vh',
	// HOMEPAGE_MOBILE = '10vh'
}

export enum Platform {
	MOBILE = 'mobile',
	WEB = 'web',
	ANDROID = 'android',
	IOS = 'ios'
}

export enum StorageKey {
	CONTENTUPDATE = 'contentUpdated',
	ROOT = 'root',
	USER = 'user',
	GAME = 'game',
	LOCALGAME = 'localGame',
	USEROBJ = 'userObj',
	USERJWT = 'userJwt'
}

export enum Status {
	ERROR = 'error',
	IDLE = 'idle',
	INFO = 'info',
	PENDING = 'pending',
	SUCCESS = 'success'
}

export enum Page {
	INDEX = '/',
	ABOUT = '/about',
	HELP = '/help',
	HOME = '/home',
	JOINGAME = '/join-game',
	LOGIN = '/login',
	NEWGAME = '/new-game',
	NEWUSER = '/new-user',
	POLICY = '/policy',
	TABLE = '/table'
}

export enum NativePage {
	LOGIN = 'Login',
	NEWUSER = 'NewUser',
	HOME = 'Home',
	NEWGAME = 'NewGame',
	JOINGAME = 'JoinGame',
	TABLE = 'Table'
}

export enum PageName {
	ABOUT = 'About',
	HELP = 'Help',
	HOME = 'Home',
	JOINGAME = 'Join Game',
	LOGIN = 'Login',
	NEWGAME = 'New Game',
	NEWUSER = 'New User',
	TABLE = 'Table'
}

export enum Shortcut {
	// Pages
	NEWGAME = 'n',
	JOINGAME = 'j',
	ABOUT = 'a',
	// Game controls
	DETAILS = 'd',
	INFO = 'i',
	HOME = 'h',
	PAY = 'p',
	SETTINGS = 's',
	TEXT = 't',
	VIEW = 'v'
}

export enum Lang {
	ENG = 'ENG',
	CHI = 'CHI'
}

export enum FBCollection {
	USERVAL = 'userVal',
	USERREPR = 'userRepr',
	GAMES = 'games',
	METRICS = 'metrics',
	LOGS = 'logs'
}

export enum FBDatabase {
	USERS = 'users'
}

export enum DateTimeFormat {
	INVALID = 'INVALID',
	DEFAULT = 'DD/MM/YY, h:mm a',
	DDMMYYHMMA = 'DD/MM/YY, h:mm a',
	DDMMY = 'DD/MM/YY',
	HMMA = 'h:mm a'
}

export enum TransitionSpeed {
	SLOW = '800ms',
	MEDIUM = '450ms',
	FAST = '300ms',
	INSTANT = '0ms'
}

export enum Transition {
	SLOW = 800,
	MEDIUM = 450,
	FAST = 300,
	INSTANT = 0
}

/* ------------------------------ Dev ------------------------------ */

export const adminUsers = ['tk', 'user1', 'user2', 'user3', 'user4'];

export enum AppFlag {
	DEV = 'dev',
	DEV_BOT = 'devbot'
}

export enum TestUser {
	_19LEFT = 'test_19left',
	_LASTROUND = 'test_lastRound',
	_HUASHANGHUA = 'test_huaShangHua'
}

/* ------------------------------ Game ------------------------------ */

export const Amounts = [0, 1, 2, 4, 8, 16, 32, 64, 128];

export const PlayerFlower = {
	0: ['sc', 'fm'],
	1: ['sx', 'fl'],
	2: ['sq', 'fj'],
	3: ['sd', 'fz']
};

export enum Size {
	SMALL = 'small',
	MEDIUM = 'medium',
	LARGE = 'large'
}

// NOTE: these is the order in which they will be displayed in settings window
export enum BackgroundColor {
	BROWN = 'rgb(205, 185, 165)',
	// YELLOW = 'rgb(235, 204, 111)',
	RED = 'rgb(125, 50, 50)',
	GREEN = 'rgb(30, 65, 52)',
	BLUE = 'rgb(38, 61, 96)',
	DARK = 'rgb(30, 30, 30)'
}

export enum TableColor {
	BROWN = 'rgb(184, 151, 120)',
	RED = 'rgb(140, 80, 70)',
	GREEN = 'rgb(40, 90, 85)',
	BLUE = 'rgb(38, 76, 118)',
	DARK = 'rgb(50, 50, 50)'
}

export enum TileColor {
	// LIGHT = 'gainsboro',
	GOLD = 'rgb(218, 165, 32)',
	RED = 'rgb(150, 65, 50)',
	GREEN = 'teal',
	BLUE = 'rgb(96, 130, 182)',
	DARK = 'grey'
}

export enum TextColor {
	LIGHT = 'rgb(250, 250, 250)',
	DARK = 'rgb(50, 50, 50)',
	GREEN = 'rgb(0, 130, 20)'
}

export enum Decoration {
	DEFAULT = ''
}

export enum ShownTileWidth {
	SMALL = 23,
	MEDIUM = 28,
	LARGE = 32
}

export enum _ShownTileWidth {
	small = 23,
	medium = 28,
	large = 32
}

export enum ShownTileHeight {
	SMALL = 33,
	MEDIUM = 40,
	LARGE = 46
}

export enum _ShownTileHeight {
	small = 33,
	medium = 40,
	large = 46
}

export enum _HiddenTileWidth {
	small = 5,
	large = 8,
	medium = 6
}

export enum Segment {
	TOP = 'top',
	RIGHT = 'right',
	BOTTOM = 'bottom',
	LEFT = 'left'
}

export enum FrontBackTag {
	FRONT = 'front',
	BACK = 'back'
}

export enum CardCategory {
	REGULAR = 'a',
	WINDS = 'b',
	HBF = 'c',
	FLOWER = 'y',
	ANIMAL = 'z'
}

export enum Suit {
	WAN = 'W',
	TONG = 'T',
	SUO = 'S',
	DAPAI = 'D',
	FLOWER = 'F',
	ANIMAL = 'A',
	_ = ''
}

export enum SuitName {
	W = '万',
	T = '筒',
	S = '索'
}

export enum Wind {
	E = 'we',
	S = 'ws',
	W = 'ww',
	N = 'wn'
}

export enum DaPai {
	RED = 'dh',
	WHITE = 'db',
	GREEN = 'df'
}

export enum CardName {
	dh = '红中',
	db = '白版',
	df = '发财',
	am = '猫',
	al = '老鼠',
	ag = '公鸡',
	ac = '虫',
	sc = '春',
	sx = '夏',
	sq = '秋',
	sd = '东',
	fm = '梅',
	fl = '兰',
	fj = '菊',
	fz = '竹',
	we = '東',
	ws = '南',
	ww = '西',
	wn = '北'
}

export enum Animal {
	CAT = 'am',
	MOUSE = 'al',
	ROOSTER = 'ag',
	WORM = 'ac'
}

export enum Flower {
	SC = 'sc',
	SX = 'sx',
	SQ = 'sq',
	SD = 'sd',
	FM = 'fm',
	FL = 'fl',
	FJ = 'fj',
	FZ = 'fz'
}

export enum SuitsIndex {
	W = '1',
	T = '2',
	S = '3',
	D = '4',
	F = '4',
	A = '4'
}

export enum WindIndex {
	we = '1',
	ws = '2',
	ww = '3',
	wn = '4'
}

export enum DaPaiIndex {
	dh = '1',
	db = '2',
	df = '3'
}

export enum AnimalIndex {
	am = '1',
	al = '2',
	ag = '3',
	ac = '4'
}

export enum FlowerIndex {
	sc = '1',
	sx = '2',
	sq = '3',
	sd = '4',
	fm = '1',
	fl = '2',
	fj = '3',
	fz = '4'
}

export enum MeldType {
	PONG = 'p',
	KANG = 'k',
	CHI = 'c'
}

export enum MeldName {
	p = 'pong',
	k = 'kang',
	c = 'chi'
}

export enum Exec {
	DISCARD = 'discard',
	DRAW = 'draw',
	HU = 'hu',
	KANG = 'k',
	PONG = 'p',
	SELF_KANG = 'selfKang',
	SKIP = 'skip',
	TAKE = 'take'
}

export enum PaymentType {
	NONE = 'n',
	SHOOTER = 's',
	HALF_SHOOTER = 'h'
}

/* ------------------------------ En ------------------------------ */

export enum SuitNameEn {
	W = 'W',
	T = 'T',
	S = 'S'
}

export enum CardNameEn {
	dh = 'Red Dragon',
	db = 'White Dragon',
	df = 'Green Dragon',
	am = 'Cat',
	al = 'Rat',
	ag = 'Chicken',
	ac = 'Worm',
	sc = 'Spring',
	sx = 'Summer',
	sq = 'Autumn',
	sd = 'Winter',
	fm = 'Plum',
	fl = 'Orchid',
	fj = 'Chrys.',
	fz = 'Bamboo',
	we = 'East',
	ws = 'South',
	ww = 'West',
	wn = 'North'
}

/* ------------------------------ Bot ------------------------------ */

export const BotIds = ['bot1', 'bot2', 'bot3', 'bot4'];
export const Bot = 'Bot';

export enum BotTimeout {
	SLOW = 1200,
	MEDIUM = 800,
	FAST = 500
}

export enum BotName {
	bot1 = 'ah beng',
	bot2 = 'ah seng',
	bot3 = 'ah lian',
	bot4 = 'ah huay'
}
