import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ClearIcon from '@mui/icons-material/Clear';
import MoodIcon from '@mui/icons-material/Mood';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {
	Dialog,
	DialogContent,
	Fade,
	FormControl,
	IconButton,
	List,
	ListItem,
	ListItemText,
	MenuItem,
	Select
} from '@mui/material';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import UserSearchForm from 'platform/components/SearchForms/UserSearchForm';
import HomePage from 'platform/pages/Home/HomePage';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles, TableTheme } from 'platform/style/MuiStyles';
import { Centered, Row } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { Fragment, useContext, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LocalFlag, Page, PaymentType, Status, Transition, TransitionSpeed } from 'shared/enums';
import { HandDescEng, ScoringHand } from 'shared/handEnums';
import { AppContext, useAsync } from 'shared/hooks';
import { User } from 'shared/models';
import { ButtonText, HomeScreenText, PaymentLabel, ScreenTextEng } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { setGameId, setTHK } from 'shared/store/actions';
import { getTileHashKey, isBot } from 'shared/util';
import './newGame.scss';

const NewGame = () => {
	const { navigate, players, setPlayers } = useContext(AppContext);
	const { user } = useSelector((state: IStore) => state);
	const [mHu, setMHu] = useState(false);
	const [payment, setPayment] = useState(PaymentType.SHOOTER);
	const [random, setRandom] = useState(false);
	const [minTai, setMinTai] = useState(1);
	const [maxTai, setMaxTai] = useState(5);
	const [minTaiStr, setMinTaiStr] = useState('1');
	const [maxTaiStr, setMaxTaiStr] = useState('5');
	const [showOptions, setShowOptions] = useState(false);
	const [startedGame, setStartedGame] = useState(false);
	const [scoringHands, setScoringHands] = useState<IObj<ScoringHand, boolean>>({
		[ScoringHand.CONCEALED]: true,
		[ScoringHand.SEVEN]: true,
		[ScoringHand.GREEN]: true
	});
	const playersRef = useRef<User[]>(players);
	const dispatch = useDispatch();

	const isLocalGame: boolean = useMemo(() => players.every(p => p.id === user.id || isBot(p.id)), [players, user]);

	function handleRemovePlayer(player: User) {
		function isNotUserToRemove(userToRemove: User) {
			return player.uN !== userToRemove.uN;
		}
		setPlayers(players.filter(isNotUserToRemove));
		setStartedGame(false);
	}

	const { execute: startGame, status } = useAsync(async () => {
		const excludeShs = Object.keys(scoringHands).filter(s => scoringHands[s] === false) as ScoringHand[];
		await ServiceInstance.initGame(
			user,
			players,
			random,
			minTai,
			maxTai,
			mHu,
			payment,
			excludeShs,
			isLocalGame
		).then(game => {
			if (game?.id) {
				dispatch(setTHK(game.id === LocalFlag ? 111 : getTileHashKey(game.id, game.n[0])));
				dispatch(setGameId(game.id));
				setStartedGame(true);
			}
		});
	}, false);

	async function handleStartJoinClick() {
		if (startedGame) {
			navigate(Page.TABLE);
		} else if (status !== Status.PENDING) {
			startGame();
		}
	}

	const renderRandomizeOption = () => (
		<Fade in={players.length === 4} timeout={{ enter: Transition.MEDIUM }} unmountOnExit>
			<div>
				<ListItem className="list-item">
					<ListItemText primary={`Randomize`} />
					<Centered style={{ width: 30 }}>
						<IconButton onClick={() => setRandom(!random)} disabled={players.length !== 4} disableRipple>
							{random ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
						</IconButton>
					</Centered>
				</ListItem>
			</div>
		</Fade>
	);

	const renderBottomButtons = () => (
		<Row style={{ paddingTop: 5, transition: TransitionSpeed.FAST }} id="bottom-btns">
			<HomeButton
				style={{
					marginLeft:
						players?.length < 4
							? document.getElementById('start-join-btn')?.getBoundingClientRect()?.width || 64
							: 0,
					paddingBottom: 0,
					transition: TransitionSpeed.MEDIUM
				}}
				disableShortcut
			/>
			<StyledButton
				label={ButtonText.OPTIONS}
				onClick={() => setShowOptions(prev => !prev)}
				padding="10px 10px 0px"
				disabled={startedGame}
			/>
			<Fade in={players.length === 4} timeout={Transition.FAST}>
				<div id="start-join-btn">
					<StyledButton
						label={startedGame ? ButtonText.JOIN : ButtonText.START}
						onClick={handleStartJoinClick}
						padding="10px 10px 0px"
						disabled={players.length < 4 || status === Status.PENDING}
					/>
				</div>
			</Fade>
		</Row>
	);

	/* -------------------------------- Game Options -------------------------------- */

	const renderUserOption = (player: User) => (
		<ListItem className="list-item">
			<ListItemText primary={player?.uN} />
			<Centered style={{ width: 30 }}>
				{player?.uN === user?.uN ? (
					<MoodIcon color="primary" />
				) : (
					<IconButton onClick={() => handleRemovePlayer(player)} disableRipple>
						<ClearIcon />
					</IconButton>
				)}
			</Centered>
		</ListItem>
	);

	const renderManualHu = () => (
		<ListItem className="list-item" style={{ padding: 0 }}>
			<ListItemText secondary={ScreenTextEng.MANUAL_HU} />
			<Centered style={{ width: 20 }}>
				<IconButton onClick={() => setMHu(!mHu)} disableRipple>
					{mHu ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
				</IconButton>
			</Centered>
		</ListItem>
	);

	function rotatePaymentType() {
		setPayment(
			payment === PaymentType.SHOOTER
				? PaymentType.HALF_SHOOTER
				: payment === PaymentType.HALF_SHOOTER
				? PaymentType.NONE
				: PaymentType.SHOOTER
		);
	}

	const renderPaymentType = () => (
		<ListItem className="list-item" style={{ padding: 0 }}>
			<ListItemText
				secondary={
					payment === PaymentType.NONE
						? PaymentLabel.n
						: payment === PaymentType.SHOOTER
						? PaymentLabel.s
						: PaymentLabel.h
				}
			/>
			<Centered style={{ width: 20 }}>
				<IconButton onClick={rotatePaymentType} disableRipple>
					<SwapHorizIcon />
				</IconButton>
			</Centered>
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
			<ListItem className="list-item" style={{ padding: 0 }}>
				<ListItemText secondary={label} />
				<FormControl>
					<Centered style={{ width: 20 }}>
						{tai.length > 1 ? (
							<Select
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
							<IconButton style={{ fontSize: 16 }}>{valueStr}</IconButton>
						)}
					</Centered>
				</FormControl>
			</ListItem>
		);
	};

	const renderScoringHandOption = (s: ScoringHand) => (
		<ListItem className="list-item" style={{ padding: 0 }}>
			<ListItemText secondary={HandDescEng[s]} />
			<Centered style={{ width: 20 }}>
				<IconButton onClick={() => setScoringHands({ ...scoringHands, [s]: !scoringHands[s] })} disableRipple>
					{scoringHands[s] ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
				</IconButton>
			</Centered>
		</ListItem>
	);

	const renderGameOptions = () => {
		return (
			<Fade in={showOptions} timeout={Transition.FAST} unmountOnExit>
				<div>
					<TableTheme>
						<Dialog
							open={showOptions}
							BackdropProps={{ invisible: true }}
							onClose={() => {
								setShowOptions(false);
							}}
						>
							<DialogContent style={{ paddingBottom: '10px' }}>
								<List className="list">
									{renderManualHu()}
									{renderPaymentType()}
									{renderTaiSelect(ScreenTextEng.MINTAI, minTaiStr, handleMinTai)}
									{renderTaiSelect(ScreenTextEng.MAXTAI, maxTaiStr, handleMaxTai)}
									{renderScoringHandOption(ScoringHand.CONCEALED)}
									{renderScoringHandOption(ScoringHand.SEVEN)}
									{renderScoringHandOption(ScoringHand.GREEN)}
								</List>
							</DialogContent>
						</Dialog>
					</TableTheme>
				</div>
			</Fade>
		);
	};
	/* ------------------------------ End Game Options ------------------------------ */

	const markup = () => (
		<>
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
									<Fade in timeout={Transition.FAST}>
										<div>{renderUserOption(player)}</div>
									</Fade>
								)}
							</Fragment>
						))}
					</List>
					{!startedGame && renderRandomizeOption()}
				</div>
			</div>
			{renderGameOptions()}
			{renderBottomButtons()}
		</>
	);

	return <HomePage markup={markup} title={HomeScreenText.NEW_GAME_TITLE} misc={3} />;
};

export default NewGame;
