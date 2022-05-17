import { Game, User } from 'models';
import { AnyAction } from 'redux';
import { ISizes, ITheme } from 'typesPlus';

export const SET_USER = 'SET_USER';
export const SET_THEME = 'SET_THEME';
export const SET_SIZES = 'SET_SIZES';
export const SET_GAME_ID = 'SET_GAME_ID';
export const SET_GAME = 'SET_GAME';
export const SET_LOCAL_GAME = 'SET_LOCAL_GAME';
export const SET_THK = 'SET_THK';
export const SET_ABOUT = 'SET_ABOUT';
export const SET_HELP = 'SET_HELP';
export const SET_POLICY = 'SET_POLICY';
export const SET_NOTIFS = 'SET_NOTIFS';
export const SET_HAPTIC = 'SET_HAPTIC';

export const setUser = (user: User): AnyAction => ({
	type: SET_USER,
	payload: user
});

export const setTheme = (theme: ITheme): AnyAction => ({
	type: SET_THEME,
	payload: theme
});

export const setSizes = (sizes: ISizes): AnyAction => ({
	type: SET_SIZES,
	payload: sizes
});

export const setGameId = (gameId: string): AnyAction => ({
	type: SET_GAME_ID,
	payload: gameId
});

export const setGame = (game: Game): AnyAction => ({
	type: SET_GAME,
	payload: game
});

export const setLocalGame = (game: Game): AnyAction => ({
	type: SET_LOCAL_GAME,
	payload: game
});

export const setTHK = (tHK: number): AnyAction => ({
	type: SET_THK,
	payload: tHK
});

export const setHelpContent = (content: IHelpContent): AnyAction => ({
	type: SET_HELP,
	payload: content
});

export const setAboutContent = (content: IAboutContent): AnyAction => ({
	type: SET_ABOUT,
	payload: content
});

export const setPolicyContent = (content: IPolicyContent): AnyAction => ({
	type: SET_POLICY,
	payload: content
});

export const setNotifsContent = (content: INotifsContent): AnyAction => ({
	type: SET_NOTIFS,
	payload: content
});

export const setHaptic = (haptic: boolean): AnyAction => ({
	type: SET_HAPTIC,
	payload: haptic
});
