import { IconButton, Button, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import MoodIcon from '@material-ui/icons/Mood';
import React, { useContext, useEffect } from 'react';
import { history } from '../../App';
import HomeButton from '../../components/HomeButton';
import UserSearchForm from '../../components/UserSearchForm';
import { AppContext } from '../../util/hooks/AppContext';
import Login from '../Login';
import * as firebaseService from '../../service/firebaseService';
import { User } from '../../components/Models/User';
import './NewGame.scss';

const NewGame = () => {
	const { user, validateJWT, players, setPlayers, setGame } = useContext(AppContext);

	useEffect(() => {
		validateJWT();
	}, [validateJWT]);

	const handleRemovePlayer = (player: User) => {
		function isNotUserToRemove(userToRemove: User) {
			return player.username !== userToRemove.username;
		}
		setPlayers(players.filter(isNotUserToRemove));
	};

	const handleStartGame = async () => {
		await firebaseService.createGame(players).then(game => {
			setGame(game);
		});
		history.push('/Table');
	};

	let markup = (
		<div className="main">
			<Typography variant="h6">Create a new game</Typography>
			<UserSearchForm />
			<br></br>
			<Typography variant="subtitle1">Players:</Typography>
			<List
				component="div"
				aria-labelledby="users-found"
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '120px',
					marginBottom: '10px'
				}}
			>
				{user &&
					players.length > 0 &&
					players.map(player => {
						return player ? (
							<ListItem key={player.id} style={{ padding: 0, height: '35px' }}>
								<ListItemText primary={player.username || ''} />
								{player.username === user.username ? (
									<IconButton color="primary" aria-label="Remove player" disabled={true}>
										<MoodIcon />
									</IconButton>
								) : (
									<IconButton
										color="primary"
										aria-label="Remove player"
										onClick={() => handleRemovePlayer(player)}
									>
										<ClearIcon />
									</IconButton>
								)}
							</ListItem>
						) : null;
					})}
			</List>
			<Button size="small" variant="outlined" onClick={handleStartGame} disabled={players.length < 4}>
				Start game
			</Button>
			<br></br>
			<HomeButton />
		</div>
	);

	return user ? markup : <Login />;
};

export default NewGame;
