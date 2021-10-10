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
import useCountdown from '../../util/hooks/useCountdown';
import { findLeft, findTwoInSorted, indexToWind, sortTiles } from '../../util/utilFns';
import { Loader } from '../Loader';
import AnnounceHuModal from '../Modals/AnnounceHuModal';
import DeclareHuModal from '../Modals/DeclareHuModal';
import PaymentModal from '../Modals/PaymentModal';
import SettingsWindow from '../SettingsWindow/SettingsWindow';
import BottomLeftControls from './BottomLeftControls';
import BottomRightControls from './BottomRightControls';
import './controls.scss';
import TopLeftControls from './TopLeftControls';
import TopRightControls from './TopRightControls';

interface ControlsProps {
	playerSeat?: number;
}

const Controls = ({ playerSeat }: ControlsProps) => {
	const { controlsSize, selectedTiles, setSelectedTiles } = useContext(AppContext);
	const player: User = useSelector((state: IStore) => state.player);
	const game: Game = useSelector((state: IStore) => state.game);
	const {
		players,
		dealer: dealerIndex,
		lastThrown,
		thrownBy,
		takenTile,
		whoseMove,
		pongDelayFrom,
		tiles,
		logs,
		hu,
		draw
	} = game;
	const { delayOn, delayLeft } = useCountdown(pongDelayFrom, 6);
	const [openTimeoutId, setOpenTimeoutId] = useState<NodeJS.Timeout>(null);
	const [showSettings, setShowSettings] = useState(false);
	const [declareHu, setDeclareHu] = useState(false);
	const [okToShow, setOkToShow] = useState(false);
	const [showLogs, setShowLogs] = useState(false);
	const [showPay, setShowPay] = useState(false);
	const [canPong, setCanPong] = useState(false);
	const [canKang, setCanKang] = useState(false);
	const [canChi, setCanChi] = useState(false);
	const [meld, setMeld] = useState<ITile[]>([]);
	const dealer = players && dealerIndex ? players[dealerIndex] : null;

	const offerPong = useMemo(() => {
		return delayOn && thrownBy !== playerSeat && findTwoInSorted(lastThrown, player?.hiddenTiles, 'card');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [delayOn]);

	const texts = useMemo(() => {
		return game?.ongoing
			? [
					`Dealer: ${dealer?.username || ``}`,
					`Tiles left: ${tiles?.length || 0}`,
					`Chips: ${Math.round(player?.balance) || ``}`,
					`Seat: ${indexToWind((playerSeat - dealerIndex + 4) % 4)}`
			  ]
			: [`Chips: ${Math.round(player?.balance) || 0}`, `Game has ended!`];
	}, [game?.ongoing, player?.balance, dealer?.username, tiles?.length, playerSeat, dealerIndex]);

	/* ----------------------------------- Show ----------------------------------- */

	function setShowTimeout() {
		setOpenTimeoutId(
			setTimeout(function () {
				setOkToShow(false);
			}, 2000)
		);
	}

	function handleShow() {
		if (okToShow) {
			clearTimeout(openTimeoutId);
		}
		setOkToShow(true);
		setShowTimeout();
	}

	useEffect(() => {
		if (player && player.showTiles && hu.length !== 3) {
			if (!declareHu) {
				showDeclareHuModal();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player?.showTiles]);

	/* ----------------------------------- Options ----------------------------------- */

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

	const setOptions = useCallback(
		(kang: boolean, pong: boolean, chi: boolean, tiles: ITile[]) => {
			setCanKang(kang);
			setCanPong(pong);
			setCanChi(chi);
			setMeld(tiles);
		},
		[setCanKang, setCanPong, setCanChi, setMeld]
	);

	useEffect(() => {
		let tiles: ITile[] = [];
		if (whoseMove === playerSeat && (selectedTiles.length === 1 || selectedTiles.length === 4)) {
			// Can self kang during turn & selecting 1 || 4
			tiles = selectedTiles;
			setOptions(player.canKang(tiles), false, false, tiles);
		} else if (lastThrownAvailable && selectedTiles.length === 3) {
			// Can kang during anyone's turn if last thrown tile available & selecting 3
			tiles = [lastThrown, ...selectedTiles];
			setOptions(player.canKang(tiles), false, false, tiles);
		} else if (lastThrownAvailable && selectedTiles.length === 2) {
			// If last thrown available, can pong during anyone's turn, can chi only during own's turn
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
	}, [lastThrown, lastThrownAvailable, player, playerSeat, selectedTiles, setOptions, thrownBy, whoseMove]);

	/* ----------------------------------- Action handling ----------------------------------- */

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

	const updateGameStateTakenTile = useCallback(
		(resetLastThrown: boolean = true, halfMove: boolean = true) => {
			if (resetLastThrown) {
				game.lastThrown = {};
			}
			if (halfMove) {
				game.takenTile = true;
				game.takenBy = playerSeat;
				game.newLog(`${player.username}'s turn - to throw`);
			}
		},
		[game, player?.username, playerSeat]
	);

	/* ----------------------------------- Draw ----------------------------------- */

	function handleDraw() {
		let drawnTile: ITile;
		if (tiles?.length > 15) {
			drawnTile = game.giveTiles(1, playerSeat, false, true);
			if (drawnTile.suit === '花' || drawnTile.suit === '动物') {
				drawnTile = buHua();
			}
			updateGameStateTakenTile();
		} else {
			game.draw = true;
			game.endRound();
		}
		setSelectedTiles(drawnTile ? [drawnTile] : []);
		handleAction(game);
	}

	function buHua() {
		let drawnTile: ITile;
		let initNoHiddenTiles = player.countAllHiddenTiles();
		while (player.countAllHiddenTiles() === initNoHiddenTiles) {
			if (tiles?.length > 15) {
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

	/* ----------------------------------- Take ----------------------------------- */

	function takeLastThrown() {
		game.players[thrownBy].removeFromDiscarded(lastThrown);
		player.getNewTile(lastThrown);
	}

	function returnLastThrown() {
		player.returnNewTile();
		game.players[thrownBy].addToDiscarded(lastThrown);
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
			player.moveIntoShown(meld);
			if (canKang) {
				game.flagProgress = true;
				game.newLog(`${player.username} kang'd ${meld[0].card}`);
				buHua();
			} else {
				game.newLog(`${player.username} pong'd ${meld[0].card}`);
			}
		} else {
			player.moveIntoShown(meld);
			game.newLog(`${player.username} chi'd ${lastThrown.card}`);
		}
		updateGameStateTakenTile(false);
		handleAction(game);
	}

	function selfKang() {
		let toKang = selectedTiles[0];
		player.selfKang(toKang);
		game.flagProgress = true;
		game.newLog(`${player.username} kang'd - ${toKang.card}`);
		game.lastThrown = toKang;
		buHua();
		handleAction(game);
	}

	/* ----------------------------------- Throw ----------------------------------- */

	function handleThrow(tile: ITile) {
		tile.show = true;
		player.discard(tile);
		player.setHiddenTiles();
		game.tileThrown(tile, playerSeat);
		game.handlePongDelay();
		handleAction(game);
	}

	/* ----------------------------------- Hu ----------------------------------- */

	function showDeclareHuModal() {
		setDeclareHu(true);
		if (lastThrownAvailable) {
			takeLastThrown();
			updateGameStateTakenTile(false, false);
		}
		player.showTiles = true;
		handleAction(game);
	}

	function hideDeclareHuModal(didHu?: boolean) {
		setDeclareHu(false);
		if (!didHu) {
			if (isHoldingLastThrown) {
				returnLastThrown();
			}
			player.showTiles = false;
			handleAction(game);
		}
	}

	function handleShowTiles() {
		player.showTiles = !player.showTiles;
		handleAction(game);
	}

	/* ----------------------------------- Markup ----------------------------------- */

	return (
		<TableTheme>
			{game && player ? (
				<MainTransparent>
					<TopRightControls
						payCallback={() => {
							setShowPay(!showPay);
						}}
						logsCallback={() => setShowLogs(!showLogs)}
						showLogs={showLogs}
						logs={logs}
					/>
					<TopLeftControls
						homeCallback={() => {
							history.push(Pages.INDEX);
						}}
						settingsCallback={() => {
							setShowSettings(!showSettings);
						}}
						texts={texts}
						notif={`${
							delayOn && offerPong
								? `You have ${delayLeft}s to pong ${lastThrown?.card || ``}`
								: delayOn && !offerPong
								? `Waiting... (${delayLeft})`
								: ``
						}`}
					/>
					{hu.length !== 3 && !draw && !declareHu && (
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
							huCallback={showDeclareHuModal}
							okToShow={okToShow}
							huShowing={declareHu}
							huDisabled={game.hu.length === 3}
						/>
					)}
					{hu.length !== 3 && !draw && !declareHu && (
						<BottomRightControls
							controlsSize={controlsSize}
							throwCallback={() => {
								handleThrow(selectedTiles[0]);
							}}
							throwDisabled={selectedTiles.length !== 1 || whoseMove !== playerSeat || !takenTile}
							drawCallback={() => handleDraw()}
							drawText={tiles?.length === 15 ? `完` : `摸`}
							drawDisabled={
								whoseMove !== playerSeat || takenTile || delayOn || canChi || canPong || canKang
							}
							openCallback={handleShow}
							okToShow={okToShow}
							huShowing={declareHu}
						/>
					)}
					{showPay && (
						<PaymentModal
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
					{declareHu && (
						<DeclareHuModal
							game={game}
							playerSeat={playerSeat}
							show={declareHu}
							onClose={hideDeclareHuModal}
						/>
					)}
					{(game.hu.length === 3 || draw) && (
						<AnnounceHuModal
							game={game}
							playerSeat={playerSeat}
							showing={player.showTiles}
							showCallback={handleShowTiles}
						/>
					)}
				</MainTransparent>
			) : (
				<Loader />
			)}
		</TableTheme>
	);
};

export default Controls;
