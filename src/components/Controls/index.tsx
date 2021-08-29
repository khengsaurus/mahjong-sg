import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SettingsIcon from '@material-ui/icons/Settings';
import SubjectIcon from '@material-ui/icons/Subject';
import isEmpty from 'lodash.isempty';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { history } from '../../App';
import { Game } from '../../models/Game';
import { User } from '../../models/User';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { findLeft, scrollToBottomOfDiv, sortTiles } from '../../util/utilFns';
import Announcement from './Announcement';
import './ControlsLarge.scss';
import './ControlsMedium.scss';
import './ControlsSmall.scss';
import HuDialog from './HuDialog';
import LogBox from './LogBox';
import PaymentWindow from './PaymentWindow';
import SettingsWindow from './SettingsWindow';

interface ControlsProps {
	playerSeat?: number;
}

const Controls = (props: ControlsProps) => {
	const { playerSeat } = props;
	const { controlsSize, selectedTiles, setSelectedTiles } = useContext(AppContext);
	const [meld, setMeld] = useState<TileI[]>([]);
	const [canChi, setCanChi] = useState(false);
	const [canPong, setCanPong] = useState(false);
	const [canKang, setCanKang] = useState(false);
	const [showPay, setShowPay] = useState(false);
	const [showLogs, setShowLogs] = useState(false);
	const [okToShow, setOkToShow] = useState(false);
	const [declareHu, setDeclareHu] = useState(false);
	const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>(null);
	const [showSettings, setShowSettings] = useState(false);

	const game: Game = useSelector((state: Store) => state.game);
	const player: User = useSelector((state: Store) => state.player);
	const { players, dealer, lastThrown, thrownBy, takenTile, whoseMove, tiles, logs } = game;

	useEffect(() => {
		if (player && player.showTiles) {
			showHuDialog();
		}
	}, []);

	/* ----------------------------------- Util ----------------------------------- */

	function setOptions(kang: boolean, pong: boolean, chi: boolean, tiles: TileI[]) {
		setCanKang(kang);
		setCanPong(pong);
		setCanChi(chi);
		setMeld(tiles);
	}

	const tilesLeft: number = useMemo(() => {
		return tiles.length;
	}, [tiles]);

	const lastThrownAvailable: boolean = useMemo(() => {
		return !isEmpty(lastThrown) && !takenTile && players[thrownBy].lastDiscardedTileIs(lastThrown);
	}, [players, lastThrown, thrownBy, takenTile]);

	const isHoldingLastThrown: boolean = useMemo(() => {
		return (
			!isEmpty(lastThrown) &&
			player &&
			player.allHiddenTilesContain(lastThrown) &&
			!players[thrownBy].lastDiscardedTileIs(lastThrown)
		);
	}, [player, players, lastThrown, thrownBy]);

	const playerWind: string = useMemo(() => {
		switch ((playerSeat - dealer + 4) % 4) {
			case 0:
				return '東';
			case 1:
				return '南';
			case 2:
				return '西';
			case 3:
				return '北';
			default:
				return '';
		}
	}, [playerSeat, dealer]);

	function handleShowLogs() {
		setShowLogs(!showLogs);
		setTimeout(function () {
			scrollToBottomOfDiv('logs');
		}, 200);
	}

	function setShowTimeout() {
		setTimeoutId(
			setTimeout(function () {
				setOkToShow(false);
			}, 2000)
		);
	}

	function handleShow() {
		if (okToShow) {
			clearTimeout(timeoutId);
		}
		setOkToShow(true);
		setShowTimeout();
	}

	/* ----------------------------------- useEffect to set options ----------------------------------- */

	useEffect(() => {
		let tiles: TileI[] = [];
		/**
		 * Can self kang during turn & selecting 1 || 4 */
		if (whoseMove === playerSeat && (selectedTiles.length === 1 || selectedTiles.length === 4)) {
			tiles = selectedTiles;
			setOptions(player.canKang(tiles), false, false, tiles);
			/**
			 * Can kang during anyone's turn if last thrown tile available & selecting 3*/
		} else if (lastThrownAvailable && selectedTiles.length === 3) {
			tiles = [...selectedTiles, lastThrown];
			setOptions(player.canKang(tiles), false, false, tiles);
		} else if (lastThrownAvailable && selectedTiles.length === 2) {
			/**
			 * If last thrown available, can pong during anyone's turn,
			 * Can chi only during own's turn */
			tiles = player.canPong([lastThrown, ...selectedTiles])
				? [lastThrown, ...selectedTiles]
				: sortTiles([...selectedTiles, lastThrown]);
			setOptions(
				false,
				player.canPong(tiles),
				thrownBy === findLeft(playerSeat) && whoseMove === playerSeat && player.canChi(tiles),
				tiles
			);
		} else {
			setOptions(false, false, false, tiles);
		}
	}, [lastThrown, thrownBy, lastThrownAvailable, whoseMove, selectedTiles, player, playerSeat]);

	/* ----------------------------------- Take ----------------------------------- */
	function takeLastThrown() {
		game.players[thrownBy].removeFromDiscarded(lastThrown);
		player.getNewTile(lastThrown);
	}

	function returnLastThrown() {
		player.returnNewTile();
		game.players[thrownBy].addToDiscarded(lastThrown);
	}

	function updateGameStateTakenTile(resetLastThrown: boolean = false) {
		if (resetLastThrown) {
			game.lastThrown = {};
		}
		game.takenTile = true;
		game.takenBy = playerSeat;
		game.newLog(`${player.username}'s turn - to throw`);
	}

	function handleTake() {
		game.whoseMove = playerSeat;
		if (meld.includes(lastThrown)) {
			game.players[thrownBy].removeFromDiscarded(lastThrown);
		}
		meld.forEach(tile => {
			tile.show = true;
		});
		if (canKang || canPong) {
			player.pongOrKang(meld);
			if (canKang) {
				game.flagProgress = true;
				game.newLog(`${player.username} kang'd ${meld[0].card}`);
				buHua();
			} else {
				game.newLog(`${player.username} pong'd ${meld[0].card}`);
			}
		} else {
			player.moveMeldFromHiddenIntoShown(meld);
			game.newLog(`${player.username} chi'd ${lastThrown.card}`);
		}
		updateGameStateTakenTile(false);
		handleAction(game);
	}

	function selfKang() {
		let toKang = selectedTiles[0];
		player.selfKang(toKang);
		updateGameStateTakenTile(false);
		game.flagProgress = true;
		buHua();
		handleAction(game);
	}

	/* ----------------------------------- Draw ----------------------------------- */

	function handleDraw() {
		let drawnTile: TileI;
		if (tilesLeft > 15) {
			drawnTile = game.giveTiles(1, playerSeat, false, true);
			if (drawnTile.suit === '花' || drawnTile.suit === '动物') {
				drawnTile = buHua();
			}
			updateGameStateTakenTile(true);
		} else {
			game.draw = true;
			game.endRound();
		}
		setSelectedTiles(drawnTile ? [drawnTile] : []);
		handleAction(game);
	}

	function buHua(): TileI {
		let drawnTile: TileI;
		let initNoHiddenTiles = player.countAllHiddenTiles();
		while (player.countAllHiddenTiles() === initNoHiddenTiles) {
			if (tilesLeft > 15) {
				drawnTile = game.giveTiles(1, playerSeat, true, true);
			} else {
				game.newLog(`${player.username} trying to bu hua but 15 tiles left`);
				game.draw = true;
				game.endRound();
				break;
			}
		}
		return drawnTile;
	}

	/* ----------------------------------- Throw ----------------------------------- */

	function handleThrow(tile: TileI) {
		tile.show = true;
		player.discard(tile);
		player.setHiddenTiles();
		game.tileThrown(tile, playerSeat);
		handleAction(game);
	}

	function handleAction(game: Game) {
		setSelectedTiles([]);
		if (takenTile && game.thrownTile) {
			player.setHiddenTiles();
			game.nextPlayerMove();
		} else {
			game.uncachedAction = true;
		}
		game.players[playerSeat] = player;
		FBService.updateGame(game);
	}

	/* ----------------------------------- Hu ----------------------------------- */

	function showHuDialog() {
		setDeclareHu(true);
		if (lastThrownAvailable) {
			takeLastThrown();
		}
		player.showTiles = true;
		handleAction(game);
	}

	function hideHuDialog() {
		setDeclareHu(false);
		if (isHoldingLastThrown) {
			returnLastThrown();
		}
		player.showTiles = false;
		handleAction(game);
	}

	/* ----------------------------------- Markup ----------------------------------- */

	return game && player ? (
		<div className="main transparent">
			<div className={`top-left-controls-${controlsSize}`}>
				<>
					<div className="buttons">
						<IconButton
							className="icon-button"
							size="small"
							onClick={() => {
								history.push('/');
							}}
						>
							<HomeIcon />
						</IconButton>
						<IconButton
							className="icon-button"
							size="small"
							onClick={() => {
								setShowSettings(!showSettings);
							}}
						>
							<SettingsIcon />
						</IconButton>
					</div>
					<div className="text-container">
						<p>{`Dealer: ${players[dealer].username}`}</p>
						<p>{`Seat: ${playerWind}`}</p>
						<p>{`Tiles left: ${tilesLeft}`}</p>
						<p>{`$ ${Math.round(Number(player.balance) * 100) / 100}`}</p>
					</div>
				</>
			</div>

			<div className={`bottom-left-controls-${controlsSize}`}>
				<Button
					className="button"
					variant="outlined"
					onClick={() => {
						handleTake();
					}}
					disabled={!canChi}
				>
					{`吃`}
				</Button>
				<Button
					className="button"
					variant="outlined"
					onClick={() => {
						if (selectedTiles.length === 1) {
							selfKang();
						} else {
							handleTake();
						}
					}}
					disabled={!canPong && !canKang}
				>
					{canKang ? `杠` : `碰`}
				</Button>
				{okToShow && (
					<Button
						className="button"
						variant="outlined"
						size="small"
						onClick={showHuDialog}
						disabled={game.hu.length === 3}
					>
						<p>{`开!`}</p>
					</Button>
				)}
			</div>

			<div className={`bottom-right-controls-${controlsSize}`}>
				<Button
					className="button"
					variant="outlined"
					size="small"
					onClick={() => {
						handleThrow(selectedTiles[0]);
					}}
					disabled={selectedTiles.length !== 1 || whoseMove !== playerSeat || !takenTile}
				>
					{`丢`}
				</Button>
				<Button
					className="button"
					variant="outlined"
					onClick={handleDraw}
					disabled={whoseMove !== playerSeat || (tilesLeft > 15 && takenTile)}
				>
					{tilesLeft === 15 ? `完` : `摸`}
				</Button>
				{!okToShow && (
					<Button
						className="button"
						variant="outlined"
						onClick={handleShow}
						// onClick={e => {
						// 	e.preventDefault();
						// 	game.newLog(`Test: ${Math.random()}`);
						// 	FBService.updateGame(game);
						// }}
					>
						{`开?`}
					</Button>
				)}
			</div>

			<div className={`top-right-controls-${controlsSize}`}>
				<>
					<IconButton
						className="icon-button"
						size="small"
						onClick={() => {
							setShowPay(!showPay);
						}}
					>
						<MonetizationOnIcon />
					</IconButton>
					<IconButton className="icon-button" size="small" onClick={handleShowLogs}>
						<SubjectIcon />
					</IconButton>
					<LogBox
						expanded={showLogs}
						logs={logs.length <= 10 ? logs : logs.slice(logs.length - 10, logs.length)}
						scroll={() => {
							scrollToBottomOfDiv('logs');
						}}
					/>
				</>
			</div>
			{showPay && (
				<PaymentWindow
					game={game}
					playerSeat={playerSeat}
					show={showPay}
					onClose={() => {
						setShowPay(false);
					}}
				/>
			)}
			{showSettings && (
				<SettingsWindow
					show={showSettings}
					onClose={() => {
						setShowSettings(false);
					}}
				/>
			)}
			{declareHu && <HuDialog game={game} playerSeat={playerSeat} show={declareHu} onClose={hideHuDialog} />}
			{(game.hu.length === 3 || game.draw) && <Announcement playerSeat={playerSeat} game={game} />}
		</div>
	) : null;
};

export default Controls;
