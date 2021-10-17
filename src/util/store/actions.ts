import { Game } from '../../Models/Game';
import { User } from '../../Models/User';

export const SET_GAME = 'SET_GAME';
export const SET_PLAYER = 'SET_PLAYER';

export type ActionTypes = { type: typeof SET_GAME; payload: Game } | { type: typeof SET_PLAYER; payload: User };

export const setGame = (game: Game): ActionTypes => ({
	type: SET_GAME,
	payload: game
});

export const setPlayer = (player: User): ActionTypes => ({
	type: SET_PLAYER,
	payload: player
});
