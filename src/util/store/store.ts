import { createStore } from 'redux';
import { ActionTypes, SET_GAME, SET_PLAYER } from './actions';

function storeReducer(
	state: IStore = {
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
