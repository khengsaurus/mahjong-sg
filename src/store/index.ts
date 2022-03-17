import { StorageKey } from 'enums';
import { Game, User } from 'models';
import { createStore } from 'redux';
import { createTransform, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from 'store/reducers';
import { ISizes, ITheme } from 'typesPlus';
import { objToGame, objToUser } from 'utility/parsers';

export interface IStore {
	user?: User;
	theme?: ITheme;
	haptic?: boolean;
	sizes?: ISizes;
	gameId?: string;
	game?: Game;
	localGame?: Game;
	tHK?: number;
	contentUpdated?: Date;
	aboutContent?: IAboutContent;
	helpContent?: IHelpContent;
	policyContent?: IPolicyContent;
}

const setUserTransform = createTransform(
	(stateIn: IStore) => stateIn,
	(stateOut: IStore, key: string) => {
		switch (key) {
			case StorageKey.USER:
				return stateOut ? objToUser(stateOut) : null;
			case StorageKey.LOCALGAME:
				return objToGame(stateOut);
			case StorageKey.CONTENTUPDATE:
				return stateOut ? new Date(stateOut as string) : null;
			default:
				return stateOut;
		}
	}
);

const persistConfig = {
	key: StorageKey.ROOT,
	storage,
	blacklist: [StorageKey.GAME],
	transforms: [setUserTransform]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store, null);

export { store, persistor };
