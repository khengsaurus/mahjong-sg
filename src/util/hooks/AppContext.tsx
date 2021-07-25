import firebase from 'firebase/app';
import jwt from 'jsonwebtoken';
import { createContext, useState } from 'react';
import { history } from '../../App';
import { User } from '../../Models/User';
import { AuthService } from '../../service/auth';
import { typeCheckUser, userToObj } from '../utilFns';

interface AppContextInt {
	user: User | null;
	authToken: firebase.auth.UserCredential | null;
	setAuthToken: (token: firebase.auth.UserCredential) => void;
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
	authToken: null,
	setAuthToken: (token: firebase.auth.UserCredential) => {},
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
	const [authToken, setAuthToken] = useState<firebase.auth.UserCredential>(null);
	const [players, setPlayers] = useState<User[]>([user]);
	const [gameId, setGameId] = useState('');
	const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
	const secretKey = 'shouldBeServerSideKey';

	async function validateJWT() {
		let token = localStorage.getItem('jwt');
		if (token) {
			var decoded = await jwt.verify(token, secretKey);
			let user1: User = typeCheckUser(1, decoded);
			if (!user || !authToken || user.username !== user1.username) {
				await login(user1);
			}
		}
	}

	async function login(user: User) {
		const token = await jwt.sign(userToObj(user), secretKey, {
			// expiresIn: 1800, // 30mins
			algorithm: 'HS256'
		});
		localStorage.setItem('jwt', token);
		await AuthService.loginAnon()
			.then((token: firebase.auth.UserCredential) => {
				setAuthToken(token);
				setPlayers([user]);
				setUser(user);
			})
			.catch(err => {
				console.log(err);
			});
	}

	function logout(): void {
		setAuthToken(null);
		setPlayers([]);
		setUser(null);
		localStorage.removeItem('jwt');
		history.push('/');
		console.log('User logged out');
	}

	return (
		<AppContext.Provider
			value={{
				user,
				authToken,
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
