import jwt from 'jsonwebtoken';
import { createContext, useState } from 'react';
import { history } from '../../App';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { typeCheckUser, userToObj } from '../utilFns';

interface AppContextInt {
	user: User;
	userEmail: string;
	setUserEmail: (email: string) => void;
	loading: boolean;
	login: (user: User) => void;
	logout: () => void;
	validateJWT: () => void;
	players: User[];
	setPlayers: (players: User[]) => void;
	gameId?: string;
	setGameId: (gameId: string) => void;
	selectedTiles?: Tile[];
	setSelectedTiles: (tiles: Tile[]) => void;
}

const initialContext: AppContextInt = {
	user: null,
	userEmail: '',
	setUserEmail: (email: string) => {},
	loading: false,
	login: (user: User) => {},
	logout: () => {},
	validateJWT: async () => {},
	players: [],
	setPlayers: (players: User[]) => {},
	gameId: null,
	setGameId: (gameId: string) => {},
	selectedTiles: [],
	setSelectedTiles: (tiles: Tile[]) => {}
};

export const AppContext = createContext<AppContextInt>(initialContext);

export const AppContextProvider = (props: any) => {
	const [user, setUser] = useState<User>(null);
	const [userEmail, setUserEmail] = useState('');
	const [players, setPlayers] = useState<User[]>([user]);
	const [gameId, setGameId] = useState('');
	const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
	const [loading, setLoading] = useState(false);
	const secretKey = 'shouldBeServerSideKey';

	async function validateJWT() {
		let token = localStorage.getItem('jwt');
		if (!FBService.userAuthenticated()) {
			history.push('/');
		}
		if (token) {
			var decoded = await jwt.verify(token, secretKey);
			let user1: User = typeCheckUser(1, decoded);
			if (!user || user.username !== user1.username) {
				await login(user1);
			}
		}
	}

	async function login(user: User) {
		const token = await jwt.sign(userToObj(user), secretKey, {
			algorithm: 'HS256'
		});
		localStorage.setItem('jwt', token);
		if (!FBService.userAuthenticated()) {
			console.log('Logging into firebase anonymously');
			await FBService.loginAnon().catch(err => {
				console.log(err);
			});
		}
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
		FBService.logout();
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
				loading,
				login,
				logout,
				validateJWT,
				players,
				setPlayers,
				gameId,
				setGameId,
				selectedTiles,
				setSelectedTiles
			}}
			{...props}
		/>
	);
};
