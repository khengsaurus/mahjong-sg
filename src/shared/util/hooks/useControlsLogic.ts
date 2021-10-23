import { history } from 'App';
import isEmpty from 'lodash.isempty';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Pages } from 'shared/enums';
import { Game, User } from 'shared/Models';
import { findLeft, findTwo, hashTileString, indexToWind, revealTile, sortTiles } from 'shared/util/utilFns';
import FBService from 'web/service/MyFirebaseService';
import { AppContext } from './AppContext';
import useCountdown from './useCountdown';

interface IControls {
	game: Game;
	player: User;
	topLeft: ITopLeftControls;
	topRight: ITopRightControls;
	bottomLeft: IBottomLeftControls;
	bottomRight: IBottomRightControls;
	payModal: IModalProps;
	settingsModal: IModalProps;
	declareHuModal: IModalProps;
	announceHuModal: IModalProps;
	showBottomControls: boolean;
	showAnnounceHuModal: boolean;
}

function useControlsLogic(): IControls {
	const { selectedTiles, setSelectedTiles, tileHashKey, playerSeat } = useContext(AppContext);
	const player: User = useSelector((state: IStore) => state.player);
	const game: Game = useSelector((state: IStore) => state.game);
	const [meld, setMeld] = useState<IShownTile[]>([]);
	const [canChi, setCanChi] = useState(false);
	const [canPong, setCanPong] = useState(false);
	const [canKang, setCanKang] = useState(false);
	const [showPay, setShowPay] = useState(false);
	const [showLogs, setShowLogs] = useState(false);
	const [confirmHu, setConfirmHu] = useState(false);
	const [showHu, setShowHu] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [openTimeoutId, setOpenTimeoutId] = useState<NodeJS.Timeout>(null);

	const { ps, dealer: dealerIndex, lastT, tBy, taken, wM, dFr, tiles, logs, hu, draw } = game;
	const { delayOn, delayLeft } = useCountdown(dFr, 6);
	const dealer = ps ? ps[dealerIndex] : null;

	const offerPong = useMemo(() => {
		let hashCard = hashTileString(lastT?.card, tileHashKey);
		return delayOn && tBy !== playerSeat && findTwo(hashCard, player?.hTs, 'id');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [delayOn]);

	const texts = useMemo(() => {
		return game?.on
			? [
					`Dealer: ${dealer?.uN || ``}`,
					`Tiles left: ${tiles?.length || 0}`,
					`Chips: ${Math.round(player?.bal) || 0}`,
					`Seat: ${indexToWind((playerSeat - dealerIndex + 4) % 4)}`
			  ]
			: [`Chips: ${Math.round(player?.bal) || 0}`, `Game has ended!`];
	}, [game?.on, player?.bal, dealer?.uN, tiles?.length, playerSeat, dealerIndex]);

	/* ----------------------------------- Show ----------------------------------- */

	function setShowTimeout() {
		setOpenTimeoutId(
			setTimeout(function () {
				setConfirmHu(false);
			}, 2000)
		);
	}

	function showCheck() {
		if (confirmHu) {
			clearTimeout(openTimeoutId);
		}
		setConfirmHu(true);
		setShowTimeout();
	}

	useEffect(() => {
		if (player && player.sT && hu.length !== 3) {
			if (!showHu) {
				handleHu();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player?.sT]);

	/* ----------------------------------- Options ----------------------------------- */

	const lastThrownAvailable = useCallback(
		(toHu = false) => {
			if (!isEmpty(lastT) && ps[tBy].lastDiscardedTileIs(lastT)) {
				return toHu ? true : !taken;
			} else {
				return false;
			}
		},
		[ps, lastT, tBy, taken]
	);

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
			setOptions(player.canKang(selectedTiles), false, false, selectedTiles);
		} else if (lastThrownAvailable() && selectedTiles.length === 3) {
			// Can kang during anyone's turn if last thrown tile available & selecting 3
			tiles = [lastT, ...selectedTiles];
			setOptions(player.canKang(tiles), false, false, tiles);
		} else if (lastThrownAvailable() && selectedTiles.length === 2) {
			// If last thrown available, can pong during anyone's turn, can chi only during own's turn
			let canPongFlag = player.canPong([lastT, ...selectedTiles]);
			tiles = canPongFlag ? [lastT, ...selectedTiles] : sortTiles([...selectedTiles, lastT]);
			setOptions(
				false,
				canPongFlag,
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
				game.newLog(`${player.uN}'s turn - to throw`);
			}
		},
		[game, player?.uN, playerSeat]
	);

	/* ----------------------------------- Draw ----------------------------------- */

	function handleDraw() {
		if (tiles?.length > 15) {
			const { drewHua } = game.giveTiles(1, playerSeat, false, true, true);
			if (drewHua) {
				handleBuHua();
			}
			updateGameStateTakenTile(false);
		} else {
			game.draw = true;
			game.endRound();
		}
		handleAction(game);
	}

	function handleBuHua() {
		let initNoHiddenTiles = player.countAllHiddenTiles();
		while (player.countAllHiddenTiles() === initNoHiddenTiles) {
			if (tiles?.length > 15) {
				game.giveTiles(1, playerSeat, true, true, true);
			} else {
				game.newLog(`${player.uN} trying to bu hua but 15 tiles left`);
				game.draw = true;
				game.endRound();
				break;
			}
		}
	}

	/* ----------------------------------- Take ----------------------------------- */

	function returnLastThrown() {
		player.returnNewTile();
		taken ? player.getNewTile(lastT) : game.ps[tBy].addToDiscarded(lastT);
	}

	function handleTake() {
		game.wM = playerSeat;
		if (meld.includes(lastT)) {
			game.ps[tBy].removeFromDiscarded(lastT);
		}
		player.moveIntoShown(meld);
		if (canKang || canPong) {
			if (canKang) {
				game.fN = true;
				game.newLog(`${player.uN} kang'd ${meld[0].card}`);
				handleBuHua();
			} else {
				game.newLog(`${player.uN} pong'd ${meld[0].card}`);
			}
		} else {
			game.newLog(`${player.uN} chi'd ${lastT.card}`);
		}
		updateGameStateTakenTile(false);
		handleAction(game);
	}

	function handlePong() {
		if (selectedTiles.length === 1) {
			selfKang();
		} else {
			handleTake();
		}
	}

	function selfKang() {
		let toKang = revealTile(selectedTiles[0], tileHashKey);
		player.selfKang(toKang);
		game.fN = true;
		game.newLog(`${player.uN} kang'd - ${toKang.card}`);
		game.lastT = toKang;
		handleBuHua();
		handleAction(game);
	}

	/* ----------------------------------- Throw ----------------------------------- */

	function handleThrow() {
		let tile = selectedTiles[0];
		if (!isEmpty(tile)) {
			player.discard(tile);
			player.setHiddenTiles();
			game.tileThrown(tile, playerSeat);
			game.handlePongDelay();
			handleAction(game);
		}
	}

	/* ----------------------------------- Hu ----------------------------------- */

	function handleHu() {
		setShowHu(true);
		if (lastThrownAvailable(true) && isEmpty(player.lTaken)) {
			game.ps[tBy].removeFromDiscarded(lastT);
			player.getNewTile(lastT);
		}
		player.sT = true;
		handleAction(game);
	}

	function hideDeclareHuModal(didHu?: boolean) {
		setShowHu(false);
		if (!didHu) {
			if (isHoldingLastThrown) {
				returnLastThrown();
			}
			player.sT = false;
			handleAction(game);
		}
	}

	function handleShowTiles() {
		player.sT = !player.sT;
		handleAction(game);
	}

	function handleHome() {
		history.push(Pages.INDEX);
	}

	/* ----------------------------------- Toggle callbacks ----------------------------------- */
	function toggleShowPay() {
		setShowPay(!showPay);
	}
	function hidePay() {
		setShowPay(false);
	}
	function toggleShowLogs() {
		setShowLogs(!showLogs);
	}
	function toggleShowSettings() {
		setShowSettings(!showSettings);
	}
	function hideSettings() {
		setShowSettings(false);
	}

	/* ----------------------------------- Misc ----------------------------------- */
	const notif = useMemo(() => {
		return `${
			delayOn && offerPong
				? `You have ${delayLeft}s to pong ${lastT?.card || ``}`
				: delayOn && !offerPong
				? `Waiting... (${delayLeft})`
				: ``
		}`;
	}, [delayOn, offerPong, delayLeft, lastT?.card]);

	const showBottomControls = useMemo(() => {
		return hu.length !== 3 && !draw && !showHu;
	}, [hu.length, draw, showHu]);

	return {
		game,
		player,
		topRight: {
			handlePay: toggleShowPay,
			handleLogs: toggleShowLogs,
			showLogs,
			logs
		},
		topLeft: {
			handleHome,
			handleSettings: toggleShowSettings,
			texts,
			notif
		},
		bottomLeft: {
			handleChi: handleTake,
			handlePong,
			handleHu,
			disableChi: !canChi,
			disablePong: !canPong && !canKang,
			disableHu: game.hu.length === 3,
			pongText: canKang ? `杠` : `碰`,
			confirmHu,
			showHu
		},
		bottomRight: {
			handleThrow: handleThrow,
			handleDraw: handleDraw,
			handleOpen: showCheck,
			disableThrow: selectedTiles.length !== 1 || wM !== playerSeat || !taken,
			disableDraw: wM !== playerSeat || taken || delayOn || canChi || canPong || canKang,
			drawText: tiles?.length === 15 ? `完` : `摸`,
			confirmHu,
			showHu
		},
		payModal: {
			game,
			playerSeat,
			show: showPay,
			onClose: hidePay
		},
		settingsModal: {
			game,
			playerSeat,
			show: showSettings,
			onClose: hideSettings
		},
		declareHuModal: {
			game,
			playerSeat,
			show: showHu,
			onClose: () => {
				hideDeclareHuModal();
			}
		},
		announceHuModal: {
			game,
			playerSeat,
			show: player?.sT,
			onClose: handleShowTiles
		},
		showBottomControls,
		showAnnounceHuModal: game.hu.length === 3 || draw
	};
}

export default useControlsLogic;
