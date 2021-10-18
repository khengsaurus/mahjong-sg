import { User } from '../Models/User';

export interface IPlayerComponentProps {
	player?: User;
	dealer?: boolean;
	hasFront?: boolean;
	hasBack?: boolean;
	isPlayerTurn?: boolean;
	lastThrown?: IShownTile;
	tilesSize?: Sizes;
}

export const Amounts = [1, 2, 4, 8, 16, 32, 64];

export const PlayerFlowers = {
	0: ['春', '梅'],
	1: ['夏', '蘭'],
	2: ['秋', '菊'],
	3: ['冬', '竹']
};

export enum Actions {
	TAKE = 'take',
	DRAW = 'draw',
	RETURN = 'return',
	KANG = 'kang',
	THROW = 'throw',
	SHOW = 'show',
	HIDE = 'hide',
	HU = 'hu',
	START = 'start',
	END = 'end'
}

export enum Status {
	ERROR = 'error',
	IDLE = 'idle',
	INFO = 'info',
	PENDING = 'pending',
	SUCCESS = 'success'
}

export enum Pages {
	INDEX = '/',
	LOGIN = '/Login',
	NEWUSER = '/NewUser',
	HOME = '/Home',
	NEWGAME = '/NewGame',
	JOINGAME = '/JoinGame',
	TABLE = '/Table',
	SAMPLE = '/Sample'
}

export enum Segments {
	TOP = 'top',
	RIGHT = 'right',
	BOTTOM = 'bottom',
	LEFT = 'left'
}

export enum FrontBackTag {
	FRONT = 'front',
	BACK = 'back'
}

export enum Indexes {
	ONE = 1,
	TWO = 2,
	THREE = 3,
	FOUR = 4
}

export enum CardCategories {
	REGULAR = 'a',
	WINDS = 'b',
	HBF = 'c',
	FLOWER = 'y',
	ANIMAL = 'z'
}

export enum Suits {
	WAN = '万',
	TONG = '筒',
	SUO = '索',
	DAPAI = '大牌',
	FLOWER = '花',
	ANIMAL = '动物'
}

export enum Winds {
	E = '東',
	S = '南',
	W = '西',
	N = '北'
}

export enum DaPai {
	RED = '红中',
	WHITE = '白板',
	GREEN = '发财'
}

export enum Animals {
	CAT = '猫',
	MOUSE = '鼠',
	ROOSTER = '鸡',
	WORM = '虫'
}

export enum Flowers {
	R1 = '春',
	R2 = '夏',
	R3 = '秋',
	R4 = '冬',
	B1 = '梅',
	B2 = '蘭',
	B3 = '菊',
	B4 = '竹'
}

export enum SuitsIndex {
	万 = '1',
	筒 = '2',
	索 = '3',
	大牌 = '4',
	花 = '4',
	动物 = '4'
}

export enum WindIndex {
	東 = '1',
	南 = '2',
	西 = '3',
	北 = '4'
}

export enum DaPaiIndex {
	红中 = '1',
	白板 = '2',
	发财 = '3'
}

export enum AnimalIndex {
	猫 = '1',
	鼠 = '2',
	鸡 = '3',
	虫 = '4'
}

export enum FlowerIndex {
	春 = '1',
	夏 = '2',
	秋 = '3',
	冬 = '4',
	梅 = '1',
	蘭 = '2',
	菊 = '3',
	竹 = '4'
}

export enum MeldTypes {
	PONG = 'p',
	KANG = 'k',
	CHI = 'c'
}

export enum Sizes {
	SMALL = 'small',
	MEDIUM = 'medium',
	LARGE = 'large'
}

export enum BackgroundColors {
	DARK = 'rgb(30, 30, 30)',
	BROWN = 'rgb(140, 125, 105)',
	GREEN = 'rgb(40, 90, 85)',
	RED = 'rgb(125, 50, 50)',
	PURPLE = 'rgb(142, 80, 118)',
	BLUE = 'rgb(38, 61, 96)'
}

export enum TableColors {
	DARK = 'rgb(50, 50, 50)',
	BROWN = 'rgb(160, 149, 133)',
	GREEN = 'rgb(80, 110, 80)',
	RED = 'rgb(140, 80, 70)',
	PURPLE = 'rgb(135, 100, 155)',
	BLUE = 'rgb(95, 110, 160)'
}

export enum TileColors {
	DARK = 'grey',
	LIGHT = 'gainsboro',
	GREEN = 'teal',
	RED = 'rgb(150, 65, 50)',
	PURPLE = 'rgb(106, 62, 128)',
	BLUE = 'rgb(96, 130, 182)'
}

export enum TextColors {
	LIGHT = 'rgb(250, 250, 250)',
	DARK = 'rgb(40, 40, 40)',
	GREEN = 'rgb(0, 130, 20)'
}

export enum MuiColorTypes {
	DEFAULT = 'default',
	PRIMARY = 'primary',
	SECONDARY = 'secondary',
	INHERIT = 'inherit'
}

export enum Decorations {
	DEFAULT = ''
}

export enum ShownTileWidths {
	SMALL = 20,
	MEDIUM = 23,
	LARGE = 28
}

export enum ShownTileHeights {
	SMALL = 29,
	MEDIUM = 33,
	LARGE = 40
}
