import jwt from 'jsonwebtoken';
import { createContext, useMemo, useState } from 'react';
import { history } from '../../App';
import { BackgroundColors, Pages, Sizes, TableColors, TextColors, TileColors } from '../../global/enums';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { getTileHashKey, objToUser, userToObj } from '../utilFns';
import { useLocalStorage } from './useHooks';

interface AppContextInt {
	user: User;
	userEmail: string;
	setUserEmail: (email: string) => void;
	signJwt: (user: User) => void;
	login: (user: User, existingJwt: boolean) => void;
	logout: () => void;
	handleUserState: () => Promise<boolean>;
	players: User[];
	setPlayers: (players: User[]) => void;
	gameId?: string;
	setGameId: (gameId: string) => void;
	stage?: string;
	setStage: (stage: number) => void;
	selectedTiles?: IHiddenTile[];
	setSelectedTiles: (tiles: IHiddenTile[]) => void;
	loading: boolean;
	setLoading: () => void;
	handSize?: Sizes;
	setHandSize?: (size: Sizes) => void;
	tilesSize?: Sizes;
	setTilesSize?: (size: Sizes) => void;
	controlsSize?: Sizes;
	setControlsSize?: (size: Sizes) => void;
	backgroundColor?: BackgroundColors;
	setBackgroundColor?: (color: BackgroundColors) => void;
	tableColor?: TableColors;
	setTableColor?: (color: TableColors) => void;
	tileBackColor?: TileColors;
	setTileBackColor?: (color: TileColors) => void;
	mainTextColor?: TextColors;
	tableTextColor?: TextColors;
	alert?: IAlert;
	setAlert?: (alert: IAlert) => void;
	tileHashKey?: number;
}

const initialContext: AppContextInt = {
	user: null,
	userEmail: '',
	setUserEmail: (email: string) => {},
	signJwt: (user: User) => {},
	login: (user: User, existingJwt: boolean) => {},
	logout: () => {},
	handleUserState: async () => false,
	players: [],
	setPlayers: (players: User[]) => {},
	gameId: null,
	setGameId: (gameId: string) => {},
	stage: null,
	setStage: (stage: number) => {},
	selectedTiles: [],
	setSelectedTiles: (tiles: IHiddenTile[]) => {},
	loading: false,
	setLoading: () => {},
	handSize: Sizes.MEDIUM,
	setHandSize: (size: Sizes) => {},
	tilesSize: Sizes.MEDIUM,
	setTilesSize: (size: Sizes) => {},
	controlsSize: Sizes.MEDIUM,
	setControlsSize: (size: Sizes) => {},
	backgroundColor: BackgroundColors.BLUE,
	setBackgroundColor: (color: BackgroundColors) => {},
	tableColor: TableColors.GREEN,
	setTableColor: (color: TableColors) => {},
	tileBackColor: TileColors.GREEN,
	setTileBackColor: (color: TileColors) => {},
	mainTextColor: TextColors.DARK,
	tableTextColor: TextColors.DARK,
	alert: null,
	setAlert: (alert: IAlert) => {},
	tileHashKey: null
};

export const AppContext = createContext<AppContextInt>(initialContext);

