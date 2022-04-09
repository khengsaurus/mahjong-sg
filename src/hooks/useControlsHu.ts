import { ImpactStyle } from '@capacitor/haptics';
import { LocalFlag } from 'enums';
import isEmpty from 'lodash.isempty';
import { Game } from 'models';
import { isDev, triggerHaptic } from 'platform';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import { IControlsHu, IHWPx } from 'typesPlus';
import { findRight, isBot, isEmptyTile } from 'utility';
import { primaryLRU } from 'utility/LRUCache';
import { useFirstEffect } from '.';
import { AppContext } from './AppContext';

function useControlsHu(
	isHuLocked: boolean,
	lThAvailHu: boolean,
	updateGame: (game: Game) => void,
	setShowPay: (b: boolean) => void
): IControlsHu {
	const { playerSeat, setSelectedTiles } = useContext(AppContext);
	const { game, gameId, haptic, localGame } = useSelector((state: IStore) => state);
	const [confirmHu, setConfirmHu] = useState(false);
	const [showDeclareHu, setShowDeclareHu] = useState(false);
	const [openTimeoutId, setOpenTimeoutId] = useState<NodeJS.Timeout>(null);

	// Consts
	const currGame = gameId === LocalFlag ? localGame : game;
	const { cO, f, hu, n = [], ps } = currGame;
	const player = ps[playerSeat];

	/* ----------------------------------- Action ----------------------------------- */

	const handleAction = useCallback(
		(_p: number, game: Game) => {
			if (_p === playerSeat) {
				setSelectedTiles([]);
			}
			if (game.f[3] && game.f[4]) {
				game.ps[_p]?.setHiddenTiles();
				game.nextPlayerMove();
			}
			updateGame(game);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[playerSeat, setSelectedTiles, updateGame]
	);

	/* ----------------------------------- Hu ----------------------------------- */
	// If player loads Table and sT && cfH -> setShowDeclareHu(true). Note that this bypasses isHuLocked
	useFirstEffect(
		useCallback(() => {
			isDev &&
				console.info(
					'useControlsHu.useFirstEffect -> check if should auto open Declare Hu modal'
				);
			if (hu?.length === 0) {
				if (player?.sT && player?.cfH && !showDeclareHu) {
					setShowDeclareHu(true);
				}
			} else if (showDeclareHu && Number(hu[0]) !== playerSeat) {
				hideDeclareHuModal(playerSeat, currGame);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [playerSeat, player?.cfH, player?.sT, showDeclareHu])
	);

	const openDeclareHuDialog = useCallback(
		(_p: number, game: Game) => {
			const { lTh, f = [], n = [], ps } = game;
			if (!isHuLocked) {
				if (_p === playerSeat) {
					setConfirmHu(false);
					setShowDeclareHu(true);
					clearTimeout(openTimeoutId);
				}
				const p = ps[_p];
				if (isEmpty(p?.lTa)) {
					if (lThAvailHu) {
						game.ps[n[7]]?.removeFromDiscarded(lTh);
						p.getNewTile(lTh);
					} else if (
						// can 抢杠
						f[3] &&
						n[3] !== _p &&
						!isEmptyTile(lTh) &&
						ps[n[3]].shownTilesContain(lTh) &&
						ps[n[3]].hasKang(lTh.c)
					) {
						ps[n[3]].updateKangToPong(lTh.c);
						ps[n[3]].removeFromShown(lTh);
						game.f[7] = true;
						game.n[6] = _p;
						p.getNewTile(lTh);
					}
				}
				p.sT = true;
				p.cfH = true;
				game.t[2] = null;
				handleAction(_p, game);
			}
		},
		[
			isHuLocked,
			playerSeat,
			setConfirmHu,
			setShowDeclareHu,
			openTimeoutId,
			handleAction,
			lThAvailHu
		]
	);

	const returnLastThrown = useCallback((game: Game, _p: number) => {
		const { n = [], ps } = game;
		if (ps[_p]) {
			const toReturn = ps[_p].returnLastThrown();
			// prevent duplicating lTh when another player is holding lTh
			if (!isEmpty(toReturn)) {
				if (ps[n[7]].hasPong(toReturn.c)) {
					// return 抢杠
					ps[n[7]].createMeld([toReturn], true);
					game.lTh = toReturn;
					game.f[7] = false;
					game.n[6] = n[7];
				} else if (!ps[n[7]].lastDiscardedTileIs(toReturn)) {
					ps[n[7]]?.addToDiscarded(toReturn);
					game.lTh = toReturn;
				}
			}
		}
	}, []);

	const hideDeclareHuModal = useCallback(
		(_p: number, game: Game, hu?: boolean) => {
			if (_p === playerSeat) {
				setShowDeclareHu(false);
			}
			const p = game.ps[_p];
			if (p && !hu) {
				if (p?.lTa.r === game.lTh.r) {
					returnLastThrown(game, _p);
				}
				p.sT = false;
				p.cfH = false;
				handleAction(_p, game);
			}
		},
		[playerSeat, setShowDeclareHu, handleAction, returnLastThrown]
	);

	const huFirst = useCallback(
		(_p: number, game: Game) => {
			const p = game.ps[_p];
			const t = game?.ps[Number(game.hu[0])]?.returnLastThrown();
			p?.getNewTile(t);
			p.sT = true;
			p.cfH = true;
			game.ps.forEach(p => {
				p.sT = false;
				p.cfH = false;
			});
			game.hu = [];
			game.undoEndRound();
			openDeclareHuDialog(_p, game);
			handleAction(_p, game);
		},
		[openDeclareHuDialog, handleAction]
	);

	function setConfirmHuTimeout() {
		setOpenTimeoutId(
			setTimeout(function () {
				setConfirmHu(false);
			}, 3000)
		);
	}

	const handleConfirmHuPrompt = useCallback(() => {
		if (confirmHu) {
			clearTimeout(openTimeoutId);
		}
		setConfirmHu(true);
		setConfirmHuTimeout();
	}, [confirmHu, openTimeoutId]);

	const showTiles = useCallback(
		(_p: number, game: Game) => {
			const p = game.ps[_p];
			if (!p.sT) {
				p.sT = true;
				updateGame(game);
			}
		},
		[updateGame]
	);

	const nextRound = useCallback(
		(game: Game) => {
			game.prepForNewRound();
			game.initRound();
			primaryLRU.clear();
			updateGame(game);
			haptic && triggerHaptic(ImpactStyle.Heavy);
		},
		[haptic, updateGame]
	);

	const handleHu = useCallback(
		(game: Game, _p: number, HH?: IHWPx, tai = 0, zimo = false) => {
			const { ps, lTh, n = [] } = game;
			const p = ps[_p];
			if (isEmpty(p.lTa) && lThAvailHu) {
				ps[n[7]]?.removeFromDiscarded(lTh);
				p.getNewTile(lTh);
				game.lTh = { r: lTh.r };
			}
			p.sT = true;
			p.cfH = true;
			game.sk = [];
			game.t[2] = null;
			if (!isEmpty(HH)) {
				game.declareHu([
					_p,
					Math.min(tai || HH.maxPx, n[9]),
					Number(zimo || HH.self),
					...(HH.pxs || []).map(p => p.hD)
				]);
			} else {
				game.declareHu([_p, tai, Number(zimo)]);
			}
			game.endRound();
			updateGame(game);
			haptic && triggerHaptic(ImpactStyle.Heavy);
		},
		[haptic, lThAvailHu, updateGame]
	);

	// I know... unreadable af but gna do this to save on const declaration memory
	return {
		announceHuModal: {
			game: currGame,
			playerSeat,
			show: player?.sT,
			showNextRound: useMemo(() => {
				if (f[0] === false || n[2] === 9) {
					return false;
				}
				const nextDealer = f[2] ? findRight(n[2]) : n[2];
				return (
					nextDealer === playerSeat ||
					(player?.uN === cO && isBot(ps[nextDealer]?.id))
				);
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [n[2], f[1], f[2], playerSeat, player?.uN, cO]),
			handleChips: useCallback(() => setShowPay(true), [setShowPay]),
			huFirst: () => huFirst(playerSeat, currGame),
			nextRound: () => nextRound(currGame),
			onClose: () => showTiles(playerSeat, currGame)
		},
		confirmHu,
		declareHuModal: {
			game: currGame,
			playerSeat,
			show: showDeclareHu,
			handleHu,
			updateGame, // not used
			onClose: (hu: boolean) => hideDeclareHuModal(playerSeat, currGame, hu)
		},
		showAnnounceHuModal: currGame?.hu?.length > 2 || f[5],
		showDeclareHu,
		handleAction,
		handleConfirmHuPrompt,
		openDeclareHuDialog
	};
}

export default useControlsHu;
