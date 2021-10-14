import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ClearIcon from '@material-ui/icons/Clear';
import MoodIcon from '@material-ui/icons/Mood';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { history } from '../../App';
import { Loader } from '../../components/Loader';
import UserSearchForm from '../../components/SearchForms/UserSearchForm';
import { Pages, Status } from '../../global/enums';
import { HomeTheme } from '../../global/MuiStyles';
import { Main } from '../../global/StyledComponents';
import { HomeButton, StyledButton, Title } from '../../global/StyledMui';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import useSession from '../../util/hooks/useSession';
import './newGame.scss';

const NewGame = () => {
	const { verifyingSession } = useSession();
	const { user, players, setPlayers, setGameId } = useContext(AppContext);
	const showRandomize = useRef(players.length === 4);
	const [startedGame, setStartedGame] = useState(false);
	const [random, setRandom] = useState(true);
	const fadeTimeout = 500;

	useEffect(() => {
		showRandomize.current = players.length === 4 ? true : false;
	}, [players]);

	function handleRemovePlayer(player: User) {
		function isNotUserToRemove(userToRemove: User) {
			return player.username !== userToRemove.username;
		}
		setPlayers(players.filter(isNotUserToRemove));
		setStartedGame(false);
	}

	async function startGame() {
		await FBService.createGame(user, players, random).then(game => {
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
			setPlayers([user]);
		} else {
			startGame();
		}
	}

	const RandomizeOption = () => {
		return (
			<Fade in timeout={showRandomize.current ? 0 : 2 * fadeTimeout}>
				<ListItem className="user list-item">
					<ListItemText primary={`Randomize?`} />
					<IconButton
						onClick={() => {
							setRandom(!random);
						}}
						style={{ justifyContent: 'flex-end', marginRight: -12 }}
						disableRipple
					>
						{random ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
					</IconButton>
				</ListItem>
			</Fade>
		);
	};

	const markup = (
		<>
			<Title title="Create a new game" padding="5px" />
			<div className="panels">
				<div className="panel-segment">
					<UserSearchForm />
				</div>
				{/* <VerticalDivider /> */}
				<div className="panel-segment padding-top">
					<List className="list">
						{players.length > 0 &&
							players.map((player, index) => {
								let isUser = player?.username === user?.username;
								return (
									<React.Fragment key={`player-${index}`}>
										<Fade in timeout={isUser ? 0 : fadeTimeout}>
											<ListItem className="user list-item">
												<ListItemText primary={player?.username} />
												{isUser ? (
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
										</Fade>
									</React.Fragment>
								);
							})}
						{players.length === 4 && <RandomizeOption />}
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
