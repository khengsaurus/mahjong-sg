import { User } from './Models/User';
import styled from 'styled-components';

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

export enum TileColors {
	darkmagenta = 'darkmagenta',
	glaucous = 'rgb(96, 130, 182)',
	teal = 'teal',
	venetian = 'rgb(164, 42, 4)',
	grey = 'grey',
	white = 'gainsboro'
}

export enum BackgroundColors {
	light = 'gainsboro',
	dark = 'rgb(50, 50, 50)',
	darker = 'rgb(35, 35, 35)',
	fern = 'rgb(80, 110, 80)',
	lightBrown = 'rgb(190, 175, 155)',
	darkBrown = 'rgb(140, 125, 105)',
	steel = 'steelblue',
	glaucous = 'rgb(96, 130, 182)',
	puce = 'rgb(169, 92, 104)'
}

export enum TextColors {
	light = 'white',
	dark = 'rgb(30, 30, 30)',
	green = 'rgb(0, 120, 10)'
}

export enum Decorations {
	default = ''
}

export const Main = () => {
	return styled.div`
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		background-color: ${props => props.theme.backgroundColor};
	`;
};
