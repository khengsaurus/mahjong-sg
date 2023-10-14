import { Exec, MeldName, MeldType } from 'enums';
import { isEmpty } from 'lodash';
import { Game } from 'models';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ControlsTextChi, ControlsTextEng, ScreenTextEng } from 'screenTexts';
import { IStore } from 'store';
import { getHighlightColor } from 'style/MuiStyles';
import { IControlsMain, IHWPx } from 'typesPlus';
import { getCardFromHashId, getCardName, isBot, revealTile } from 'utility';
import { useOptions } from '.';
import { AppContext } from './AppContext';
import { IUseNotifs } from './useNotifs';

function useControlsMain(
	confirmHu,
	delayLeft: number,
	HH: IHWPx,
	isHuLocked: boolean,
	lThAvail: boolean,
	lThAvailHu: boolean,
	notifOutput: IUseNotifs,
	showDeclareHu,
	handleAction: (_p: number, g: Game) => void,
	updateGame: (game: Game) => void,
	handleConfirmHuPrompt: () => void,
	openDeclareHuDialog: (_p: number, game: Game) => void
): IControlsMain {
	const { currGame, playerSeat, selectedTiles } = useContext(AppContext);
	const {
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
	const { f, lTh, n = [], ps, sk, ts } = currGame;
	const player = ps[playerSeat];

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
			}
		},
		[handleDrawGame]
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
			}
		},
		[handleAction, handleBuHua, isHuLocked, handleDrawGame, updateGameTaken]
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
					updateGameTaken(_p, game, true);
					handleAction(_p, game);
				}
			}
		},
		[
			handleBuHua,
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
			}
		},
		[
			toExec,
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
			}
		},
		[isHuLocked, playerSeat, selectedTiles, handleKang, handleTake]
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
			}
		},
		[handleAction, isHuLocked, playerSeat, selectedTiles, tHK]
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
		},
		[lThAvailHu, updateGame]
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
		showBottomControls: !isHuLocked && !showDeclareHu,
		exec,
		handleChi,
		setExec,
		setGamePaused
	};
}

export default useControlsMain;
