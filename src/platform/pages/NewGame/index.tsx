import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ClearIcon from '@mui/icons-material/Clear';
import MoodIcon from '@mui/icons-material/Mood';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {
	Fade,
	FormControl,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Select
} from '@mui/material';
import { history } from 'App';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import UserSearchForm from 'platform/components/SearchForms/UserSearchForm';
import HomePage from 'platform/pages/Home/HomePage';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Row } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import { Fragment, useContext, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Page, PaymentType, Timeout, TransitionSpeed } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { User } from 'shared/models';
import { setGameId } from 'shared/store';
import GameOptions from './GameOptions';
import './newGame.scss';

const NewGame = () => {
	const { user, players, setPlayers, isLocalGame } = useContext(AppContext);
	const [mHu, setMHu] = useState(false);
	const [payment, setPayment] = useState(PaymentType.HALF_SHOOTER);
	const [random, setRandom] = useState(false);
	const [minTai, setMinTai] = useState(1);
	const [maxTai, setMaxTai] = useState(5);
	const [minTaiStr, setMinTaiStr] = useState('1');
	const [maxTaiStr, setMaxTaiStr] = useState('5');
	const [showOptions, setShowOptions] = useState(false);
	const [startedGame, setStartedGame] = useState(false);
	const playersRef = useRef<User[]>(players);
	const dispatch = useDispatch();

	function handleRemovePlayer(player: User) {
		function isNotUserToRemove(userToRemove: User) {
			return player.uN !== userToRemove.uN;
		}
		setPlayers(players.filter(isNotUserToRemove));
		setStartedGame(false);
	}

	async function startGame() {
		await ServiceInstance.initGame(user, players, random, minTai, maxTai, mHu, isLocalGame).then(game => {
			if (game?.id) {
				dispatch(setGameId(game.id));
				setStartedGame(true);
			}
		});
	}

	function handleStartJoinClick() {
		if (startedGame) {
			history.push(Page.TABLE);
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

	const renderManualHu = () => (
		<ListItem className="user list-item">
			<ListItemText secondary={`Manual Hu`} />
			<IconButton
				onClick={() => {
					setMHu(!mHu);
				}}
				style={{ justifyContent: 'flex-end', marginRight: -12 }}
				disableRipple
			>
				{mHu ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
			</IconButton>
		</ListItem>
	);

	const renderPaymentType = () => (
		<ListItem className="user list-item">
			<ListItemText secondary={payment === PaymentType.SHOOTER ? `Shooter` : `Half Shooter`} />
			<IconButton
				onClick={() => {
					setPayment(payment === PaymentType.SHOOTER ? PaymentType.HALF_SHOOTER : PaymentType.SHOOTER);
				}}
				style={{ justifyContent: 'flex-end', marginRight: -12 }}
				disableRipple
			>
				<SwapHorizIcon />
			</IconButton>
		</ListItem>
	);

	const handleMinTai = (event: React.ChangeEvent<HTMLInputElement>) => {
		let t = (event.target as HTMLInputElement).value;
		if (Number(t) < maxTai) {
			setMinTaiStr(t);
			setMinTai(Number(t));
		}
	};

	const handleMaxTai = (event: React.ChangeEvent<HTMLInputElement>) => {
		let t = (event.target as HTMLInputElement).value;
		if (Number(t) > minTai) {
			setMaxTaiStr(t);
			setMaxTai(Number(t));
		}
	};

	const renderTaiSelect = (label: string, valueStr: string, handleChange: (e) => void) => {
		const tai = [1, 2, 3, 4, 5].filter(t => (valueStr === minTaiStr ? t < maxTai : t > minTai));
		return (
			<ListItem className="user list-item">
				<ListItemText secondary={label} />
				<FormControl>
					{tai.length > 1 ? (
						<Select
							style={{ justifyContent: 'flex-end', marginRight: -8 }}
							value={valueStr}
							onChange={handleChange}
							disableUnderline
							variant="standard"
							IconComponent={() => null}
						>
							{tai.map(t => (
								<MenuItem
									key={`${label}-tai-${t}`}
									style={{ ...MuiStyles.small_dropdown_item }}
									value={t}
								>
									{t}
								</MenuItem>
							))}
						</Select>
					) : (
						<IconButton style={{ justifyContent: 'flex-end', marginRight: -5, fontSize: 16 }}>
							{valueStr}
						</IconButton>
					)}
				</FormControl>
			</ListItem>
		);
	};

	const renderRandomizeOption = () => (
		<Fade in={players.length === 4} timeout={{ enter: Timeout.SLOW }} unmountOnExit>
			<div>
				<ListItem className="user list-item">
					<ListItemText secondary={`Randomize`} />
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
			</div>
		</Fade>
	);

	const Options = () => (
		<List className="list">
			{renderManualHu()}
			{renderPaymentType()}
			{renderTaiSelect('Min Tai', minTaiStr, handleMinTai)}
			{renderTaiSelect('Max Tai', maxTaiStr, handleMaxTai)}
		</List>
	);

	const renderBottomButtons = () => (
		<Fade in timeout={20}>
			<div>
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
					<StyledButton
						label={'Options'}
						onClick={() => {
							setShowOptions(prev => !prev);
						}}
						disabled={startedGame}
					/>
					<Fade in={players.length === 4} timeout={Timeout.FAST}>
						<div id="start-join-btn">
							<StyledButton
								label={startedGame ? 'Join' : 'Start'}
								onClick={handleStartJoinClick}
								disabled={players.length < 4}
							/>
						</div>
					</Fade>
				</Row>
			</div>
		</Fade>
	);

	const markup = () => (
		<>
			<Title title="Create a new game" padding="5px" />
			<div className="panels">
				<div className="panel-segment">
					<UserSearchForm />
				</div>
				<div className="panel-segment padding-top">
					<List className="list">
						{players.map((player, index) => (
							<Fragment key={`player-${index}`}>
								{playersRef.current?.find(p => p?.uN === player?.uN) ? (
									renderUserOption(player)
								) : (
									<Fade in timeout={Timeout.FAST}>
										<div>{renderUserOption(player)}</div>
									</Fade>
								)}
							</Fragment>
						))}
					</List>
					{!startedGame && renderRandomizeOption()}
				</div>
			</div>
			<Fade in={showOptions} timeout={Timeout.FAST} unmountOnExit>
				<div>
					<GameOptions
						show={showOptions}
						onClose={() => {
							setShowOptions(false);
						}}
						Content={Options}
					/>
				</div>
			</Fade>
			{renderBottomButtons()}
		</>
	);

	return <HomePage markup={markup} />;
};

export default NewGame;
