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
import { findLeft, findTwoInSorted, indexToWind, revealTile, sortTiles } from '../../util/utilFns';
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
	const { controlsSize, selectedTiles, setSelectedTiles, tileHashKey } = useContext(AppContext);
	const player: User = useSelector((state: IStore) => state.player);
	const game: Game = useSelector((state: IStore) => state.game);
	const { ps, dealer: dealerIndex, lastT, tBy, taken, wM, dFr, tiles, logs, hu, draw } = game;
	const { delayOn, delayLeft } = useCountdown(dFr, 6);
	const [openTimeoutId, setOpenTimeoutId] = useState<NodeJS.Timeout>(null);
	const [showSettings, setShowSettings] = useState(false);
	const [declareHu, setDeclareHu] = useState(false);
	const [okToShow, setOkToShow] = useState(false);
	const [showLogs, setShowLogs] = useState(false);
	const [showPay, setShowPay] = useState(false);
	const [canPong, setCanPong] = useState(false);
	const [canKang, setCanKang] = useState(false);
	const [canChi, setCanChi] = useState(false);
	const [meld, setMeld] = useState<IShownTile[]>([]);
	const dealer = ps && dealerIndex ? ps[dealerIndex] : null;

	const offerPong = useMemo(() => {
		return delayOn && tBy !== playerSeat && findTwoInSorted(lastT, player?.hiddenTiles, 'card');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [delayOn]);

	const texts = useMemo(() => {
		return game?.on
			? [
					`Dealer: ${dealer?.username || ``}`,
					`Tiles left: ${tiles?.length || 0}`,
					`Chips: ${Math.round(player?.balance) || ``}`,
					`Seat: ${indexToWind((playerSeat - dealerIndex + 4) % 4)}`
			  ]
			: [`Chips: ${Math.round(player?.balance) || 0}`, `Game has ended!`];
	}, [game?.on, player?.balance, dealer?.username, tiles?.length, playerSeat, dealerIndex]);

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
		return !isEmpty(lastT) && !taken && ps[tBy].lastDiscardedTileIs(lastT);
	}, [ps, lastT, tBy, taken]);

	const isHoldingLastThrown: boolean = useMemo(() => {
		return !isEmpty(lastT) && player && player.allHiddenTilesContain(lastT) && !ps[tBy].lastDiscardedTileIs(lastT);
	}, [player, ps, lastT, tBy]);

	const setOptions = useCallback(
		(kang: boolean, pong: boolean, chi: boolean, tiles: IShownTile[]) => {
			setCanKang(kang);
			setCanPong(pong);
			setCanChi(chi);
			setMeld(tiles);
		},
		[setCanKang, setCanPong, setCanChi, setMeld]
	);

	useEffect(() => {
		let tiles: IShownTile[] = [];
		if (wM === playerSeat && (selectedTiles.length === 1 || selectedTiles.length === 4)) {
			// Can self kang during turn & selecting 1 || 4
			tiles = selectedTiles;
			setOptions(player.canKang(tiles), false, false, tiles);
		} else if (lastThrownAvailable && selectedTiles.length === 3) {
			// Can kang during anyone's turn if last thrown tile available & selecting 3
			tiles = [lastT, ...selectedTiles];
			setOptions(player.canKang(tiles), false, false, tiles);
		} else if (lastThrownAvailable && selectedTiles.length === 2) {
			// If last thrown available, can pong during anyone's turn, can chi only during own's turn
			tiles = player.canPong([lastT, ...selectedTiles])
				? [lastT, ...selectedTiles]
				: sortTiles([...selectedTiles, lastT]);
			setOptions(
				false,
				player.canPong(tiles),
				tBy === findLeft(playerSeat) && wM === playerSeat && player.canChi(tiles),
				tiles
			);
		} else {
			setOptions(false, false, false, tiles);
		}
	}, [lastT, lastThrownAvailable, player, playerSeat, selectedTiles, setOptions, tBy, wM]);

	/* ----------------------------------- Action handling ----------------------------------- */

	const handleAction = useCallback(
		(game: Game) => {
			setSelectedTiles([]);
			if (taken && game.thrown) {
				player.setHiddenTiles();
				game.nextPlayerMove();
			}
			// else {
			// 	game.halfMove = true;
			// }
			game.ps[playerSeat] = player;
			FBService.updateGame(game);
		},
		[player, playerSeat, setSelectedTiles, taken]
	);

	const updateGameStateTakenTile = useCallback(
		(resetLastThrown: boolean = true, halfAction: boolean = true) => {
			if (resetLastThrown) {
				game.lastT = {};
			}
			if (halfAction) {
				game.taken = true;
				game.takenB = playerSeat;
				game.newLog(`${player.username}'s turn - to throw`);
			}
		},
		[game, player?.username, playerSeat]
	);

	/* ----------------------------------- Draw ----------------------------------- */

	function handleDraw() {
		let drawnTile: IHiddenTile;
		let revealedTile: IShownTile;
		if (tiles?.length > 15) {
			revealedTile = revealTile(drawnTile, tileHashKey);
			drawnTile = game.giveTiles(1, playerSeat, false, true);
			if (revealedTile.suit === '花' || revealedTile.suit === '动物') {
				drawnTile = buHua();
			}
			updateGameStateTakenTile();
		} else {
			game.draw = true;
			game.endRound();
		}
		handleAction(game);
	}

	function buHua() {
		let drawnTile: IHiddenTile;
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
		game.ps[tBy].removeFromDiscarded(lastT);
		player.getNewTile(lastT);
	}

	function returnLastThrown() {
		player.returnNewTile();
		game.ps[tBy].addToDiscarded(lastT);
	}

	function handleTake() {
		game.wM = playerSeat;
		if (meld.includes(lastT)) {
			game.ps[tBy].removeFromDiscarded(lastT);
		}
		let revealedMeld = meld.map(tile => revealTile(tile, tileHashKey));
		if (canKang || canPong) {
			player.moveIntoShown(revealedMeld);
			if (canKang) {
				game.fN = true;
				game.newLog(`${player.username} kang'd ${revealedMeld[0].card}`);
				buHua();
			} else {
				game.newLog(`${player.username} pong'd ${revealedMeld[0].card}`);
			}
		} else {
			player.moveIntoShown(revealedMeld);
			game.newLog(`${player.username} chi'd ${lastT.card}`);
		}
		updateGameStateTakenTile(false);
		handleAction(game);
	}

	function selfKang() {
		let toKang = revealTile(selectedTiles[0], tileHashKey);
		player.selfKang(toKang);
		game.fN = true;
		game.newLog(`${player.username} kang'd - ${toKang.card}`);
		game.lastT = toKang;
		buHua();
		handleAction(game);
	}

	/* ----------------------------------- Throw ----------------------------------- */

	function handleThrow(tile: IHiddenTile) {
		let toDiscard = revealTile(tile, tileHashKey);
		player.discard(toDiscard);
		player.setHiddenTiles();
		game.tileThrown(toDiscard, playerSeat);
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
								? `You have ${delayLeft}s to pong ${lastT?.card || ``}`
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
							throwDisabled={selectedTiles.length !== 1 || wM !== playerSeat || !taken}
							drawCallback={() => handleDraw()}
							drawText={tiles?.length === 15 ? `完` : `摸`}
							drawDisabled={wM !== playerSeat || taken || delayOn || canChi || canPong || canKang}
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
