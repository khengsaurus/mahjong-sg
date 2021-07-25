import jwt from 'jsonwebtoken';
import { createContext, useState } from 'react';
import { history } from '../../App';
import { User } from '../../Models/User';
import FBService from '../../service/FirebaseService';
import { typeCheckUser, userToObj } from '../utilFns';

interface AppContextInt {
	user: User;
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
	const [players, setPlayers] = useState<User[]>([user]);
	const [gameId, setGameId] = useState('');
	const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
	const [loading, setLoading] = useState(false);
	const secretKey = 'shouldBeServerSideKey';

	async function validateJWT() {
		// setLoading(true);
		let token = localStorage.getItem('jwt');
		if (token) {
			var decoded = await jwt.verify(token, secretKey);
			let user1: User = typeCheckUser(1, decoded);
			if (!user || user.username !== user1.username) {
				await login(user1);
			}
		}
		// setLoading(false);
	}

	async function login(user: User) {
		// setLoading(true);
		const token = await jwt.sign(userToObj(user), secretKey, {
			// expiresIn: 1800, // 30mins
			algorithm: 'HS256'
		});
		localStorage.setItem('jwt', token);
		await FBService.loginAnon().catch(err => {
			console.log(err);
		});
		setPlayers([user]);
		setUser(user);
		// setLoading(false);
	}

	function logout(): void {
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
