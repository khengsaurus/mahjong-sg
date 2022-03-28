import { BotIds, Content, Page, Size, StorageKey } from 'enums';
import { useInitMobile, useLocalObj } from 'hooks';
import isEmpty from 'lodash.isempty';
import { ErrorMessage, InfoMessage } from 'messages';
import { User } from 'models';
import { isDev } from 'platform';
import {
	createContext,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { HttpService, ServiceInstance } from 'service';
import { IStore } from 'store';
import {
	setAboutContent,
	setContentUpdated,
	setGame,
	setGameId,
	setHaptic,
	setHelpContent,
	setLocalGame,
	setPolicyContent,
	setSizes,
	setTheme,
	setTHK,
	setUser
} from 'store/actions';
import { IAlert } from 'typesPlus';
import { getTheme } from 'utility';
import { mainLRUCache } from 'utility/LRUCache';
import { jwtToObj, objToJwt } from 'utility/parsers';

interface IAppContext {
	alert: IAlert;
	annHuOpen: boolean;
	hasAI: boolean;
	players: User[];
	playerSeat?: number;
	selectedTiles?: IShownTile[];
	showAI: false;
	showDisconnectedAlert?: boolean;
	userEmail: string;
	handleHome: () => void;
	handleLocalUO: (user: User) => void;
	handleUserState: () => Promise<boolean>;
	login: (user: User, writeToLocal: boolean) => boolean;
	logout: () => void;
	navigate: NavigateFunction;
	setAlert?: (alert: IAlert) => void;
	setAnnHuOpen?: (b: boolean) => void;
	setPlayers: (players: User[]) => void;
	setPlayerSeat: (seat: number) => void;
	setSelectedTiles: (tiles: IShownTile[]) => void;
	setShowAI: (b?: boolean) => void;
	setShowDisconnectedAlert: (b: boolean) => void;
	setUserEmail: (email: string) => void;
}

const initialContext: IAppContext = {
	alert: null,
	annHuOpen: false,
	hasAI: false,
	players: [],
	playerSeat: 0,
	selectedTiles: [],
	showAI: false,
	showDisconnectedAlert: false,
	userEmail: '',
	handleHome: () => {},
	handleLocalUO: (_: User) => {},
	handleUserState: async () => false,
	navigate: (_: any) => {},
	login: (_: User, __: boolean) => true,
	logout: () => {},
	setAlert: (_: IAlert) => {},
	setAnnHuOpen: (_: boolean) => {},
	setSelectedTiles: (_: IShownTile[]) => {},
	setShowAI: (_: SetStateAction<boolean>) => {},
	setShowDisconnectedAlert: (_: SetStateAction<boolean>) => {},
	setPlayers: (_: User[]) => {},
	setPlayerSeat: (_: number) => {},
	setUserEmail: (_: string) => {}
};

export const AppContext = createContext<IAppContext>(initialContext);

export const AppContextProvider = (props: any) => {
	const { user, contentUpdated } = useSelector((state: IStore) => state);
	const { resolveLocalObj, handleLocalObj } = useLocalObj<User>(
		StorageKey.USERJWT,
		jwtToObj,
		objToJwt
	);
	const [alert, setAlert] = useState<IAlert>(null);
	const [annHuOpen, setAnnHuOpen] = useState(false);
	const [hasAI, setHasAI] = useState(false);
	const [players, setPlayers] = useState<User[]>([user]);
	const [playerSeat, setPlayerSeat] = useState(0);
	const [selectedTiles, setSelectedTiles] = useState<IShownTile[]>([]);
	const [showAI, setShowAI] = useState(false);
	const [userEmail, setUserEmail] = useState('');
	const contentReqTimeout = useRef<NodeJS.Timeout>();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	useInitMobile();

	async function getContent() {
		const aboutContent = HttpService.getContent(Content.ABOUT);
		const helpContent = HttpService.getContent(Content.HELP);
		const policyContent = HttpService.getContent(Content.POLICY);
		return Promise.all([aboutContent, helpContent, policyContent]);
	}

	useEffect(() => {
		const now = new Date();
		if (
			!contentReqTimeout.current &&
			(!contentUpdated ||
				(contentUpdated && now.getTime() - new Date(contentUpdated).getTime()) >
					(isDev ? 1 / 60 : 6) * 60 * 60 * 1000) // 1 min if dev, 6 hours if prod
		) {
			contentReqTimeout.current = setTimeout(async () => {
				try {
					getContent().then(data => {
						if (data.length === 3 && data.every(d => !isEmpty(d))) {
							dispatch(setAboutContent(data[0] as IAboutContent));
							dispatch(setHelpContent(data[1] as IHelpContent));
							dispatch(setPolicyContent(data[2] as IPolicyContent));
							dispatch(setContentUpdated(now));
							console.info(
								`${InfoMessage.CONTENT_RETRIEVED} from ${HttpService.serverEndpoint} at ${now}`
							);
						} else {
							throw new Error(ErrorMessage.CONTENT_FETCH_FAIL);
						}
					});
				} catch (err) {
					console.info(err.message);
					dispatch(setContentUpdated(null));
				}
			}, 500);
		}

		return () => {
			clearTimeout(contentReqTimeout.current);
			contentReqTimeout.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contentUpdated, dispatch]);

	useEffect(() => {
		setHasAI(players.length > 1 && !!players.find(p => BotIds.includes(p?.id)));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [players?.map(p => p?.id)]);

	const handleHome = useCallback(() => {
		dispatch(setGameId(''));
		dispatch(setTHK(111));
		dispatch(setGame(null));
		dispatch(setLocalGame(null));
		mainLRUCache.clear();
		if (!user) {
			setPlayers([]);
			navigate(Page.LOGIN);
		} else {
			setPlayers([user]);
			navigate(Page.INDEX);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, setPlayers, user?.id]);

	const handleUserPref = useCallback(
		(user?: User) => {
			setPlayers(user ? [user] : []);
			setUserEmail(user ? user.email : '');
			const theme = getTheme(user?.bgC, user?.tC, user?.tBC);
			dispatch(setUser(user || null));
			dispatch(setTheme(theme));
			dispatch(setHaptic(user?.hp || true));
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
				console.error(err);
				resolve(false);
			}
		});
	}, [handleUserPref, login, resolveLocalObj, user?.id]);

	return (
		<AppContext.Provider
			value={{
				alert,
				annHuOpen,
				hasAI,
				players,
				playerSeat,
				selectedTiles,
				showAI,
				userEmail,
				handleHome,
				handleLocalUO: handleLocalObj,
				handleUserState,
				login,
				logout,
				navigate,
				setAlert,
				setAnnHuOpen,
				setPlayers,
				setPlayerSeat,
				setSelectedTiles,
				setShowAI,
				setUserEmail
			}}
			{...props}
		/>
	);
};
