import { User } from './Models/User';

export interface PlayerComponentProps {
	tilesSize: string;
	player: User;
	dealer?: boolean;
	hasFront?: boolean;
	hasBack?: boolean;
	isPlayerTurn?: boolean;
	lastThrown?: TileI;
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

export enum TileColors {
	darkmagenta = 'darkmagenta',
	glaucous = 'rgb(96, 130, 182)',
	teal = 'teal',
	venetian = 'rgb(164, 42, 4)',
	grey = 'grey'
}

export enum TableColors {
	fern = 'rgb(80, 110, 80)',
	lighBrown = 'rgb(190, 175, 155)',
	darkBrown = 'rgb(145, 125, 105)'
}

export enum backgroundColors {
	fern = 'rgb(80, 110, 80)',
	lighBrown = 'rgb(190, 175, 155)',
	darkBrown = 'rgb(145, 125, 105)'
}

// brownBlanchedalmond = 'blanchedalmond',
// brownBisque = 'bisque',
// brownWheat = 'wheat',
// brownDark = 'rgb(190, 175, 155)',
// brownDarker = 'rgb(145, 125, 105)',
// brownBurlywood = 'burlywood',
// brownSienna = 'sienna',
// brown = 'brown',
// maroon = 'maroon',
// blueCornflower = 'rgb(100, 149, 237)',
// blueRoyal = 'rgb(65, 105, 225)',
// blueSteel = 'steelblue',
// gold = 'gold',
// goldLight = 'rgb(220, 190, 150)',
// goldPale = 'rgb(230, 190, 138)',
// goldDark = '#d4af37',
// greyStandard = 'grey',
// grey50 = 'rgb(50, 50, 50)',
// grey100 = 'rgb(100, 100, 100)',
// grey170 = 'rgb(170, 170, 170)',
// purpleMediumpurple = 'rgb(147, 112, 219)',
// purpleDarkmagenta = 'darkmagenta',
// purple = 'purple',
// redPuce = 'rgb(169, 92, 104)',
// redPoppy = 'rgb(227, 83, 53)',
// redVenetian = 'rgb(164, 42, 4)',
// greenSea = 'rgb(46, 139, 87)',
// greenFern = 'rgb(62, 120, 59)',
// greenFernDark = 'rgb(80, 110, 80)'
