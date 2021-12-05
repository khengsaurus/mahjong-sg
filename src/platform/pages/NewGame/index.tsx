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
import { history } from 'App';
import UserSearchForm from 'platform/components/SearchForms/UserSearchForm';
import HomePage from 'platform/pages/Home/HomePage';
import FBService from 'platform/service/MyFirebaseService';
import { HomeButton, StyledButton, Title } from 'platform/style/StyledMui';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Page } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { User } from 'shared/models';
import './newGame.scss';

const NewGame = () => {
	const { user, players, setPlayers, setGameId } = useContext(AppContext);
	const [startedGame, setStartedGame] = useState(false);
	const [random, setRandom] = useState(true);
	const showRandomize = useRef(players.length === 4);
	const playersRef = useRef<User[]>(players);
	const fadeTimeout = 500;

	useEffect(() => {
		showRandomize.current = players.length === 4 ? true : false;
		playersRef.current = players;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [players?.length]);

	function handleRemovePlayer(player: User) {
		function isNotUserToRemove(userToRemove: User) {
			return player.uN !== userToRemove.uN;
		}
		setPlayers(players.filter(isNotUserToRemove));
		setStartedGame(false);
	}

	async function startGame() {
		await FBService.createGame(user, players, random).then(game => {
			game.prepForNewRound(true);
			game.initRound();
			FBService.updateGame(game).then(() => {
				setGameId(game.id);
			});
			setStartedGame(true);
		});
	}

	function handleButtonClick() {
		if (startedGame) {
			history.push(Page.TABLE);
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

	// Note: to effect the animation, this cannot be returned as a FC
	const renderUserOption = (player: User) => (
		<ListItem className="user list-item">
			<ListItemText primary={player?.uN} />
			{player?.uN === user?.uN ? (
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
	);

	const Markup = () => (
		<>
			<Title title="Create a new game" padding="5px" />
			<div className="panels">
				<div className="panel-segment">
					<UserSearchForm />
				</div>
				{/* <VerticalDivider /> */}
				<div className="panel-segment padding-top">
					<List className="list">
						{players.map((player, index) => (
							<Fragment key={`player-${index}`}>
								{playersRef.current?.find(p => p?.uN === player?.uN) ? (
									renderUserOption(player)
								) : (
									<Fade in timeout={player?.uN === user?.uN ? 0 : fadeTimeout}>
										{renderUserOption(player)}
									</Fade>
								)}
							</Fragment>
						))}
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

	return <HomePage Markup={Markup} />;
};

export default NewGame;
