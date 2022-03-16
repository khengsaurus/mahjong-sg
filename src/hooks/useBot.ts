import { isEmpty } from 'lodash';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getBotEval } from 'bot';
import { Exec, LocalFlag } from 'enums';
import { IStore } from 'store';
import { findLeft, findOpp, findRight, isBot, isDev } from 'utility';
import { AppContext } from './AppContext';

/**
 * Flow for bot:
 *   -> useBot.useEffect -> getBotEval:
 *     -> if _p's turn:
 *     -> * get _p discard categories (req for hand objectives)
 *     -> ** get _p hand objectives
 *     -> setExec (chi | draw)
 *   -> useControls.handleExec
 *     -> *, **
 *     -> *** getDiscardHelper -> decide on discard tile
 *     -> setExec (-> handleDiscard)
 *     -> Game.handleDelay() -> set sk
 *   -> useBot.useEffect -> getBotEval (for each other _p's that can take action)
 *     -> *, **
 *     -> if handObjectives align with action, -> setExec (-> handleTake)
 *     -> *** ...
 *
 * Note:
 * * useBot.getBotEval will only call for bots
 * * Critical dependencies in useControls.useEffect's + useBot.useEffect to trigger this cycle
 */
function useBot(isHuLocked: boolean, delayLeft: number, lThAvail: boolean, setExec: (e: any[]) => void) {
	const { playerSeat } = useContext(AppContext);
	const { game, gameId, localGame } = useSelector((state: IStore) => state);
	const currGame = gameId === LocalFlag ? localGame : game;
	const { cO, f = [], lTh, n = [], ps, sk, t = [], ts } = currGame;
	const player = ps[playerSeat];
	const pIds = ps.map(p => p.id);

	const botTimerRef = useRef<NodeJS.Timeout | null>();

	// Dependencies
	const dFRef = JSON.stringify(t[2]);
	const delayOver = delayLeft === 0;
	const lThRef = lTh?.c + lTh.r;
	const pidsRef = JSON.stringify(pIds);
	const skRef = JSON.stringify(sk);
	// 3rd condition to stop calculting 4th
	const botToMove = f[3] && !f[4] && n[3] !== playerSeat && pIds.includes(ps[n[3]].id);

	const toHandleBots = useMemo(
		() => player?.uN === cO && f[0] && !f[1] && !isHuLocked && !!pIds.find(pid => isBot(pid)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[cO, f[0], f[1], isHuLocked, pidsRef, player?.uN]
	);

	useEffect(() => {
		if (toHandleBots && (!f[3] || botToMove)) {
			isDev() && console.info('useBot.useEffect');
			botTimerRef.current = setTimeout(() => {
				setExec([]);
				const execs = [];
				// Trying to reduce overhead of this flow with this logical checks to set _p to exec for
				const next = findRight(n[7]);
				let b =
					f[3] && !f[4] // taken and not thrown
						? [n[6]] // exec only for bot that has taken
						: !f[3] && !f[4] // not taken and not thrown
						? isEmpty(sk) // exec only for next if none can action
							? [next]
							: [...sk.map(s => Number(s[0])), next] // exec only for those than can action
						: [next, findOpp(n[7]), findLeft(n[7])];
				b = b.filter(_p => isBot(ps[_p].id));
				if (b.length > 0) {
					for (let i = 0; i < b.length; i++) {
						const newExec = getBotEval(currGame, b[i], lThAvail);
						if (newExec.length > 0) {
							execs.push([b[i], ...newExec]);
						}
						if (newExec[0] === Exec.HU) {
							break;
						}
					}
					const _exec: any[] =
						execs.find(
							// use one for loop here, search in order of importance
							e =>
								e[1] === Exec.HU ||
								e[1] === Exec.KANG ||
								e[1] === Exec.PONG ||
								Number(e[0]) === n[3] ||
								(e[1] !== Exec.DRAW && e[1] !== Exec.DISCARD)
						) || execs[0];
					if (!isEmpty(_exec)) {
						setExec(_exec);
					}
				}
			}, n[10]);
		}

		return () => {
			setExec([]);
			clearTimeout(botTimerRef.current);
			botTimerRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [delayOver, dFRef, lThRef, lThAvail, skRef, f[3], f[4], n[3], n[7], n[10], toHandleBots, ts?.length]);
}

export default useBot;
