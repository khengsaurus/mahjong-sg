import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AddIcon from '@mui/icons-material/Add';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ClearIcon from '@material-ui/icons/Clear';
import MoodIcon from '@material-ui/icons/Mood';
import { history } from 'App';
import UserSearchForm from 'platform/components/SearchForms/UserSearchForm';
import HomePage from 'platform/pages/Home/HomePage';
import FBService from 'platform/service/MyFirebaseService';
import { Row } from 'platform/style/StyledComponents';
import { HomeButton, StyledButton, Title } from 'platform/style/StyledMui';
import { Fragment, useContext, useRef, useState } from 'react';
import { BotName, BotIds, Page, TransitionSpeed } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { User } from 'shared/models';
import './newGame.scss';

const NewGame = () => {
	const { user, players, setPlayers, setGameId } = useContext(AppContext);
	// const [offsetKeyboard, setOffsetKeyboard] = useState(44.5);
	const [startedGame, setStartedGame] = useState(false);
	const [random, setRandom] = useState(true);
	const playersRef = useRef<User[]>(players);
	const fadeTimeout = 300;

	// useEffect(() => {
	// 	const buttonsHeight = document.getElementById('bottom-btns')?.getBoundingClientRect()?.height;
	// 	setOffsetKeyboard(buttonsHeight);
	// }, []);

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

	function handleStartJoinClick() {
		if (startedGame) {
			history.push(Page.TABLE);
			setPlayers([user]);
		} else {
			startGame();
		}
	}

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

	const startButton = () => (
		<Fade in={players.length === 4} timeout={300}>
			<div id="start-join-btn">
				<StyledButton
					label={startedGame ? 'Join' : 'Start'}
					onClick={handleStartJoinClick}
					disabled={players.length < 4}
				/>
			</div>
		</Fade>
	);

	const renderBottomButtons = () => (
		<Fade in timeout={20}>
			<Row style={{ paddingTop: 5, transition: TransitionSpeed.FAST }} id="bottom-btns">
				<HomeButton
					style={{
						marginLeft:
							players?.length < 4
								? document.getElementById('start-join-btn')?.getBoundingClientRect()?.width || 64
								: 0,
						transition: TransitionSpeed.MEDIUM
					}}
				/>
				{startButton()}
			</Row>
		</Fade>
	);

	const generateBot = () => {
		const pIds = players.map(p => p.id);
		const availBots = BotIds.filter(b => !pIds.includes(b));
		const botIndex = Math.floor(Math.random() * (availBots.length - 0.01));
		const botId = availBots[botIndex];
		return new User(botId, BotName[botId] || 'Bot', '', '');
	};

	const renderAddBotButton = () => (
		<Fade in={players.length < 4} timeout={{ enter: 2 * fadeTimeout }} unmountOnExit>
			<ListItem className="user list-item">
				<ListItemText secondary={`Add bot`} />
				<IconButton
					onClick={() => {
						setPlayers([...players, generateBot()]);
					}}
					style={{ justifyContent: 'flex-end', marginRight: -12 }}
					disableRipple
				>
					<AddIcon />
				</IconButton>
			</ListItem>
		</Fade>
	);

	const renderRandomizeOption = () => (
		<Fade in={players.length === 4} timeout={{ enter: 2 * fadeTimeout }} unmountOnExit>
			<ListItem className="user list-item">
				<ListItemText secondary={`Randomize?`} />
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

	const markup = () => (
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
									<Fade in timeout={fadeTimeout}>
										{renderUserOption(player)}
									</Fade>
								)}
							</Fragment>
						))}
						{renderAddBotButton()}
						{renderRandomizeOption()}
					</List>
				</div>
			</div>
			{renderBottomButtons()}
		</>
	);

	return <HomePage markup={markup} />; // offsetKeyboard={offsetKeyboard + 18}
};

export default NewGame;
