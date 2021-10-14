import { User } from '../Models/User';

export interface IPlayerComponentProps {
	player?: User;
	dealer?: boolean;
	hasFront?: boolean;
	hasBack?: boolean;
	isPlayerTurn?: boolean;
	lastThrown?: ITile;
	tilesSize?: Sizes;
}

export const Amounts = [1, 2, 4, 8, 16, 32, 64];

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
	MOUSE = '老鼠',
	ROOSTER = '公鸡',
	WORM = '虫'
}

export enum Flowers {
	RED1 = 'red1',
	RED2 = 'red2',
	RED3 = 'red3',
	RED4 = 'red4',
	BLUE1 = 'blue1',
	BLUE2 = 'blue2',
	BLUE3 = 'blue3',
	BLUE4 = 'blue4'
}

export enum CardCategories {
	REGULAR = 'a',
	WINDS = 'b',
	HBF = 'c',
	FLOWER = 'y',
	ANIMAL = 'z'
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
