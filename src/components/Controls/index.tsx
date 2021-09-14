import isEmpty from 'lodash.isempty';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { history } from '../../App';
import { Pages } from '../../global/enums';
import { TableTheme } from '../../global/MuiStyles';
import { MainTransparent } from '../../global/StyledComponents';
import { Game } from '../../Models/Game';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { findLeft, scrollToBottomOfDiv, sortTiles } from '../../util/utilFns';
import SettingsWindow from '../SettingsWindow/SettingsWindow';
import Announcement from './Announcement';
import BottomLeftControls from './BottomLeftControls';
import BottomRightControls from './BottomRightControls';
import './ControlsLarge.scss';
import './ControlsMedium.scss';
import './ControlsSmall.scss';
import HuDialog from './HuDialog';
import PaymentWindow from './PaymentWindow';
import TopLeftControls from './TopLeftControls';
import TopRightControls from './TopRightControls';

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

	// Logic to showHuDialog when user shows, leaves the game, then returns
	useEffect(() => {
		if (player && player.showTiles) {
			if (!declareHu) {
				showHuDialog();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player?.showTiles]);

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

	const buHua = useCallback(() => {
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
	}, [game, player, playerSeat, tilesLeft]);

	/* ----------------------------------- Throw ----------------------------------- */

	function handleThrow(tile: TileI) {
		tile.show = true;
		player.discard(tile);
		player.setHiddenTiles();
		game.tileThrown(tile, playerSeat);
		handleAction(game);
	}

	const handleAction = useCallback(
		(game: Game) => {
			setSelectedTiles([]);
			if (takenTile && game.thrownTile) {
				player.setHiddenTiles();
				game.nextPlayerMove();
			} else {
				game.uncachedAction = true;
			}
			game.players[playerSeat] = player;
			FBService.updateGame(game);
		},
		[player, playerSeat, setSelectedTiles, takenTile]
	);

	/* ----------------------------------- Take ----------------------------------- */
	function takeLastThrown() {
		game.players[thrownBy].removeFromDiscarded(lastThrown);
		player.getNewTile(lastThrown);
	}

	function returnLastThrown() {
		player.returnNewTile();
		game.players[thrownBy].addToDiscarded(lastThrown);
	}

	const updateGameStateTakenTile = useCallback(
		(resetLastThrown: boolean = false) => {
			if (resetLastThrown) {
				game.lastThrown = {};
			}
			game.takenTile = true;
			game.takenBy = playerSeat;
			game.newLog(`${player.username}'s turn - to throw`);
		},
		[game, player?.username, playerSeat]
	);

	const handleTake = useCallback(() => {
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
	}, [
		buHua,
		canKang,
		canPong,
		game,
		handleAction,
		lastThrown,
		meld,
		player,
		playerSeat,
		thrownBy,
		updateGameStateTakenTile
	]);

	const selfKang = useCallback(() => {
		let toKang = selectedTiles[0];
		player.selfKang(toKang);
		updateGameStateTakenTile(false);
		game.flagProgress = true;
		buHua();
		handleAction(game);
	}, [buHua, game, handleAction, player, selectedTiles, updateGameStateTakenTile]);

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
		<TableTheme>
			{/* <ThemeProvider theme={ControlsTheme}> */}
			<MainTransparent>
				<TopLeftControls
					homeCallback={() => {
						history.push(Pages.index);
					}}
					settingsCallback={() => {
						setShowSettings(!showSettings);
					}}
					texts={[
						`Dealer: ${players[dealer].username}`,
						`Seat: ${playerWind}`,
						`Tiles left: ${tilesLeft}`,
						`$ ${Math.round(Number(player.balance) * 100) / 100}`
					]}
				/>
				<TopRightControls
					payCallback={() => {
						setShowPay(!showPay);
					}}
					logsCallback={handleShowLogs}
					showLogs={showLogs}
					logs={logs}
				/>
				<BottomLeftControls
					controlsSize={controlsSize}
					chiCallback={() => handleTake()}
					chiDisabled={!canChi}
					pongCallback={() => {
						if (selectedTiles.length === 1) {
							selfKang();
						} else {
							handleTake();
						}
					}}
					pongText={canKang ? `杠` : `碰`}
					pongDisabled={!canPong && !canKang}
					huCallback={showHuDialog}
					okToShow={okToShow}
					huDisabled={game.hu.length === 3}
				/>
				<BottomRightControls
					controlsSize={controlsSize}
					throwCallback={() => {
						handleThrow(selectedTiles[0]);
					}}
					throwDisabled={selectedTiles.length !== 1 || whoseMove !== playerSeat || !takenTile}
					drawCallback={() => handleDraw()}
					drawText={tilesLeft === 15 ? `完` : `摸`}
					drawDisabled={whoseMove !== playerSeat || (tilesLeft > 15 && takenTile)}
					openCallback={handleShow}
					okToShow={okToShow}
				/>
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
			</MainTransparent>
			{/* </ThemeProvider> */}
		</TableTheme>
	) : null;
};

export default Controls;
