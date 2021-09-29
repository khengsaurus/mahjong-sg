import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import MoodIcon from '@material-ui/icons/Mood';
import { useContext, useEffect, useState } from 'react';
import { history } from '../../App';
import UserSearchForm from '../../components/SearchForms/UserSearchForm';
import { Pages, TextColors } from '../../global/enums';
import { HomeTheme } from '../../global/MuiStyles';
import { Main, VerticalDivider } from '../../global/StyledComponents';
import { HomeButton, Title } from '../../global/StyledMui';
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

	const useStyles = makeStyles((theme: ITheme) =>
		createStyles({
			text: {
				color: mainTextColor
			},
			disabledButton: {
				color: mainTextColor === TextColors.light ? 'grey !important' : null
			}
		})
	);
	const classes = useStyles();

	const markup = (
		<HomeTheme>
			<Main>
				<Title title="Create a new game" padding="5px" />
				<div className="panels">
					<UserSearchForm />
					<VerticalDivider />
					<div className="panel-segment padding-top">
						{/* <Title variant="subtitle1" title="Players:" padding="0px" /> */}
						<List className="list">
							{user &&
								players.length > 0 &&
								players.map(player => {
									return player ? (
										<ListItem className="user list-item" key={player.id}>
											<ListItemText primary={player.username} className={classes.text} />
											{player.username === user.username ? (
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
				<Button
					size="medium"
					variant="text"
					onClick={handleButtonClick}
					disabled={players.length < 4}
					classes={{ disabled: classes.disabledButton }}
				>
					{startedGame ? 'Join game' : 'Start game'}
				</Button>
				<HomeButton />
			</Main>
		</HomeTheme>
	);

	return user ? markup : <Login />;
};

export default NewGame;
