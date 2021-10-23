import { history } from 'App';
import useLocalUserObject from 'platform/hooks/useLocalUserObject';
import { createContext, useCallback, useMemo, useState } from 'react';
import { BackgroundColors, Pages, Sizes, TableColors, TextColors, TileColors } from 'shared/enums';
import { User } from 'shared/models';
import FBService from 'shared/service/MyFirebaseService';
import { getTileHashKey } from 'shared/util';

interface AppContextInt {
	user: User;
	userEmail: string;
	players: User[];
	playerSeat?: number;
	gameId?: string;
	stage?: string;
	tileHashKey?: number;
	selectedTiles?: IShownTile[];
	handSize?: Sizes;
	tilesSize?: Sizes;
	controlsSize?: Sizes;
	backgroundColor?: BackgroundColors;
	tableColor?: TableColors;
	tileBackColor?: TileColors;
	mainTextColor?: TextColors;
	tableTextColor?: TextColors;
	alert?: IAlert;
	login: (user: User, writeToLocal: boolean) => void;
	logout: () => void;
	handleLocalUO: (user: User) => void;
	handleUserState: () => Promise<boolean>;
	setUserEmail: (email: string) => void;
	setPlayers: (players: User[]) => void;
	setGameId: (gameId: string) => void;
	setStage: (stage: number) => void;
	setPlayerSeat: (seat: number) => void;
	setSelectedTiles: (tiles: IShownTile[]) => void;
	setHandSize?: (size: Sizes) => void;
	setTilesSize?: (size: Sizes) => void;
	setControlsSize?: (size: Sizes) => void;
	setBackgroundColor?: (color: BackgroundColors) => void;
	setTableColor?: (color: TableColors) => void;
	setTileBackColor?: (color: TileColors) => void;
	setAlert?: (alert: IAlert) => void;
}

const initialContext: AppContextInt = {
	user: null,
	userEmail: '',
	players: [],
	playerSeat: 0,
	gameId: null,
	stage: null,
	tileHashKey: null,
	selectedTiles: [],
	handSize: Sizes.MEDIUM,
	tilesSize: Sizes.MEDIUM,
	controlsSize: Sizes.MEDIUM,
	backgroundColor: BackgroundColors.BLUE,
	tableColor: TableColors.GREEN,
	tileBackColor: TileColors.GREEN,
	mainTextColor: TextColors.DARK,
	tableTextColor: TextColors.DARK,
	alert: null,
	login: (user: User, writeToLocal: boolean) => {},
	logout: () => {},
	handleLocalUO: (user: User) => {},
	handleUserState: async () => false,
	setUserEmail: (email: string) => {},
	setPlayers: (players: User[]) => {},
	setGameId: (gameId: string) => {},
	setStage: (stage: number) => {},
	setPlayerSeat: (seat: number) => {},
	setSelectedTiles: (tiles: IShownTile[]) => {},
	setHandSize: (size: Sizes) => {},
	setTilesSize: (size: Sizes) => {},
	setControlsSize: (size: Sizes) => {},
	setBackgroundColor: (color: BackgroundColors) => {},
	setTableColor: (color: TableColors) => {},
	setTileBackColor: (color: TileColors) => {},
	setAlert: (alert: IAlert) => {}
};

export const AppContext = createContext<AppContextInt>(initialContext);

export const AppContextProvider = (props: any) => {
	const { resolveLocalUO, handleLocalUO } = useLocalUserObject();
	const [user, setUser] = useState<User>(null);
	const [userEmail, setUserEmail] = useState('');
	const [players, setPlayers] = useState<User[]>([user]);
	const [gameId, setGameId] = useState('');
	const [stage, setStage] = useState(0);
	const [playerSeat, setPlayerSeat] = useState(0);
	const [selectedTiles, setSelectedTiles] = useState<IShownTile[]>([]);
	const [handSize, setHandSize] = useState<Sizes>();
	const [tilesSize, setTilesSize] = useState<Sizes>();
	const [controlsSize, setControlsSize] = useState<Sizes>();
	const [backgroundColor, setBackgroundColor] = useState<BackgroundColors>(BackgroundColors.BLUE);
	const [tableColor, setTableColor] = useState<TableColors>();
	const [tileBackColor, setTileBackColor] = useState<TileColors>();
	const [alert, setAlert] = useState<IAlert>(null);

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

	const handleUserPref = useCallback((user?: User) => {
		setPlayers(user ? [user] : []);
		setUser(user || null);
		setUserEmail(user ? user.email : '');
		setHandSize(user ? user.hSz : Sizes.MEDIUM);
		setTilesSize(user ? user.tSz : Sizes.MEDIUM);
		setControlsSize(user ? user.cSz : Sizes.MEDIUM);
		setBackgroundColor(user ? user.bgC : BackgroundColors.BLUE);
		setTableColor(user ? user.tC : TableColors.GREEN);
		setTileBackColor(user ? user.tBC : TileColors.GREEN);
	}, []);

	const login = useCallback(
		(user: User, writeToLocal: boolean) => {
			// if (!FBService.userAuthenticated()) {
			// 	console.error('Failed to log into firebase with email credentials -> logging in anonymously');
			// 	FBService.authLoginAnon().catch(err => {
			// 		console.error(err);
			// 	});
			// }
			if (!writeToLocal) {
				handleLocalUO(user);
			}
			handleUserPref(user);
		},
		[handleLocalUO, handleUserPref]
	);

	const logout = useCallback(() => {
		FBService.authLogout();
		handleUserPref();
		handleLocalUO(null);
		history.push(Pages.LOGIN);
	}, [handleLocalUO, handleUserPref]);

	// Detects if
	// 	1) user is FB authenticated
	// 	2) app state contains user, else calls usLocalUserObject.resolveLocalUO
	const handleUserState = useCallback(() => {
		return new Promise((resolve, reject) => {
			try {
				if (!FBService.userAuthenticated()) {
					logout();
					resolve(false);
				} else if (!user?.id) {
					resolveLocalUO().then(verifiedUser => {
						if (verifiedUser) {
							login(verifiedUser, true);
							handleUserPref(verifiedUser);
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
	}, [handleUserPref, login, logout, resolveLocalUO, user?.id]);

	return (
		<AppContext.Provider
			value={{
				user,
				userEmail,
				setUserEmail,
				handleLocalUO,
				login,
				logout,
				handleUserState,
				players,
				setPlayers,
				gameId,
				setGameId,
				stage,
				setStage,
				playerSeat,
				setPlayerSeat,
				selectedTiles,
				setSelectedTiles,
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
