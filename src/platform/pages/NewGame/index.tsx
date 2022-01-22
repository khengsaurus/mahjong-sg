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
	ListItemIcon,
	ListItemText,
	MenuItem,
	Select
} from '@mui/material';
import { history } from 'App';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import UserSearchForm from 'platform/components/SearchForms/UserSearchForm';
import { useAndroidKeyboardListener } from 'platform/hooks';
import HomePage from 'platform/pages/Home/HomePage';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Row } from 'platform/style/StyledComponents';
import { StyledButton, StyledText } from 'platform/style/StyledMui';
import { Fragment, useContext, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BotIds, LocalFlag, Page, PaymentType, Transition, TransitionSpeed } from 'shared/enums';
import { HandDescEng, ScoringHand } from 'shared/handEnums';
import { AppContext } from 'shared/hooks';
import { User } from 'shared/models';
import { ButtonText, HomeScreenText } from 'shared/screenTexts';
import { IStore, setGameId } from 'shared/store';
import { setTHK } from 'shared/store/actions';
import { getTileHashKey } from 'shared/util';
import './newGame.scss';

const NewGame = () => {
	const { user } = useSelector((state: IStore) => state);
	const { players, setPlayers } = useContext(AppContext);
	const { showBottom } = useAndroidKeyboardListener(true);
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

	const isLocalGame: boolean = useMemo(
		() => players.every(p => p.id === user.id || BotIds.includes(p.id)),
		[players, user]
	);

	function handleRemovePlayer(player: User) {
		function isNotUserToRemove(userToRemove: User) {
			return player.uN !== userToRemove.uN;
		}
		setPlayers(players.filter(isNotUserToRemove));
		setStartedGame(false);
	}

	async function startGame() {
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
				dispatch(setTHK(game.id === LocalFlag ? 111 : getTileHashKey(game.id, game.st)));
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

	const renderRandomizeOption = () => (
		<Fade in={players.length === 4} timeout={{ enter: Transition.MEDIUM }} unmountOnExit>
			<div>
				<ListItem className="list-item">
					<ListItemText secondary={`Randomize`} />
					<IconButton
						onClick={() => setRandom(!random)}
						style={{ justifyContent: 'flex-end', marginRight: -8 }}
						disableRipple
					>
						{random ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
					</IconButton>
				</ListItem>
			</div>
		</Fade>
	);

	const renderBottomButtons = () => (
		<Fade in={showBottom} timeout={20} unmountOnExit>
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
						disableShortcut
					/>
					<StyledButton
						label={ButtonText.OPTIONS}
						onClick={() => setShowOptions(prev => !prev)}
						disabled={startedGame}
					/>
					<Fade in={players.length === 4} timeout={Transition.FAST}>
						<div id="start-join-btn">
							<StyledButton
								label={startedGame ? ButtonText.JOIN : ButtonText.START}
								onClick={handleStartJoinClick}
								disabled={players.length < 4}
							/>
						</div>
					</Fade>
				</Row>
			</div>
		</Fade>
	);

	/* -------------------------------- Game Options -------------------------------- */

	const renderUserOption = (player: User) => (
		<ListItem className="list-item">
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
					style={{ justifyContent: 'flex-end', marginRight: -8 }}
					disableRipple
				>
					<ClearIcon />
				</IconButton>
			)}
		</ListItem>
	);

	const renderManualHu = () => (
		<ListItem className="list-item">
			<ListItemText secondary={`Manual Hu`} />
			<IconButton
				onClick={() => setMHu(!mHu)}
				style={{ justifyContent: 'flex-end', marginRight: -8 }}
				disableRipple
			>
				{mHu ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
			</IconButton>
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
		<ListItem className="list-item">
			<ListItemText
				secondary={
					payment === PaymentType.NONE ? `None` : payment === PaymentType.SHOOTER ? `Shooter` : `Half Shooter`
				}
			/>
			<IconButton
				onClick={rotatePaymentType}
				style={{ justifyContent: 'flex-end', marginRight: -8 }}
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
			<ListItem className="list-item">
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

	const renderScoringHandOption = (s: ScoringHand) => (
		<ListItem className="list-item">
			<ListItemText secondary={HandDescEng[s]} />
			<IconButton
				onClick={() => setScoringHands({ ...scoringHands, [s]: !scoringHands[s] })}
				style={{ justifyContent: 'flex-end', marginRight: -8 }}
				disableRipple
			>
				{scoringHands[s] ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
			</IconButton>
		</ListItem>
	);

	const renderGameOptions = () => {
		return (
			<Fade in={showOptions && showBottom} timeout={Transition.FAST} unmountOnExit>
				<div>
					<Dialog
						open={showOptions}
						BackdropProps={{ invisible: true }}
						onClose={() => {
							setShowOptions(false);
						}}
					>
						<DialogContent>
							<List className="list">
								{renderManualHu()}
								{renderPaymentType()}
								{renderTaiSelect(ButtonText.MINTAI, minTaiStr, handleMinTai)}
								{renderTaiSelect(ButtonText.MAXTAI, maxTaiStr, handleMaxTai)}
								{renderScoringHandOption(ScoringHand.CONCEALED)}
								{renderScoringHandOption(ScoringHand.SEVEN)}
								{renderScoringHandOption(ScoringHand.GREEN)}
							</List>
						</DialogContent>
					</Dialog>
				</div>
			</Fade>
		);
	};
	/* ------------------------------ End Game Options ------------------------------ */

	const markup = () => (
		<>
			<StyledText text={HomeScreenText.NEW_GAME_TITLE} padding="5px" />
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

	return <HomePage markup={markup} />;
};

export default NewGame;
