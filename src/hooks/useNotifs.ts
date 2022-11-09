import { Exec, MeldType } from 'enums';
import { isDev } from 'platform';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import { findLeft, getCardName } from 'utility';
import { AppContext } from '.';

export interface IUseNotifs {
	isFirstToHu: boolean;
	othersFirstToHu: string;
	isSecondToHu: boolean;
	othersSecondToHu: string;
	offerPong: boolean;
	offerKang: boolean;
	notifs: string[];
	showChiAlert: boolean;
	toChi: IShownTile[][];
	setShowChiAlert: (_: boolean) => void;
}

const useNotifs = (
	delayLeft: number,
	lThAvail: boolean,
	isHuLocked: boolean
): IUseNotifs => {
	const { currGame, playerSeat } = useContext(AppContext);
	const {
		tHK,
		theme: { enOnly = false }
	} = useSelector((state: IStore) => state);
	const [showChiAlert, setShowChiAlert] = useState(false);
	const [toChi, setToChi] = useState<IShownTile[][]>([]);

	const { f = [], lTh, n = [], ps, sk } = currGame;
	const p = ps[playerSeat];
	const canTakeLT = n[7] !== playerSeat && lThAvail;

	const skRef = JSON.stringify(sk);
	const lastThrownCard = useMemo(() => {
		return getCardName(lTh?.c, enOnly);
	}, [enOnly, lTh?.c]);

	useEffect(() => {
		if (lThAvail && !f[3] && n[7] === findLeft(playerSeat)) {
			const offer = [];
			const shown_hTs = p.revealedHTs(tHK);
			let flagShow = false;
			let twoLess: IShownTile = null;
			let oneLess: IShownTile = null;
			let oneMore: IShownTile = null;
			let twoMore: IShownTile = null;
			const { n: lThN, s: lThS } = lTh;
			shown_hTs.forEach(t => {
				if (t.s === lThS) {
					if (t.n === lThN - 2) {
						twoLess = t;
					}
					if (t.n === lThN - 1) {
						oneLess = t;
					}
					if (t.n === lThN + 1) {
						oneMore = t;
					}
					if (t.n === lThN + 2) {
						twoMore = t;
					}
				}
			});
			if (twoLess && oneLess) {
				flagShow = true;
				offer.push([twoLess, oneLess, lTh]);
			}
			if (oneLess && oneMore) {
				flagShow = true;
				offer.push([oneLess, lTh, oneMore]);
			}
			if (oneMore && twoMore) {
				flagShow = true;
				offer.push([lTh, oneMore, twoMore]);
			}
			if (flagShow) {
				setToChi(offer);
				setShowChiAlert(true);
				setTimeout(() => setShowChiAlert(false), 6000);
			}
		} else {
			setToChi([]);
			setShowChiAlert(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lTh.n, lTh.s, lThAvail, playerSeat, f[3], n[7], tHK]);

	const notifs = useMemo(() => {
		let isFirstToHu = false;
		let isSecondToHu = false;
		let othersFirstToHu: string = '';
		let othersSecondToHu: string = '';
		let othersCanTake = false;
		let offerPong = false;
		let offerKang = false;
		let notifs: string[] = [];

		if (delayLeft > 0 && skRef) {
			isDev && console.info('useControlsMain.useMemo -> notifs');
			isFirstToHu = sk[0] === `${playerSeat}${Exec.HU}`;
			if (sk.length > 1) {
				othersFirstToHu = !isFirstToHu && sk[0].includes(Exec.HU) ? sk[0] : '';
				isSecondToHu = !!sk
					.slice(1, 4)
					.find(s => s === `${playerSeat}${Exec.HU}`);
				othersSecondToHu =
					isFirstToHu && sk.slice(1, 4).find(s => s.includes(Exec.HU));
			}
			othersCanTake = !!sk.find(s => s[0] !== `${playerSeat}`);
			if (canTakeLT && !(isFirstToHu && delayLeft > 5 && !!othersSecondToHu)) {
				// don't offer pong/kang if another can hu
				const offerTake = !isHuLocked && !othersFirstToHu && !othersSecondToHu;
				offerPong =
					offerTake && !!sk.find(s => s === `${playerSeat}${MeldType.PONG}`);
				offerKang =
					offerTake && !!sk.find(s => s === `${playerSeat}${MeldType.KANG}`);
			}

			if (isFirstToHu && othersCanTake && delayLeft > 5) {
				// player has priority hu for first 6s
				notifs = [
					`You can take ${lastThrownCard}`,
					...[
						`The first 6s are for you to hu.`,
						!!othersSecondToHu
							? `After that, ${ps[Number(othersSecondToHu[0])].uN} can hu.`
							: `After that, others can take ${lastThrownCard}.`
					]
				];
			} else if (
				othersFirstToHu &&
				delayLeft > 5 &&
				(isSecondToHu || offerPong || offerKang)
			) {
				// player has secondary take offer, waiting for the first 6s
				notifs = [
					`Waiting...`,
					`You can take ${lastThrownCard} if ${
						ps[Number(othersFirstToHu[0])].uN
					} doesn't hu`
				];
			} else if (isFirstToHu || isSecondToHu || offerPong || offerKang) {
				// FFA after first 6s
				notifs = [`You can take ${lastThrownCard}`];
			} else {
				notifs = [`Waiting...`];
			}
		} else {
			notifs = [];
		}

		return {
			isFirstToHu,
			othersFirstToHu,
			othersSecondToHu,
			isSecondToHu,
			offerPong,
			offerKang,
			notifs
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [delayLeft, lastThrownCard, playerSeat, skRef]);

	return { ...notifs, showChiAlert, setShowChiAlert, toChi };
};

export default useNotifs;
