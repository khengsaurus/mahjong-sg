import jwt from 'jsonwebtoken';
import { createContext, useMemo, useState } from 'react';
import { history } from '../../App';
import { BackgroundColors, Pages, Sizes, TableColors, TextColors, TileColors } from '../../global/enums';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { objToUser, userToObj } from '../utilFns';

interface AppContextInt {
	user: User;
	userEmail: string;
	setUserEmail: (email: string) => void;
	signJwt: (user: User) => void;
	login: (user: User, existingJwt: boolean) => void;
	logout: () => void;
	handleUserState: () => void;
	players: User[];
	setPlayers: (players: User[]) => void;
	gameId?: string;
	setGameId: (gameId: string) => void;
	selectedTiles?: ITile[];
	setSelectedTiles: (tiles: ITile[]) => void;
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
	tableTextColor?: TextColors;
	mainTextColor?: TextColors;
}

const initialContext: AppContextInt = {
	user: null,
	userEmail: '',
	setUserEmail: (email: string) => {},
	signJwt: (user: User) => {},
	login: (user: User, existingJwt: boolean) => {},
	logout: () => {},
	handleUserState: async () => {},
	players: [],
	setPlayers: (players: User[]) => {},
	gameId: null,
	setGameId: (gameId: string) => {},
	selectedTiles: [],
	setSelectedTiles: (tiles: ITile[]) => {},
	loading: false,
	setLoading: () => {},
	handSize: Sizes.medium,
	setHandSize: (size: Sizes) => {},
	tilesSize: Sizes.medium,
	setTilesSize: (size: Sizes) => {},
	controlsSize: Sizes.medium,
	setControlsSize: (size: Sizes) => {},
	backgroundColor: BackgroundColors.brown,
	setBackgroundColor: (color: BackgroundColors) => {},
	tableColor: TableColors.brown,
	setTableColor: (color: TableColors) => {},
	tileBackColor: TileColors.green,
	setTileBackColor: (color: TileColors) => {},
	tableTextColor: TextColors.dark
};

export const AppContext = createContext<AppContextInt>(initialContext);

export const AppContextProvider = (props: any) => {
	const [user, setUser] = useState<User>(null);
	const [userEmail, setUserEmail] = useState('');
	const [players, setPlayers] = useState<User[]>([user]);
	const [gameId, setGameId] = useState('');
	const [selectedTiles, setSelectedTiles] = useState<ITile[]>([]);
	const [loading, setLoading] = useState(false);
	const [handSize, setHandSize] = useState<Sizes>();
	const [tilesSize, setTilesSize] = useState<Sizes>();
	const [controlsSize, setControlsSize] = useState<Sizes>();
	const [backgroundColor, setBackgroundColor] = useState<BackgroundColors>(BackgroundColors.brown);
	const [tableColor, setTableColor] = useState<TableColors>();
	const [tileBackColor, setTileBackColor] = useState<TileColors>();
	const mainTextColor = useMemo(() => {
		return [BackgroundColors.dark, BackgroundColors.green, BackgroundColors.blue, BackgroundColors.red].includes(
			backgroundColor
		)
			? TextColors.light
			: TextColors.dark;
	}, [backgroundColor]);
	const tableTextColor = useMemo(() => {
		return [TableColors.dark, TableColors.red].includes(tableColor) ? TextColors.light : TextColors.dark;
	}, [tableColor]);
	const secretKey = 'shouldBeServerSideKey';

	async function handleUserState() {
		if (!FBService.userAuthenticated()) {
			logout();
		} else {
			resolveJwt().then(verifiedUser => {
				if (verifiedUser) {
					login(verifiedUser, true);
				} else {
					logout();
				}
			});
		}
	}

	// Creates and stores a user token in localStorage
	function signJwt(user: User) {
		const token = jwt.sign(userToObj(user), secretKey, {
			algorithm: 'HS256'
		});
		localStorage.setItem('jwt', token);
	}

	// Looks for a user token in localStorage, reads it and returns User
	function resolveJwt(): Promise<User> {
		return new Promise((resolve, reject) => {
			let user: User;
			try {
				let token = localStorage.getItem('jwt');
				user = token ? objToUser(jwt.verify(token, secretKey) as IJwtData) : null;
				if (user) {
					handleUserContext(user);
					resolve(user);
				}
			} catch (err) {
				reject(new Error('User token not found: ' + err.msg));
			}
		});
	}

	function handleUserContext(user?: User) {
		console.log(user ? 'Setting user preferences' : 'Clearing user preferences');
		setPlayers(user ? [user] : []);
		setUser(user || null);
		setUserEmail(user ? user.email : '');
		setHandSize(user ? user.handSize : null);
		setTilesSize(user ? user.tilesSize : null);
		setControlsSize(user ? user.controlsSize : null);
		setBackgroundColor(user ? user.backgroundColor : BackgroundColors.brown);
		setTableColor(user ? user.tableColor : null);
		setTileBackColor(user ? user.tileBackColor : null);
		setBackgroundColor(user ? user.backgroundColor : BackgroundColors.brown);
		setTableColor(user ? user.tableColor : null);
		setTileBackColor(user ? user.tileBackColor : null);
	}

	function login(user: User, existingJwt: boolean) {
		// if (!FBService.userAuthenticated()) {
		// 	console.log('Failed to log into firebase with email credentials -> logging in anonymously');
		// 	FBService.authLoginAnon().catch(err => {
		// 		console.log(err);
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
		localStorage.clear();
		sessionStorage.clear();
		deleteAllCookies();
		history.push(Pages.index);
		console.log('User logged out');
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
				tableTextColor,
				mainTextColor
			}}
			{...props}
		/>
	);
};
