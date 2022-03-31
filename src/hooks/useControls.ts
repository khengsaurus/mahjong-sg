import { ImpactStyle } from '@capacitor/haptics';
import { CardName, CardNameEn, Exec, LocalFlag, MeldName, MeldType } from 'enums';
import isEmpty from 'lodash.isempty';
import { Game } from 'models';
import { isDev, isDevBot, triggerHaptic } from 'platform';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ControlsTextChi, ControlsTextEng, ScreenTextEng } from 'screenTexts';
import { IStore } from 'store';
import { getHighlightColor } from 'style/MuiStyles';
import { IControls, IHWPx } from 'typesPlus';
import {
	findRight,
	getCardFromHashId,
	getCardName,
	indexToWind,
	isBot,
	isEmptyTile,
	revealTile
} from 'utility';
import { mainLRUCache } from 'utility/LRUCache';
import { useFirstEffect, useOptions } from '.';
import { AppContext } from './AppContext';
import { IUseNotifs } from './useNotifs';

function useControls(
	lThAvail: boolean,
	lThAvailHu: boolean,
	delayLeft: number,
	isHuLocked: boolean,
	notifOutput: IUseNotifs,
	HH: IHWPx,
	updateGame: (game: Game) => void
): IControls {
	const { playerSeat, selectedTiles, setSelectedTiles } = useContext(AppContext);
	const {
		game,
		gameId,
		haptic,
		localGame,
		tHK,
		theme: { tableColor, enOnly = false },
		user
	} = useSelector((state: IStore) => state);
	const {
		isFirstToHu,
		othersFirstToHu,
		othersSecondToHu,
		isSecondToHu,
		offerPong,
		offerKang,
		notifs
	} = notifOutput;
	const [exec, setExec] = useState<any[]>([]);
	const [showPay, setShowPay] = useState(false);
	const [showLogs, setShowLogs] = useState(false);
	const [showText, setShowText] = useState(true);
	const [confirmHu, setConfirmHu] = useState(false);
	const [showAdmin, setShowAdmin] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [showDeclareHu, setShowDeclareHu] = useState(false);
	const [showLeaveAlert, setShowLeaveAlert] = useState(false);
	const [openTimeoutId, setOpenTimeoutId] = useState<NodeJS.Timeout>(null);

	// Consts
	const currGame = gameId === LocalFlag ? localGame : game;
	const { cO, f, hu, lTh, n = [], prE, ps, sk, ts } = currGame;
	const player = ps[playerSeat];
	const dealerName = ps[prE._d || n[2]]?.uN;

	// Dependencies
	const skRef = JSON.stringify(sk);
	const pIdsRef = JSON.stringify(ps.map(p => p.id));
	const execRef = JSON.stringify(exec);

	const { bot2ndToHu, toExec, midDelayRef } = useMemo(
		() => {
			const midDelayRef = delayLeft >= 2 && delayLeft <= 3;
			const bot2ndToHu =
				sk.length > 1 &&
				midDelayRef &&
				!!sk
					.slice(1, 4)
					?.find(s => s.includes(Exec.HU) && isBot(ps[Number(s[0])]?.id));
			const toExec = exec.join('').startsWith(sk[0]?.slice(0, 1)); // enable user to pong when can hu, bot to draw when can pong etc

			return { bot2ndToHu, toExec, midDelayRef };
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[delayLeft, execRef, skRef, pIdsRef]
	);

	const seat = useMemo(() => {
		const wind = indexToWind((playerSeat - n[2] + 4) % 4);
		return enOnly ? CardNameEn[wind] : CardName[wind];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enOnly, playerSeat, n[2]]);

	const texts = useMemo(
		() =>
			f[0]
				? [
						// `Dealer: ${dealerName}`,
						`Seat: ${seat}, ${ScreenTextEng.CHIPS}: ${
							Math.round(player?.bal) || 0
						}`,
						`${ts?.length || 0} tiles left`,
						`${
							n[3] === playerSeat
								? ScreenTextEng.YOUR_TURN
								: `${ps[n[3]]?.uN}'s turn`
						}`
				  ]
				: [
						`${ScreenTextEng.CHIPS}: ${Math.round(player?.bal) || 0}`,
						ScreenTextEng.GAME_ENDED
				  ],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[dealerName, f[0], player?.bal, playerSeat, ps[n[3]]?.uN, ts?.length, seat]
	);

	/* ----------------------------------- Options ----------------------------------- */
	const { meld, canChi, canPong, canKang } = useOptions(
		player,
		selectedTiles,
		lTh,
		f[3],
		n[7],
		n[3],
		playerSeat,
		lThAvail
	);

	/* ----------------------------------- Action ----------------------------------- */
	const updateGameTaken = useCallback(
		(_p: number, game: Game, resetLTh: boolean = true, halfA: boolean = true) => {
			game.t[2] = null;
			game.f[3] = true;
			game.n[3] = _p;
			if (resetLTh) {
				game.lTh = { r: game.lTh.r };
			}
			if (halfA) {
				game.f[3] = true;
				game.n[6] = _p;
			}
		},
		[]
	);

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
					'useControls.useEffect -> check if should auto open Declare Hu modal'
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
			setExec([]);
			game.prepForNewRound();
			game.initRound();
			mainLRUCache.clear();
			updateGame(game);
			haptic && triggerHaptic(ImpactStyle.Heavy);
		},
		[haptic, updateGame]
	);

	/* ----------------------------------- Game actions ----------------------------------- */
	const drawDisabled = useMemo(
		() =>
			// Added canChi || canPong || canKang to prevent accidental draw
			playerSeat !== n[3] || f[3] || delayLeft > 0 || canChi || canPong || canKang,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[playerSeat, n[3], f[3], delayLeft > 0, canChi, canPong, canKang]
	);

	const handleDrawGame = useCallback((game: Game) => {
		game.f[5] = true;
		game.ps.forEach(p => {
			if (isBot(p.id)) {
				p.sT = true;
			}
		});
		game.newLog(ScreenTextEng.FIFTEEN_LEFT);
		game.endRound();
	}, []);

	const handleBuHua = useCallback(
		(_p: number, game: Game) => {
			const p = game.ps[_p];
			if (p) {
				const initNoHiddenTiles = p.countAllHiddenTiles();
				while (p.countAllHiddenTiles() === initNoHiddenTiles) {
					if (game.ts?.length > 15) {
						game.giveT(1, _p, true, true, true);
					} else {
						handleDrawGame(game);
						break;
					}
				}
				game.f[3] = true;
				if (haptic && _p === playerSeat) {
					triggerHaptic(ImpactStyle.Medium);
				}
			}
		},
		[haptic, playerSeat, handleDrawGame]
	);

	const handleDraw = useCallback(
		(_p: number, game: Game) => {
			if (!isHuLocked) {
				if (game?.ts?.length > 15) {
					const { drewHua } = game.giveT(1, _p, false, true, true);
					if (drewHua) {
						handleBuHua(_p, game);
					}
					updateGameTaken(_p, game, false);
				} else {
					handleDrawGame(game);
				}
				handleAction(_p, game);
				if (haptic && _p === playerSeat) {
					triggerHaptic();
				}
			}
		},
		[
			handleAction,
			handleBuHua,
			haptic,
			isHuLocked,
			handleDrawGame,
			playerSeat,
			updateGameTaken
		]
	);

	const handleChi = (cs: string[]) => {
		if (n[3] === playerSeat && player?.uN === user?.uN) {
			return handleTake(playerSeat, currGame, false, ...cs);
		}
	};

	const handleTake = useCallback(
		(_p: number, game: Game, kang = false, ...cs: string[]) => {
			if (!isHuLocked && !isEmpty(game)) {
				const { lTh, n = [], ps } = game;
				const p = ps[_p];
				let toTake: IShownTile[] = [];
				if (_p === playerSeat && isEmpty(cs)) {
					toTake = [...meld];
				} else if (cs.length > 2) {
					let refCs = [...cs];
					(lThAvail
						? [lTh, ...p.revealedHTs(tHK)]
						: p.revealedHTs(tHK)
					).forEach((t: IShownTile) => {
						if (refCs.includes(t.c)) {
							toTake.push(t);
							refCs.splice(
								refCs.findIndex(c => c === t.c),
								1
							);
						}
					});
					toTake = toTake.sort((a, b) => (a.c <= b.c ? -1 : 1));
				}

				if (!isEmpty(toTake) && p) {
					if (!!toTake.find(t => t.r === lTh.r)) {
						ps[n[7]]?.removeFromDiscarded(lTh);
						game.lTh = { r: lTh.r }; // setting it as an empty tile ref !important
					}
					p.createMeld(toTake);
					const _c =
						(toTake.find(t => t.r === lTh.r) ? lTh?.c : toTake[0]?.c) || ''; // get card of tile to take
					const cardName = getCardName(_c);
					if (toTake.every(t => t.c === _c) && toTake?.length > 2) {
						if (toTake.length === 4 || kang) {
							game.f[2] = true;
							if (toTake[0].r === lTh.r) {
								game.lTh = { r: lTh.r };
							}
							game.newLog(
								`${p.uN} ${MeldName[MeldType.KANG]}'d ${cardName}`
							);
							game.handleKangPayment(_p, toTake);
							handleBuHua(_p, game);
						} else {
							game.newLog(
								`${p.uN} ${MeldName[MeldType.PONG]}'d ${cardName}`
							);
						}
					} else {
						game.newLog(`${p.uN} chi'd ${cardName}`);
					}
					updateGameTaken(_p, game, true); // TODO: MONITOR
					handleAction(_p, game);
					if (haptic && _p === playerSeat) {
						triggerHaptic(ImpactStyle.Medium);
					}
				}
			}
		},
		[
			handleBuHua,
			haptic,
			isHuLocked,
			lThAvail,
			meld,
			playerSeat,
			tHK,
			updateGameTaken,
			handleAction
		]
	);

	const handleKang = useCallback(
		(_p: number, game: Game, card?: string) => {
			if (!isHuLocked || toExec) {
				let toKang: IShownTile[];
				let p = game.ps[_p];
				if (_p === playerSeat && !isEmpty(selectedTiles)) {
					toKang = selectedTiles;
				} else {
					let toRev = card
						? p
								.allHiddenTiles()
								.filter(t => getCardFromHashId(t.i, tHK) === card)
						: null;
					toKang = isEmpty(toRev) ? [] : toRev.map(t => revealTile(t, tHK));
				}
				let delay = false;
				if (!isEmpty(toKang)) {
					p.createMeld(toKang, toKang.length === 1);
					game.f[2] = true;
					if (toKang[0].r === game.lTh?.r) {
						game.lTh = { r: game.lTh?.r };
					} else {
						if (toKang.length === 1) {
							// Allow for 抢杠
							game.n[7] = _p;
							game.lTh = toKang[0];
							delay = true;
						}
					}
					game.newLog(
						`${p.uN} ${MeldName[MeldType.KANG]}'d ${getCardName(
							toKang[0]?.c
						)}`
					);
					game.handleKangPayment(_p, toKang);
					handleBuHua(_p, game);
					if (delay) {
						game.handleDelay();
					}
					updateGameTaken(_p, game, false);
					handleAction(_p, game);
				}
				if (haptic && _p === playerSeat) {
					triggerHaptic(ImpactStyle.Medium);
				}
			}
		},
		[
			toExec,
			haptic,
			handleAction,
			handleBuHua,
			isHuLocked,
			selectedTiles,
			tHK,
			playerSeat,
			updateGameTaken
		]
	);

	const handlePong = useCallback(
		(_p: number, game: Game) => {
			if (!isHuLocked) {
				if (_p === playerSeat && !isEmpty(selectedTiles)) {
					if (selectedTiles.length === 1) {
						handleKang(_p, game);
					} else {
						handleTake(_p, game);
					}
				}
				if (haptic && _p === playerSeat) {
					triggerHaptic(ImpactStyle.Medium);
				}
			}
		},
		[haptic, isHuLocked, playerSeat, selectedTiles, handleKang, handleTake]
	);

	const handleThrow = useCallback(
		(_p: number, game: Game, c?: string) => {
			if (!isHuLocked && !isEmpty(game)) {
				let t: IShownTile;
				let p = game.ps[_p];
				if (_p === playerSeat && !c) {
					t = selectedTiles[0];
				} else if (c) {
					t = p.allHiddenTiles().find(t => getCardFromHashId(t.i, tHK) === c);
					if (t) {
						t = revealTile(t, tHK);
					}
				}

				if (!isEmpty(t)) {
					p.discard(t);
					p.setHiddenTiles();
					game.f[1] = false;
					game.sk = [];
					game.tileThrown(t, _p);
					game.handleDelay();
					handleAction(_p, game);
				}
				if (haptic && _p === playerSeat) {
					triggerHaptic(ImpactStyle.Medium);
				}
			}
		},
		[handleAction, haptic, isHuLocked, playerSeat, selectedTiles, tHK]
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

	const handleSkipNotif = useCallback(
		(game: Game) => {
			game.t[2] = null;
			game.sk = [];
			updateGame(game);
		},
		[updateGame]
	);

	/* ----------------------------------- Bot & exec ----------------------------------- */

	function handleExec(exec: any[]) {
		if (!isEmpty(exec)) {
			isDevBot && console.info('handleExec called with: ' + exec);
			const _b = Number(exec[0]);
			switch (exec[1]) {
				case Exec.DISCARD:
					if (ts.length === 15) {
						handleDrawGame(currGame);
						updateGame(currGame);
					} else {
						handleThrow(_b, currGame, exec[2]);
					}
					break;
				case Exec.DRAW:
					handleDraw(_b, currGame);
					break;
				case Exec.HU:
					handleHu(currGame, _b, exec[2] as IHWPx);
					// probably shd pass these fns to AnnounceHuModal and call from there...
					setShowPay(false);
					setShowAdmin(false);
					setShowSettings(false);
					break;
				case Exec.KANG:
					handleTake(_b, currGame, true, exec[2], exec[2], exec[2], exec[2]);
					break;
				case Exec.PONG:
					handleTake(_b, currGame, false, exec[2], exec[2], exec[2]);
					break;
				case Exec.SELF_KANG:
					handleKang(_b, currGame, exec[2]);
					break;
				case Exec.SKIP:
					handleSkipNotif(currGame);
					break;
				case Exec.TAKE:
					handleTake(_b, currGame, false, ...exec.slice(2, 5));
					break;
				default:
					break;
			}
			setExec([]);
		}
	}

	/**
	 * @description Call handleExec(exec) if exec, !isHuLocked, and exec tallies with sk[0] -> 1h, 1k, 1p etc.
	 * Effective only when delay on, i.e. negligible when exec contains 'discard', 'draw', 'handleKang' etc
	 */
	const n10 = n[10];
	const f1 = f[1];
	useEffect(() => {
		let didExec = false;
		if (midDelayRef && sk.every(s => isBot(ps[Number(s[0])].id))) {
			didExec = true;
			handleExec([playerSeat, Exec.SKIP]);
		} else {
			// only non-bots can trigger isHuLocked
			if (
				!isEmpty(exec) &&
				!isHuLocked &&
				(delayLeft === 0 || toExec || bot2ndToHu)
			) {
				isDev && console.info('useControls.useEffect -> handleExec');
				didExec = true;
				const _p = Number(exec[0]);
				if (!isBot(ps[_p]?.id)) {
					handleExec(exec); // Execute immediately if not bot
				} else if (!f[1]) {
					if (
						exec[1] === Exec.DRAW ||
						exec[1] === Exec.DISCARD ||
						exec[1] === Exec.HU ||
						exec[1] === Exec.SELF_KANG
					) {
						handleExec(exec); // exec if draw or discard
					} else {
						if (f[8]) {
							// if easy, math.random to decide whether to exec or skip/ draw instead of chi
							const toExec = Math.random() > 0.5;
							if ([Exec.PONG, Exec.KANG].includes(exec[1])) {
								toExec
									? handleExec(exec)
									: exec[0] === n[3]
									? handleExec([n[3], Exec.DRAW])
									: handleExec([exec[0], Exec.SKIP]);
							} else if (exec[1] === Exec.TAKE) {
								toExec ? handleExec(exec) : handleExec([n[3], Exec.DRAW]);
							}
						} else {
							handleExec(exec); // exec if normal difficulty
						}
					}
				}
			}
		}

		return () => {
			if (didExec) {
				setExec([]);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		bot2ndToHu,
		midDelayRef,
		execRef,
		toExec,
		n10,
		f1,
		handleSkipNotif,
		isHuLocked,
		pIdsRef,
		skRef
	]);

	const setGamePaused = (pause = false) => {
		if (pause !== currGame.f[1]) {
			currGame.f[1] = pause;
			updateGame(currGame);
		}
	};

	/* --------------------------------- End bot & exec --------------------------------- */

	useEffect(() => {
		haptic && playerSeat === n[3] && triggerHaptic(ImpactStyle.Heavy);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [haptic, playerSeat, n[3]]);

	const highlight = useMemo(
		() => (playerSeat === n[3] ? getHighlightColor(tableColor) : null),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[playerSeat, tableColor, n[3]]
	);

	const _HH = isEmpty(HH) ? (f[6] ? { hand: {}, px: [] } : {}) : HH;

	/* --------------------------------- Button text --------------------------------- */

	const pongText = useMemo(() => {
		return enOnly
			? canKang
				? ControlsTextEng.KANG
				: ControlsTextEng.PONG
			: canKang
			? ControlsTextChi.KANG
			: ControlsTextChi.PONG;
	}, [enOnly, canKang]);

	const drawText = useMemo(() => {
		return enOnly
			? ts?.length === 15
				? ControlsTextEng.END
				: ControlsTextEng.DRAW
			: ts?.length === 15
			? ControlsTextChi.END
			: ControlsTextChi.DRAW;
	}, [enOnly, ts?.length]);

	// I know... unreadable af but gna do this to save on const declaration memory
	return {
		game: currGame,
		player,
		notif: {
			notifs,
			timeout: delayLeft,
			pong:
				offerPong &&
				!isHuLocked &&
				(othersFirstToHu ? delayLeft <= 5 : true) &&
				!othersSecondToHu
					? () => setExec([playerSeat, MeldType.PONG, lTh?.c])
					: null,
			kang:
				offerKang &&
				!isHuLocked &&
				(othersFirstToHu ? delayLeft <= 5 : true) &&
				!othersSecondToHu
					? () => setExec([playerSeat, MeldType.KANG, lTh?.c])
					: null,
			hu:
				isFirstToHu || (isSecondToHu && delayLeft <= 5)
					? () => openDeclareHuDialog(playerSeat, currGame)
					: null,
			skip: useMemo(() => {
				return (
					(offerPong || offerKang || isFirstToHu) &&
					sk.every(s => Number(s[0]) === playerSeat)
				);
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [offerPong, offerKang, isFirstToHu, skRef])
				? () => handleSkipNotif(currGame)
				: null
		},
		topRight: {
			handlePay: useCallback(() => setShowPay(prev => !prev), [setShowPay]),
			handleLogs: useCallback(() => setShowLogs(prev => !prev), [setShowLogs]),
			showText,
			showLogs
		},
		topLeft: {
			handleSettings: useCallback(
				() => setShowSettings(prev => !prev),
				[setShowSettings]
			),
			handleScreenText: useCallback(
				() => setShowText(prev => !prev),
				[setShowText]
			),
			handleAdmin: useCallback(() => setShowAdmin(prev => !prev), [setShowAdmin]),
			setShowLeaveAlert,
			showText,
			texts
		},
		bottomLeft: {
			handleChi: () => handleTake(playerSeat, currGame),
			handlePong: () => handlePong(playerSeat, currGame),
			openDeclareHuDialog: () => openDeclareHuDialog(playerSeat, currGame),
			disableChi: !canChi || delayLeft > 0,
			disablePong: !canPong && !canKang,
			disableHu: isHuLocked,
			pongText,
			confirmHu,
			showDeclareHu,
			HH: _HH,
			highlight
		},
		bottomRight: {
			handleThrow: () =>
				ts?.length === 15
					? handleDrawGame(currGame)
					: handleThrow(playerSeat, currGame),
			handleDraw: () => handleDraw(playerSeat, currGame),
			handleOpen: handleConfirmHuPrompt,
			// handleOpen: () => handleHu(currGame, playerSeat, {}, 1, false),
			confirmHu,
			disableThrow: selectedTiles?.length !== 1 || n[3] !== playerSeat || !f[3],
			disableDraw:
				ts?.length === 15 && f[3] && n[3] === playerSeat ? false : drawDisabled,
			drawText,
			HH: _HH,
			highlight,
			showDeclareHu,
			taken: n[3] === playerSeat && f[3]
		},
		payModal: {
			game: currGame,
			playerSeat,
			show: showPay,
			updateGame,
			onClose: useCallback(() => setShowPay(false), [setShowPay])
		},
		settingsModal: {
			game: currGame,
			playerSeat,
			show: showSettings,
			onClose: useCallback(() => setShowSettings(false), [setShowSettings])
		},
		declareHuModal: {
			game: currGame,
			playerSeat,
			show: showDeclareHu,
			handleHu,
			updateGame, // not used
			onClose: (hu: boolean) => hideDeclareHuModal(playerSeat, currGame, hu)
		},
		gameInfoModal: {
			game: currGame,
			show: showAdmin,
			updateGame,
			onClose: useCallback(() => setShowAdmin(false), [setShowAdmin])
		},
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
		showLeaveAlert,
		showBottomControls: !isHuLocked && !showDeclareHu,
		showAnnounceHuModal: currGame?.hu?.length > 2 || f[5],
		exec,
		handleChi,
		setExec,
		setGamePaused
	};
}

export default useControls;
