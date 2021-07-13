import jwt from 'jsonwebtoken';
import { createContext, useState } from 'react';
import { history } from '../../App';
import { Game } from '../../components/Models/Game';
import { User } from '../../components/Models/User';
import { getUserContacts } from '../../service/firebaseService';
import { processContactData, typeCheckUser, userToObj } from '../utilFns';

interface AppContextInt {
	user: User | null;
	login: (user: User) => void;
	logout: () => void;
	validateJWT: () => void;
	corres: User | null;
	setCorres: (corres: User | null) => void;
	players: User[];
	setPlayers: (players: User[]) => void;
	contacts: Map<string, User>;
	setContacts: (contacts: Map<string, User>) => void;
	game?: Game;
	setGame: (game: Game) => void;
}

const initialContext: AppContextInt = {
	user: null,
	login: (user: User) => {},
	logout: () => {},
	validateJWT: async () => {},
	corres: null,
	setCorres: (corres: User | null) => {},
	players: [],
	setPlayers: (players: User[]) => {},
	contacts: new Map(),
	setContacts: (contacts: Map<string, User>) => {},
	game: null,
	setGame: (game: Game) => {}
};

export const AppContext = createContext<AppContextInt>(initialContext);

export const AppContextProvider = (props: any) => {
	const [user, setUser] = useState<User | null>(null);
	const [corres, setCorres] = useState<User | null>(null);
	const [contacts, setContacts] = useState<Map<string, User>>(new Map());
	const [players, setPlayers] = useState<User[]>([user]);
	const [game, setGame] = useState<Game>(null);
	const secretKey = 'shouldBeServerSideKey';

	async function validateJWT() {
		let token = localStorage.getItem('jwt');
		if (token) {
			var decoded = await jwt.verify(token, secretKey);
			let user1: User = typeCheckUser(1, decoded);
			if (!user || user.username !== user1.username) {
				login(user1);
			}
		}
	}

	function login(user: User): void {
		const token = jwt.sign(userToObj(user), secretKey, {
			// expiresIn: 1800, // 30mins
			algorithm: 'HS256'
		});
		localStorage.setItem('jwt', token);
		setUser(user);
		setPlayers([user]);
		getUserContacts(user).then(contactData => {
			setContacts(processContactData(user, contactData));
		});
	}

	function logout(): void {
		console.log('logout clicked');
		localStorage.removeItem('jwt');
		setUser(null);
		history.push('/');
	}

	return (
		<AppContext.Provider
			value={{
				user,
				login,
				logout,
				validateJWT,
				corres,
				setCorres,
				players,
				setPlayers,
				contacts,
				setContacts,
				game,
				setGame
			}}
			{...props}
		/>
	);
};
