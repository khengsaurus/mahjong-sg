import { Network } from '@capacitor/network';
import { BotIds, Content, EEvent, LocalFlag, Page, Size, StorageKey } from 'enums';
import { useFirstEffect, useInitMobile, useLocalObj, usePreLoadAssets } from 'hooks';
import isEmpty from 'lodash.isempty';
import { ErrorMessage } from 'messages';
import { Game, User } from 'models';
import { isDev, isMobile } from 'platform';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { FBService, HttpService, ServiceInstance } from 'service';
import AxiosService from 'service/AxiosService';
import { IStore } from 'store';
import {
	setAboutContent,
	setContentUpdated,
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
import { getNetworkStatus, getTheme } from 'utility';
import { primaryLRU } from 'utility/LRUCache';
import { jwtToObj, objToJwt } from 'utility/parsers';

interface IAppContext {
	appConnected: boolean;
	annHuOpen: boolean;
	currGame: Game;
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
	appConnected: true,
	annHuOpen: false,
	currGame: null,
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
	handleLocalUO: () => {},
	handleUserState: async () => false,
	navigate: () => {},
	login: () => true,
	logout: () => {},
	setAnnHuOpen: () => {},
	setSelectedTiles: () => {},
	setShowAI: () => {},
	setShowDisconnectedAlert: () => {},
	setShowHomeAlert: () => {},
	setPlayers: () => {},
	setPlayerSeat: () => {},
	setUserEmail: () => {}
};

async function getStaticContent() {
	return AxiosService.initCmsUrl()
		.then(() => {
			return Promise.all([
				HttpService.getContent(Content.ABOUT),
				HttpService.getContent(Content.HELP),
				HttpService.getContent(Content.POLICY),
				HttpService.getContent(Content.NOTIFS)
			]);
		})
		.catch(err => {
			throw err;
		});
}

export const AppContext = createContext<IAppContext>(initialContext);

export const AppContextProvider = (props: any) => {
	const { user, game, gameId, localGame } = useSelector((state: IStore) => state);
	const { resolveLocalObj, handleLocalObj } = useLocalObj<User>(
		StorageKey.USERJWT,
		jwtToObj,
		objToJwt
	);
	const [appConnected, setAppConnected] = useState(true);
	const [annHuOpen, setAnnHuOpen] = useState(false);
	const [hasAI, setHasAI] = useState(false);
	const [players, setPlayers] = useState<User[]>([user]);
	const [playerSeat, setPlayerSeat] = useState(0);
	const [selectedTiles, setSelectedTiles] = useState<IShownTile[]>([]);
	const [showAI, setShowAI] = useState(false);
	const [userEmail, setUserEmail] = useState('');
	const [showHomeAlert, setShowHomeAlert] = useState(false);
	const prevConnectedState = useRef(true);
	const retryFbInitRef = useRef<NodeJS.Timer>(null);
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
		if (isMobile) {
			getNetworkStatus().then(setAppConnected);
			Network?.addListener(EEvent.NETWORK_CHANGE, status => {
				const c = status?.connected === true;
				// If newly connected, try to reconnect
				if (c && !prevConnectedState.current) {
					FBService.initApp().catch(() => {
						retryFbInitRef.current = setInterval(() => {
							FBService.initApp()
								.then(() => {
									clearInterval(retryFbInitRef.current);
									retryFbInitRef.current = null;
								})
								.catch(console.info);
						}, 4000);
					});
				}
				setAppConnected(c);
				prevConnectedState.current = c;
			});
		}

		return () => {
			isMobile && Network?.removeAllListeners();
		};
	}, []);

	useEffect(() => {
		getStaticContent()
			.then(data => {
				if (data.length === 4 && data.every(d => !isEmpty(d))) {
					dispatch(setAboutContent(data[0] as IAboutContent));
					dispatch(setHelpContent(data[1] as IHelpContent));
					dispatch(setPolicyContent(data[2] as IPolicyContent));
					dispatch(setNotifsContent(data[3] as INotifsContent));
					dispatch(setContentUpdated(new Date()));
				} else {
					throw new Error(ErrorMessage.CONTENT_FETCH_FAIL);
				}
			})
			.catch(console.error);
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
				appConnected,
				annHuOpen,
				currGame: gameId === LocalFlag ? localGame : game,
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
