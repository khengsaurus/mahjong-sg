import { AnyAction } from 'redux';
import { IStore } from 'store';
import {
	SET_ABOUT,
	SET_CONTENT_UPDATED,
	SET_GAME,
	SET_GAME_ID,
	SET_HAPTIC,
	SET_HELP,
	SET_LOCAL_GAME,
	SET_NOTIFS,
	SET_POLICY,
	SET_SIZES,
	SET_THEME,
	SET_THK,
	SET_USER
} from './actions';

export function rootReducer(
	state: IStore = {
		user: null,
		theme: {},
		sizes: {},
		gameId: null,
		game: null,
		localGame: null,
		tHK: 111,
		aboutContent: null,
		helpContent: null,
		policyContent: null,
		notifsContent: null,
		contentUpdated: null
	},
	action: AnyAction
) {
	switch (action.type) {
		case SET_USER:
			return {
				...state,
				user: action.payload
			};
		case SET_THEME:
			return {
				...state,
				theme: action.payload
			};
		case SET_SIZES:
			return {
				...state,
				sizes: action.payload
			};
		case SET_GAME_ID:
			return {
				...state,
				gameId: action.payload
			};
		case SET_GAME:
			return {
				...state,
				game: action.payload
			};
		case SET_LOCAL_GAME:
			return {
				...state,
				localGame: action.payload
			};
		case SET_THK:
			return {
				...state,
				tHK: action.payload
			};
		case SET_ABOUT:
			return {
				...state,
				aboutContent: action.payload
			};
		case SET_HELP:
			return {
				...state,
				helpContent: action.payload
			};
		case SET_POLICY:
			return {
				...state,
				policyContent: action.payload
			};
		case SET_NOTIFS:
			return {
				...state,
				notifsContent: action.payload
			};
		case SET_CONTENT_UPDATED:
			return {
				...state,
				contentUpdated: action.payload
			};
		case SET_HAPTIC:
			return {
				...state,
				haptic: action.payload
			};
		default:
			return state;
	}
}
