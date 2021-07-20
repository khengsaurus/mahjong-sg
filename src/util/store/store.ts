import { createStore } from 'redux';
import { ActionTypes, SET_CACHE, SET_PLAYER, SET_GAME } from './actions';

function storeReducer(
	state: Store = {
		game: null,
		gameCache: null,
		player: null
	},
	action: ActionTypes
) {
	switch (action.type) {
		case SET_GAME:
			return {
				...state,
				game: action.payload
			};
		case SET_CACHE:
			return {
				...state,
				gameCache: action.payload
			};
		case SET_PLAYER:
			return {
				...state,
				player: action.payload
			};
		default:
			return state;
	}
}

const store = createStore(storeReducer);

export default store;
