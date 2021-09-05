import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import MoodIcon from '@material-ui/icons/Mood';
import { useContext, useEffect, useState } from 'react';
import { history } from '../../App';
import HomeButton from '../../components/HomeButton';
import UserSearchForm from '../../components/SearchForms/UserSearchForm';
import { Pages } from '../../global/enums';
import { HomeTheme } from '../../global/MuiStyles';
import { Centered, Main } from '../../global/StyledComponents';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import Login from '../Login';
import './newGame.scss';

const NewGame = () => {
	const { user, handleUserState, players, setPlayers, setGameId, mainTextColor } = useContext(AppContext);
	const [startedGame, setStartedGame] = useState(false);

	useEffect(() => {
		if (!user) {
			handleUserState();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function handleRemovePlayer(player: User) {
		function isNotUserToRemove(userToRemove: User) {
			return player.username !== userToRemove.username;
		}
		setPlayers(players.filter(isNotUserToRemove));
		setStartedGame(false);
	}

	async function startGame() {
		console.log('Newgame - creator calling startGame');
		await FBService.createGame(user, players).then(game => {
			game.initRound();
			FBService.updateGame(game).then(() => {
				setGameId(game.id);
			});
			setStartedGame(true);
		});
	}

	function handleButtonClick() {
		if (startedGame) {
			history.push(Pages.table);
		} else {
			startGame();
		}
	}

	const markup = (
		<HomeTheme>
			<Main>
				<Centered>
					<Typography style={{ color: mainTextColor }} variant="h6">
						Create a new game
					</Typography>
					<div className="panel-segment">
						<UserSearchForm />
					</div>
					<div className="panel-segment">
						<Typography style={{ color: mainTextColor }} variant="subtitle1">
							Players:
						</Typography>
						<List className="list">
							{user &&
								players.length > 0 &&
								players.map(player => {
									return player ? (
										<ListItem
											style={{ color: mainTextColor }}
											className="user list-item"
											key={player.id}
										>
											<ListItemText style={{ color: mainTextColor }} primary={player.username} />
											{player.username === user.username ? (
												<IconButton
													disabled
													style={{
														color: mainTextColor,
														justifyContent: 'flex-end',
														paddingRight: '3px'
													}}
												>
													<MoodIcon />
												</IconButton>
											) : (
												<IconButton
													color="primary"
													onClick={() => handleRemovePlayer(player)}
													style={{ justifyContent: 'flex-end', paddingRight: '3px' }}
												>
													<ClearIcon />
												</IconButton>
											)}
										</ListItem>
									) : null;
								})}
						</List>
					</div>
					<br></br>
					<Button
						style={{ color: mainTextColor }}
						size="medium"
						variant="text"
						onClick={handleButtonClick}
						disabled={players.length < 4}
					>
						{startedGame ? 'Join game' : 'Start game'}
					</Button>
					<br></br>
					<HomeButton />
				</Centered>
			</Main>
		</HomeTheme>
	);

	return user ? markup : <Login />;
};

export default NewGame;
