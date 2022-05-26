import { BotIds, Content, Page, Size, StorageKey } from 'enums';
import { useFirstEffect, useInitMobile, useLocalObj, usePreLoadAssets } from 'hooks';
import isEmpty from 'lodash.isempty';
import { ErrorMessage } from 'messages';
import { User } from 'models';
import { isDev } from 'platform';
import { createContext, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { HttpService, ServiceInstance } from 'service';
import { IStore } from 'store';
import {
	setAboutContent,
	setGame,
	setGameId,
	setHaptic,
	setHelpContent,
	setLocalGame,
	setNotifsContent,
	setPolicyContent,
	setSizes,
	setTheme,
	setTHK,
	setUser
} from 'store/actions';
import { getTheme } from 'utility';
import { primaryLRU } from 'utility/LRUCache';
import { jwtToObj, objToJwt } from 'utility/parsers';

interface IAppContext {
	annHuOpen: boolean;
	hasAI: boolean;
	players: User[];
	playerSeat?: number;
	selectedTiles?: IShownTile[];
	showAI: false;
	showDisconnectedAlert: boolean;
	homeAlert: string;
	showHomeAlert: boolean;
	userEmail: string;
	handleHome: () => void;
	handleLocalUO: (user: User) => void;
	handleUserState: () => Promise<boolean>;
	login: (user: User, writeToLocal: boolean) => boolean;
	logout: () => void;
	navigate: NavigateFunction;
	setAnnHuOpen?: (b: boolean) => void;
	setPlayers: (players: User[]) => void;
	setPlayerSeat: (seat: number) => void;
	setSelectedTiles: (tiles: IShownTile[]) => void;
	setShowAI: (b?: boolean) => void;
	setShowDisconnectedAlert: (b: boolean) => void;
	setShowHomeAlert: (b: boolean) => void;
	setUserEmail: (email: string) => void;
}

const initialContext: IAppContext = {
	annHuOpen: false,
	hasAI: false,
	players: [],
	playerSeat: 0,
	selectedTiles: [],
	showAI: false,
	showDisconnectedAlert: false,
	homeAlert: '',
	showHomeAlert: false,
	userEmail: '',
	handleHome: () => {},
	handleLocalUO: (_: User) => {},
	handleUserState: async () => false,
	navigate: (_: any) => {},
	login: (_: User, __: boolean) => true,
	logout: () => {},
	setAnnHuOpen: (_: boolean) => {},
	setSelectedTiles: (_: IShownTile[]) => {},
	setShowAI: (_: SetStateAction<boolean>) => {},
	setShowDisconnectedAlert: (_: SetStateAction<boolean>) => {},
	setShowHomeAlert: (_: boolean) => {},
	setPlayers: (_: User[]) => {},
	setPlayerSeat: (_: number) => {},
	setUserEmail: (_: string) => {}
};

async function getContent() {
	const aboutContent = HttpService.getContent(Content.ABOUT);
	const helpContent = HttpService.getContent(Content.HELP);
	const policyContent = HttpService.getContent(Content.POLICY);
	const notifsContent = HttpService.getContent(Content.NOTIFS);
	return Promise.all([aboutContent, helpContent, policyContent, notifsContent]);
}

export const AppContext = createContext<IAppContext>(initialContext);

export const AppContextProvider = (props: any) => {
	const { user } = useSelector((state: IStore) => state);
	const { resolveLocalObj, handleLocalObj } = useLocalObj<User>(
		StorageKey.USERJWT,
		jwtToObj,
		objToJwt
	);
	const [annHuOpen, setAnnHuOpen] = useState(false);
	const [hasAI, setHasAI] = useState(false);
	const [players, setPlayers] = useState<User[]>([user]);
	const [playerSeat, setPlayerSeat] = useState(0);
	const [selectedTiles, setSelectedTiles] = useState<IShownTile[]>([]);
	const [showAI, setShowAI] = useState(false);
	const [userEmail, setUserEmail] = useState('');
	const [showHomeAlert, setShowHomeAlert] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleHome = useCallback(() => {
		dispatch(setGameId(''));
		dispatch(setTHK(111));
		dispatch(setGame(null));
		dispatch(setLocalGame(null));
		primaryLRU.clear();
		if (!user) {
			setPlayers([]);
			navigate(Page.LOGIN);
		} else {
			setPlayers([user]);
			navigate(Page.INDEX);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, setPlayers, user?.id]);

	const { homeAlert } = useInitMobile(handleHome);
	useFirstEffect(() => setShowHomeAlert(!!homeAlert), [homeAlert]);
	usePreLoadAssets();

	useEffect(() => {
		getContent()
			.then(data => {
				if (data.length === 4 && data.every(d => !isEmpty(d))) {
					dispatch(setAboutContent(data[0] as IAboutContent));
					dispatch(setHelpContent(data[1] as IHelpContent));
					dispatch(setPolicyContent(data[2] as IPolicyContent));
					dispatch(setNotifsContent(data[3] as INotifsContent));
				} else {
					throw new Error(ErrorMessage.CONTENT_FETCH_FAIL);
				}
			})
			.catch(err => console.info(err.message));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	useEffect(() => {
		setHasAI(players.length > 1 && !!players.find(p => BotIds.includes(p?.id)));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [players?.map(p => p?.id)]);

	const handleUserPref = useCallback(
		(user?: User) => {
			setPlayers(user ? [user] : []);
			setUserEmail(user ? user.email : '');
			const theme = getTheme(user?.bgC, user?.tC, user?.tBC, user?._b[0] || false);
			dispatch(setUser(user || null));
			dispatch(setTheme(theme));
			dispatch(setHaptic(user?._b[1] || true));
			dispatch(
				setSizes({
					handSize: user?.hSz || Size.MEDIUM,
					tileSize: user?.tSz || Size.MEDIUM,
					controlsSize: user?.cSz || Size.MEDIUM
				})
			);
		},
		[dispatch]
	);

	const logout = useCallback(() => {
		ServiceInstance.FBAuthLogout();
		handleUserPref();
		handleLocalObj(null);
		dispatch(setUser(null));
		dispatch(setGameId(''));
		dispatch(setGame(null));
		dispatch(setLocalGame(null));
	}, [dispatch, handleLocalObj, handleUserPref]);

	const login = useCallback(
		(user: User, writeToLocal: boolean): boolean => {
			try {
				if (!writeToLocal) {
					handleLocalObj(user);
				}
				handleUserPref(user);
				return true;
			} catch (err) {
				logout();
				return false;
			}
		},
		[handleLocalObj, handleUserPref, logout]
	);

	// Detects if
	// 	1) user is FB authenticated
	// 	2) app state contains user, else calls usLocalUserObject.resolveLocalObj
	const handleUserState = useCallback(() => {
		return new Promise(async resolve => {
			try {
				if (user?.id) {
					resolve(true);
				} else {
					resolveLocalObj().then(verifiedUser => {
						if (verifiedUser) {
							login(verifiedUser, true);
							handleUserPref(verifiedUser);
							resolve(true);
						} else {
							resolve(false);
						}
					});
				}
			} catch (err) {
				isDev && console.error(err);
				resolve(false);
			}
		});
	}, [handleUserPref, login, resolveLocalObj, user?.id]);

	return (
		<AppContext.Provider
			value={{
				annHuOpen,
				hasAI,
				homeAlert,
				players,
				playerSeat,
				selectedTiles,
				showAI,
				showHomeAlert,
				userEmail,
				handleHome,
				handleLocalUO: handleLocalObj,
				handleUserState,
				login,
				logout,
				navigate,
				setAnnHuOpen,
				setPlayers,
				setPlayerSeat,
				setSelectedTiles,
				setShowAI,
				setShowHomeAlert,
				setUserEmail
			}}
			{...props}
		/>
	);
};