export const AppContextProvider = (props: any) => {
	const [localJwt, setLocalJwt] = useLocalStorage<string>('jwt', null);
	const [user, setUser] = useState<User>(null);
	const [userEmail, setUserEmail] = useState('');
	const [players, setPlayers] = useState<User[]>([user]);
	const [gameId, setGameId] = useState('');
	const [stage, setStage] = useState(0);
	const [selectedTiles, setSelectedTiles] = useState<IHiddenTile[]>([]);
	const [loading, setLoading] = useState(false);
	const [handSize, setHandSize] = useState<Sizes>();
	const [tilesSize, setTilesSize] = useState<Sizes>();
	const [controlsSize, setControlsSize] = useState<Sizes>();
	const [backgroundColor, setBackgroundColor] = useState<BackgroundColors>(BackgroundColors.BLUE);
	const [tableColor, setTableColor] = useState<TableColors>();
	const [tileBackColor, setTileBackColor] = useState<TileColors>();
	const [alert, setAlert] = useState<IAlert>(null);
	const secretKey = 'shouldBeServerSideKey';

	const mainTextColor = useMemo(() => {
		return [BackgroundColors.DARK, BackgroundColors.BLUE, BackgroundColors.GREEN, BackgroundColors.RED].includes(
			backgroundColor
		)
			? TextColors.LIGHT
			: TextColors.DARK;
	}, [backgroundColor]);

	const tableTextColor = useMemo(() => {
		return [TableColors.DARK, TableColors.RED].includes(tableColor) ? TextColors.LIGHT : TextColors.DARK;
	}, [tableColor]);

	const tileHashKey = useMemo(() => {
		return getTileHashKey(gameId, stage);
	}, [gameId, stage]);

	async function handleUserState(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				if (!FBService.userAuthenticated()) {
					logout();
					resolve(false);
				} else {
					resolveJwt().then(verifiedUser => {
						if (verifiedUser) {
							login(verifiedUser, true);
							resolve(true);
						} else {
							logout();
							resolve(false);
						}
					});
				}
			} catch (err) {
				logout();
				reject(err);
			}
		});
	}

	function signJwt(user: User) {
		const token = jwt.sign(userToObj(user), secretKey, {
			algorithm: 'HS256'
		});
		setLocalJwt(token);
	}

	function resolveJwt(): Promise<User> {
		return new Promise((resolve, reject) => {
			let user: User;
			try {
				user = localJwt ? objToUser(jwt.verify(localJwt, secretKey) as IJwtData) : null;
				if (user) {
					handleUserContext(user);
					resolve(user);
				} else {
					resolve(null);
				}
			} catch (err) {
				reject(new Error('User token not found: ' + err.msg));
			}
		});
	}

	function handleUserContext(user?: User) {
		setPlayers(user ? [user] : []);
		setUser(user || null);
		setUserEmail(user ? user.email : '');
		setHandSize(user ? user.handSize : Sizes.MEDIUM);
		setTilesSize(user ? user.tilesSize : Sizes.MEDIUM);
		setControlsSize(user ? user.controlsSize : Sizes.MEDIUM);
		setBackgroundColor(user ? user.backgroundColor : BackgroundColors.BLUE);
		setTableColor(user ? user.tableColor : TableColors.GREEN);
		setTileBackColor(user ? user.tileBackColor : TileColors.GREEN);
	}

	function login(user: User, existingJwt: boolean) {
		// if (!FBService.userAuthenticated()) {
		// 	console.error('Failed to log into firebase with email credentials -> logging in anonymously');
		// 	FBService.authLoginAnon().catch(err => {
		// 		console.error(err);
		// 	});
		// }
		if (!existingJwt) {
			signJwt(user);
		}
		handleUserContext(user);
	}

	function deleteAllCookies() {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var eqPos = cookie.indexOf('=');
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
		}
	}

	function logout(): void {
		FBService.authLogout();
		handleUserContext();
		setLocalJwt(null);
		sessionStorage.clear();
		deleteAllCookies();
		history.push(Pages.LOGIN);
	}

	return (
		<AppContext.Provider
			value={{
				user,
				userEmail,
				setUserEmail,
				signJwt,
				login,
				logout,
				handleUserState,
				players,
				setPlayers,
				gameId,
				setGameId,
				stage,
				setStage,
				selectedTiles,
				setSelectedTiles,
				loading,
				setLoading,
				handSize,
				setHandSize,
				tilesSize,
				setTilesSize,
				controlsSize,
				setControlsSize,
				backgroundColor,
				setBackgroundColor,
				tileBackColor,
				setTileBackColor,
				tableColor,
				setTableColor,
				mainTextColor,
				tableTextColor,
				alert,
				setAlert,
				tileHashKey
			}}
			{...props}
		/>
	);
};
