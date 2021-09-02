import jwt from 'jsonwebtoken';
import { createContext, useState } from 'react';
import { history } from '../../App';
import { BackgroundColors, Pages, Sizes, TextColors, TileColors } from '../../Globals';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { objToUser, userToObj } from '../utilFns';

interface AppContextInt {
	user: User;
	userEmail: string;
	setUserEmail: (email: string) => void;
	login: (user: User, existingJwt: boolean) => void;
	logout: () => void;
	handleUserState: () => void;
	players: User[];
	setPlayers: (players: User[]) => void;
	gameId?: string;
	setGameId: (gameId: string) => void;
	selectedTiles?: TileI[];
	setSelectedTiles: (tiles: TileI[]) => void;
	loading: boolean;
	setLoading: () => void;
	handSize?: Sizes;
	setHandSize?: (handSize: Sizes) => void;
	tilesSize?: Sizes;
	setTilesSize?: (tilesSize: Sizes) => void;
	controlsSize?: Sizes;
	setControlsSize?: (controlsSize: Sizes) => void;
	backgroundColor?: BackgroundColors;
	setBackgroundColor?: (backgroundColor: BackgroundColors) => void;
	tableColor?: BackgroundColors;
	setTableColor?: (tableColor: BackgroundColors) => void;
	tileBackColor?: TileColors;
	setTileBackColor?: (tileBackColor: TileColors) => void;
	theme?: Theme;
	setTheme?: (theme: Theme) => void;
}

const initialContext: AppContextInt = {
	user: null,
	userEmail: '',
	setUserEmail: (email: string) => {},
	login: (user: User, existingJwt: boolean) => {},
	logout: () => {},
	handleUserState: async () => {},
	players: [],
	setPlayers: (players: User[]) => {},
	gameId: null,
	setGameId: (gameId: string) => {},
	selectedTiles: [],
	setSelectedTiles: (tiles: TileI[]) => {},
	loading: false,
	setLoading: () => {},
	handSize: Sizes.medium,
	setHandSize: (handSize: string) => {},
	tilesSize: Sizes.medium,
	setTilesSize: (tilesSize: string) => {},
	controlsSize: Sizes.medium,
	setControlsSize: (controlsSize: string) => {},
	backgroundColor: BackgroundColors.darkBrown,
	setBackgroundColor: (backgroundColor: string) => {},
	tableColor: BackgroundColors.lightBrown,
	setTableColor: (tileBackColor: string) => {},
	tileBackColor: TileColors.teal,
	setTileBackColor: (tileBackColor: string) => {},
	theme: {
		backgroundColor: null,
		tableColor: null,
		tileBackColor: null,
		textColor: null
	},
	setTheme: (theme: Theme) => {}
};

export const AppContext = createContext<AppContextInt>(initialContext);

export const AppContextProvider = (props: any) => {
	const [user, setUser] = useState<User>(null);
	const [userEmail, setUserEmail] = useState('');
	const [players, setPlayers] = useState<User[]>([user]);
	const [gameId, setGameId] = useState('');
	const [selectedTiles, setSelectedTiles] = useState<TileI[]>([]);
	const [loading, setLoading] = useState(false);
	const [handSize, setHandSize] = useState<Sizes>();
	const [tilesSize, setTilesSize] = useState<Sizes>();
	const [controlsSize, setControlsSize] = useState<Sizes>();
	const [backgroundColor, setBackgroundColor] = useState<BackgroundColors>(BackgroundColors.darkBrown);
	const [tableColor, setTableColor] = useState<BackgroundColors>();
	const [tileBackColor, setTileBackColor] = useState<TileColors>();
	const [theme, setTheme] = useState({
		backgroundColor,
		tableColor,
		tileBackColor,
		textColor:
			backgroundColor === BackgroundColors.dark ||
			backgroundColor === BackgroundColors.darker ||
			tableColor === BackgroundColors.dark ||
			tableColor === BackgroundColors.darker
				? TextColors.light
				: TextColors.dark
	});
	const secretKey = 'shouldBeServerSideKey';

	async function handleUserState() {
		let verifiedUser = resolveJwt();
		if (!FBService.userAuthenticated()) {
			logout();
		} else if ((!user && verifiedUser) || (user && user.username !== verifiedUser.username)) {
			login(verifiedUser, true);
		} else {
			logout();
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
	function resolveJwt() {
		try {
			let token = localStorage.getItem('jwt');
			return token ? objToUser(jwt.verify(token, secretKey) as JwtData) : null;
		} catch (err) {
			console.log('User token not found');
			return null;
		}
	}

	function handleUserContext(user?: User) {
		console.log(user ? 'Setting user preferences' : 'Clearing user preferences');
		setPlayers(user ? [user] : []);
		setUser(user || null);
		setUserEmail(user ? user.email : '');
		setHandSize(user ? user.handSize : null);
		setTilesSize(user ? user.tilesSize : null);
		setControlsSize(user ? user.controlsSize : null);
		setBackgroundColor(user ? user.backgroundColor : BackgroundColors.darkBrown);
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
				theme,
				setTheme
			}}
			{...props}
		/>
	);
};
