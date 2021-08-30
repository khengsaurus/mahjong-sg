import jwt from 'jsonwebtoken';
import { createContext, useState } from 'react';
import { history } from '../../App';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { objToUser, userToObj } from '../utilFns';

interface AppContextInt {
	user: User;
	userEmail: string;
	setUserEmail: (email: string) => void;
	login: (user: User) => void;
	logout: () => void;
	validateJWT: () => void;
	players: User[];
	setPlayers: (players: User[]) => void;
	gameId?: string;
	setGameId: (gameId: string) => void;
	selectedTiles?: TileI[];
	setSelectedTiles: (tiles: TileI[]) => void;
	loading: boolean;
	setLoading: () => void;
	handSize?: string;
	setHandSize?: (handSize: string) => void;
	tilesSize?: string;
	setTilesSize?: (tilesSize: string) => void;
	controlsSize?: string;
	setControlsSize?: (controlsSize: string) => void;
	backgroundColor?: string;
	setBackgroundColor?: (backgroundColor: string) => void;
	tileBackColor?: string;
	setTileBackColor?: (tileBackColor: string) => void;
	tableColor?: string;
	setTableColor?: (tileBackColor: string) => void;
}

const initialContext: AppContextInt = {
	user: null,
	userEmail: '',
	setUserEmail: (email: string) => {},
	login: (user: User) => {},
	logout: () => {},
	validateJWT: async () => {},
	players: [],
	setPlayers: (players: User[]) => {},
	gameId: null,
	setGameId: (gameId: string) => {},
	selectedTiles: [],
	setSelectedTiles: (tiles: TileI[]) => {},
	loading: false,
	setLoading: () => {},
	handSize: 'medium',
	setHandSize: (handSize: string) => {},
	tilesSize: 'medium',
	setTilesSize: (tilesSize: string) => {},
	controlsSize: 'medium',
	setControlsSize: (controlsSize: string) => {},
	backgroundColor: 'brown',
	setBackgroundColor: (backgroundColor: string) => {},
	tileBackColor: 'teal',
	setTileBackColor: (tileBackColor: string) => {},
	tableColor: 'rgb(190, 175, 155)',
	setTableColor: (tileBackColor: string) => {}
};

export const AppContext = createContext<AppContextInt>(initialContext);

export const AppContextProvider = (props: any) => {
	const [user, setUser] = useState<User>(null);
	const [userEmail, setUserEmail] = useState('');
	const [players, setPlayers] = useState<User[]>([user]);
	const [gameId, setGameId] = useState('');
	const [selectedTiles, setSelectedTiles] = useState<TileI[]>([]);
	const [loading, setLoading] = useState(false);
	const [handSize, setHandSize] = useState('medium');
	const [tilesSize, setTilesSize] = useState('medium');
	const [controlsSize, setControlsSize] = useState('medium');
	const [backgroundColor, setBackgroundColor] = useState('brown');
	const [tileBackColor, setTileBackColor] = useState('teal');
	const [tableColor, setTableColor] = useState('rgb(190, 175, 155)');
	const secretKey = 'shouldBeServerSideKey';

	async function validateJWT() {
		let token = localStorage.getItem('jwt');
		if (!FBService.userAuthenticated()) {
			history.push('/');
		}
		if (token) {
			var decoded = jwt.verify(token, secretKey);
			let user1: User = objToUser(1, decoded);
			if (!user || user.username !== user1.username) {
				await login(user1);
			}
		}
	}

	async function login(user: User) {
		const token = jwt.sign(userToObj(user), secretKey, {
			algorithm: 'HS256'
		});
		localStorage.setItem('jwt', token);
		if (!FBService.userAuthenticated()) {
			console.log('Failed to log into firebase with email credentials -> logging in anonymously');
			await FBService.authLoginAnon().catch(err => {
				console.log(err);
			});
		}
		setHandSize(user.handSize || 'medium');
		setTilesSize(user.tilesSize || 'medium');
		setControlsSize(user.controlsSize || 'medium');
		setBackgroundColor(user.backgroundColor || 'bisque');
		setTileBackColor(user.tileBackColor || 'teal');
		setTableColor(user.tableColor || 'rgb(190, 175, 155)');
		setPlayers([user]);
		setUser(user);
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
		setPlayers([]);
		setUser(null);
		setUserEmail('');
		localStorage.clear();
		sessionStorage.clear();
		deleteAllCookies();
		history.push('/');
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
				validateJWT,
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
				setTableColor
			}}
			{...props}
		/>
	);
};
