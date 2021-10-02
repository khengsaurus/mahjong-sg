import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ClearIcon from '@material-ui/icons/Clear';
import MoodIcon from '@material-ui/icons/Mood';
import { useContext, useState } from 'react';
import { history } from '../../App';
import { Loader } from '../../components/Loader';
import UserSearchForm from '../../components/SearchForms/UserSearchForm';
import { Pages, Status } from '../../global/enums';
import { HomeTheme } from '../../global/MuiStyles';
import { Main, VerticalDivider } from '../../global/StyledComponents';
import { HomeButton, StyledButton, Title } from '../../global/StyledMui';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import useSession from '../../util/hooks/useSession';
import './newGame.scss';

const NewGame = () => {
	const { verifyingSession } = useSession();
	const { user, players, setPlayers, setGameId } = useContext(AppContext);
	const [startedGame, setStartedGame] = useState(false);

	function handleRemovePlayer(player: User) {
		function isNotUserToRemove(userToRemove: User) {
			return player.username !== userToRemove.username;
		}
		setPlayers(players.filter(isNotUserToRemove));
		setStartedGame(false);
	}

	async function startGame() {
		// console.log('Newgame - creator calling startGame');
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
			history.push(Pages.TABLE);
		} else {
			startGame();
		}
	}

	const markup = (
		<>
			<Title title="Create a new game" padding="5px" />
			<div className="panels">
				<UserSearchForm />
				<VerticalDivider />
				<div className="panel-segment padding-top">
					<List className="list">
						{players.length > 0 &&
							players.map(player => {
								return player ? (
									<ListItem className="user list-item" key={player.id}>
										<ListItemText primary={player.username} />
										{player.username === user?.username ? (
											<ListItemIcon
												style={{
													justifyContent: 'flex-end'
												}}
											>
												<MoodIcon color="primary" />
											</ListItemIcon>
										) : (
											<IconButton
												onClick={() => handleRemovePlayer(player)}
												style={{ justifyContent: 'flex-end', marginRight: -12 }}
												disableRipple
											>
												<ClearIcon />
											</IconButton>
										)}
									</ListItem>
								) : null;
							})}
					</List>
				</div>
			</div>
			<StyledButton
				label={startedGame ? 'Join game' : 'Start game'}
				onClick={handleButtonClick}
				disabled={players.length < 4}
			/>
			<HomeButton />
		</>
	);

	return (
		<HomeTheme>
			<Main>{verifyingSession === Status.PENDING ? <Loader /> : markup}</Main>
		</HomeTheme>
	);
};

export default NewGame;
