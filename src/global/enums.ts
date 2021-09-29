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

export enum Status {
	info = 'info',
	success = 'success',
	error = 'error'
}

export enum Pages {
	index = '/',
	login = '/Login',
	newUser = '/NewUser',
	home = '/Home',
	newGame = '/NewGame',
	joinGame = '/JoinGame',
	table = '/Table',
	sample = '/Sample'
}

export enum Segments {
	top = 'top',
	right = 'right',
	bottom = 'bottom',
	left = 'left'
}

export enum FrontBackTag {
	front = 'front',
	back = 'back'
}

export enum Sizes {
	small = 'small',
	medium = 'medium',
	large = 'large'
}

export enum BackgroundColors {
	dark = 'rgb(30, 30, 30)',
	brown = 'rgb(140, 125, 105)',
	green = 'rgb(40, 90, 85)',
	red = 'rgb(125, 50, 50)',
	purple = 'rgb(142, 80, 118)',
	blue = 'rgb(38, 61, 96)'
}

export enum TableColors {
	dark = 'rgb(50, 50, 50)',
	brown = 'rgb(160, 149, 133)',
	green = 'rgb(80, 110, 80)',
	red = 'rgb(140, 80, 70)',
	purple = 'rgb(135, 100, 155)',
	blue = 'rgb(95, 110, 160)'
}

export enum TileColors {
	dark = 'grey',
	light = 'gainsboro',
	green = 'teal',
	red = 'rgb(150, 65, 50)',
	purple = 'rgb(106, 62, 128)',
	blue = 'rgb(96, 130, 182)'
}

export enum TextColors {
	light = 'rgb(250, 250, 250)',
	dark = 'rgb(40, 40, 40)',
	green = 'rgb(0, 130, 20)'
}

export const Amounts = [1, 2, 4, 8, 16, 32, 64];

export enum Decorations {
	default = ''
}

export enum ShownTileWidths {
	small = 20,
	medium = 23,
	large = 28
}

export enum ShownTileHeights {
	small = 29,
	medium = 33,
	large = 40
}
