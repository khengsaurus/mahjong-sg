import { Button, IconButton, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import MoodIcon from '@material-ui/icons/Mood';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { history } from '../../App';
import HomeButton from '../../components/HomeButton';
import UserSearchForm from '../../components/SearchForms/UserSearchForm';
import { User } from '../../Models/User';
import FBService from '../../service/FirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { setGame } from '../../util/store/actions';
import Login from '../Login';
import './NewGame.scss';

const NewGame = () => {
	const dispatch = useDispatch();
	const [startedGame, setStartedGame] = useState(false);
	const { user, validateJWT, players, setPlayers, setGameId } = useContext(AppContext);

	useEffect(() => {
		if (!user) {
			validateJWT();
		}
	}, [user]);

	function handleRemovePlayer(player: User) {
		function isNotUserToRemove(userToRemove: User) {
			return player.username !== userToRemove.username;
		}
		setPlayers(players.filter(isNotUserToRemove));
	}

	async function startGame() {
		console.log('Newgame - creator calling startGame');
		await FBService.createGame(user, players).then(game => {
			game.initRound().then(() => {
				FBService.updateGame(game).then(() => {
					dispatch(setGame(game));
					setGameId(game.id);
				});
				setStartedGame(true);
			});
		});
	}

	function handleButtonClick() {
		if (startedGame) {
			history.push('/Table');
		} else {
			startGame();
		}
	}

	let markup = (
		<div className="main">
			<div className="new-game-panel">
				<Typography variant="h6">Create a new game</Typography>
				<div className="panel-row">
					<div className="panel-segment">
						<UserSearchForm />
					</div>
					<div className="panel-segment right">
						<Typography variant="subtitle1">Players:</Typography>
						<List className="list">
							{user &&
								players.length > 0 &&
								players.map(player => {
									return player ? (
										<ListItem className="list-item" key={player.id}>
											<ListItemText primary={player.username} />
											{player.username === user.username ? (
												<IconButton color="primary" disabled={true}>
													<MoodIcon />
												</IconButton>
											) : (
												<IconButton color="primary" onClick={() => handleRemovePlayer(player)}>
													<ClearIcon />
												</IconButton>
											)}
										</ListItem>
									) : null;
								})}
						</List>
					</div>
				</div>

				<div className="button-container">
					<HomeButton />
					<Button
						className="margin-left"
						size="small"
						variant="outlined"
						onClick={handleButtonClick}
						disabled={players.length < 4}
					>
						{startedGame ? 'Join game' : 'Start game'}
					</Button>
				</div>
			</div>
		</div>
	);

	return user ? markup : <Login />;
};

export default NewGame;
