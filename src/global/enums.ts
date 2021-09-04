import { createTheme } from '@material-ui/core/styles';
import { User } from '../Models/User';

export interface PlayerComponentProps {
	player?: User;
	dealer?: boolean;
	hasFront?: boolean;
	hasBack?: boolean;
	isPlayerTurn?: boolean;
	lastThrown?: TileI;
	tilesSize?: Sizes;
	handSize?: Sizes;
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
	table = '/Table'
}

export enum Segments {
	top = 'top',
	right = 'right',
	bottom = 'bottom',
	left = 'left'
}

export enum Sizes {
	small = 'small',
	medium = 'medium',
	large = 'large'
}

export enum BackgroundColors {
	gainsboro = 'rgb(220, 220, 220)',
	darker = 'rgb(30, 30, 30)',
	// lightBrown = 'rgb(190, 175, 155)',
	darkBrown = 'rgb(140, 125, 105)',
	// steel = 'steelblue',
	// glaucous = 'rgb(96, 130, 182)',
	catalina = 'rgb(38, 61, 96)',
	royal = 'rgb(120, 81, 169)',
	maroon = 'maroon'
}

export enum TableColors {
	// light = 'rgb(200, 200, 200)',
	dark = 'rgb(50, 50, 50)',
	lightBrown = 'rgb(190, 175, 155)',
	fern = 'rgb(80, 110, 80)',
	denim = 'rgb(111, 143, 175)',
	mediumPurple = 'rgb(147, 112, 219)',
	puce = 'rgb(169, 92, 104)'
}

export enum TileColors {
	white = 'gainsboro',
	grey = 'grey',
	teal = 'teal',
	steel = 'steelblue',
	purple = 'rgb(128,0,128)',
	venetian = 'rgb(164, 42, 4)'
}

export enum TextColors {
	light = 'white',
	dark = 'rgb(30, 30, 30)',
	green = 'rgb(0, 120, 10)'
}

export enum Decorations {
	default = ''
}
