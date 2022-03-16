import { isEmpty } from 'lodash';
import { getDiscardCategories, getDiscardHelper, getHandObjectives } from 'bot';
import { CardName, DaPai, Exec, LocalFlag, MeldType, Suit, Wind } from 'enums';
import {
	allScoringHands,
	canHuWithoutMelds,
	FlowersF,
	FlowersS,
	HandPoint,
	HBFCards,
	ScoringHand,
	skipPongHBF,
	skipWinds
} from 'handEnums';
import { Game } from 'models';
import { IHWPx, IPoint } from 'typesPlus';
import {
	arrToSetArr,
	containsPongOrKang,
	excludes,
	getTileHashKey,
	indexToWind,
	isDev,
	isTakenTile,
	shouldChi,
	sortTiles
} from 'utility';
import { getMeldsPairs, scoreHand } from 'utility/handFns';
import { mainLRUCache } from 'utility/LRUCache';

/**
 * @return { !isEmpty(lTa) ? lTa : lTh, (player melded lTh) }
 */
function getLastThrownOrTaken(game: Game, _p: number, tHK: number) {
	const { f = [], lTh, n = [], ps } = game;
	const p = ps[_p];
	let meldedLTa = false;
	let lTa_lTh: IShownTile;
	if (f[3] && n[3] === _p) {
		if (isEmpty(p.lTa)) {
			if (isTakenTile(lTh)) {
				meldedLTa = true;
				lTa_lTh = p.sTs.find(t => t.r === lTh.r) || {};
			} else {
				lTa_lTh = {};
			}
		} else {
			lTa_lTh = p.revealedLTa(tHK);
		}
	} else {
		lTa_lTh = isTakenTile(lTh) ? {} : lTh;
	}
	if (isDev() && isEmpty(lTa_lTh)) {
		console.info('getLastThrownOrTaken: lTa/lTh isEmpty');
	}
	return { lTa_lTh, meldedLTa };
}

interface IGetHands {
	hands: IHand[];
	hsWPxs: IHWPx[];
	HH: IHWPx;
	lTa_lTh: IShownTile;
}

function getHands(game: Game, _p: number, tHK: number, _shown_hTs?: IShownTile[]): IGetHands {
	const { f = [], n = [], ps, sHs } = game;
	const p = ps[_p];
	const { hTs = [], lTa = {}, ms = [], sTs } = p || {};
	const Fs = p?.flowersRepr();
	const lTaSelf = n[3] === _p && f[3] && !isEmpty(lTa);
	const { lTa_lTh, meldedLTa } = getLastThrownOrTaken(game, _p, tHK);
	const key = `gh-${ms.join('')}${hTs?.map(t => t.r).join('')}${lTa_lTh.c}${meldedLTa}${lTaSelf}${Fs}${sHs.join('')}`;
	const cached = mainLRUCache.read(key);
	if (cached) {
		return cached;
	}

	const shown_hTs = _shown_hTs ? _shown_hTs : p?.revealedHTs(tHK);
	const cW = game?.currentWind() || Wind.E;
	const sW = indexToWind((_p - n[2] + 4) % 4);

	const hands = getMeldsPairs(
		sortTiles(meldedLTa || isEmpty(lTa_lTh) ? shown_hTs : [...shown_hTs, lTa_lTh]),
		lTa_lTh
	);
	if (!isEmpty(ms)) {
		const msSorted = ms.sort();
		hands.forEach(h => {
			h.openMsStr = msSorted;
			h.openTs = sTs;
		});
	}

	const hsWPxs: IHWPx[] = [];
	let maxPxAch = 0;
	let hc = 0;
	hands.forEach(hand => {
		let pxs: IPoint[] = [];
		allScoringHands
			.filter(s => !sHs.includes(s))
			.forEach(check => {
				const { hD, px = 0 } = scoreHand(
					hand,
					check,
					lTaSelf,
					meldedLTa,
					cW,
					sW,
					pxs.map(p => p.hD),
					Fs
				);
				if (hD) {
					pxs.push({ hD, px });
				}
			});
		// Uncomment to test multi-bot hu:
		// pxs.push({
		// 	hD: ScoringHand._13,
		// 	px: HandPoint._13
		// });

		let hDs = pxs.map(p => p.hD);
		// Only for valid hands
		if (hand.tsL.length === 0 || !excludes(canHuWithoutMelds, hDs)) {
			if (f[7] && n[6] === _p) {
				pxs.push({
					hD: ScoringHand.QIANG_KANG,
					px: HandPoint.QIANG_KANG
				});
			}

			if (lTaSelf && n[11] === 2) {
				pxs.push({
					hD: ScoringHand.HUA_SHANG_HUA,
					px: HandPoint.HUA_SHANG_HUA
				});
			}

			if (lTaSelf && n[11] === 1) {
				pxs.push({
					hD: ScoringHand.HUA_SHANG,
					px: HandPoint.HUA_SHANG
				});
			}

			if (lTaSelf && ms.length === 0) {
				pxs.push({
					hD: ScoringHand.CONCEALED,
					px: HandPoint.CONCEALED
				});
			}

			// Hai di lao yue
			if ((game?.ts?.length || 0) === 15 && lTaSelf) {
				pxs.push({ hD: ScoringHand.MOON, px: HandPoint.MOON });
			}

			// Count pong pxs for Wind if not greater 4 or all honours
			if (excludes(hDs, skipWinds)) {
				const winds = arrToSetArr([cW, sW]);
				for (let i = 0; i < winds.length; i++) {
					let card = winds[i];
					if (containsPongOrKang(hand, card)) {
						if (card === sW && card === cW) {
							pxs.push({ hD: `${ScoringHand.MELDED}-${CardName[card] || card}`, px: 2 });
						} else {
							pxs.push({ hD: `${ScoringHand.MELDED}-${CardName[card] || card}`, px: 1 });
						}
					}
				}
			}

			// Count pong pxs for HBF if did not score skipPongHBF
			if (excludes(hDs, skipPongHBF)) {
				const scoringP = [DaPai.RED, DaPai.WHITE, DaPai.GREEN];
				for (let i = 0; i < scoringP.length; i++) {
					let card = scoringP[i];
					if (containsPongOrKang(hand, card)) {
						pxs.push({ hD: `${ScoringHand.MELDED}-${CardName[card] || card}`, px: 1 });
					}
				}
			}

			// add flowers even if player has all animals and CFS. will not add flowers if has all 8
			// add animals irregardless of flowers, if not full animal set
			let flowerPx = 0;
			if (!hDs.find(hd => hd === ScoringHand.FLOWERS)) {
				const hasAllFF = p.sTs.filter(t => t.s === Suit.FLOWER && FlowersF.includes(t.c)).length === 4;
				const hasAllFS = p.sTs.filter(t => t.s === Suit.FLOWER && FlowersS.includes(t.c)).length === 4;
				if (hasAllFF || hasAllFS) {
					pxs.push({ hD: ScoringHand.CFS, px: HandPoint.CFS });
				}
				flowerPx += Fs[1];
			}
			if (!hDs.find(hd => hd === ScoringHand.ANIMALS)) {
				flowerPx += Fs[0];
			}
			if (flowerPx > 0) {
				pxs.push({ hD: `${ScoringHand.FS}-${flowerPx}`, px: flowerPx });
			}
		}
		// Tally the hand with the most pxs for fewest/ most valuable combinations
		let maxPx: number =
			pxs.length === 0 ? 0 : pxs.length === 1 ? pxs[0].px : pxs.map(p => p.px).reduce((a, b) => a + b);
		if (maxPx >= maxPxAch) {
			maxPxAch = maxPx;
			hc = Math.min(hc, pxs.length);
		}
		if (maxPx >= n[8] && (hand.tsL.length === 0 || !excludes(hDs, canHuWithoutMelds))) {
			hsWPxs.push({ hand, self: lTaSelf, pxs, maxPx });
		}
	});

	const HH =
		hsWPxs.length === 1
			? hsWPxs[0]
			: maxPxAch === 0
			? {}
			: hsWPxs.find(h => (h.maxPx === maxPxAch && h.pxs.length === hc) || h.maxPx === maxPxAch);

	const val = { hands, hsWPxs, HH, lTa_lTh };
	mainLRUCache.write(key, val);

	return val;
}

/**
 * @returns [Exec, *cards]
 * @description Get a set of instructions for a bot to move
 */
function getBotEval(game: Game, _p: number, lThAvail: boolean): any[] {
	const { f = [], id, lTh, n = [], ps } = game;
	const tHK = id === LocalFlag ? 111 : getTileHashKey(id, n[0]);
	const p = ps[_p];

	const shown_hTs = p?.revealedHTs(tHK);
	const { hands, HH, lTa_lTh } = getHands(game, _p, tHK, shown_hTs);
	if (!isEmpty(HH)) {
		return [Exec.HU, HH];
	} else {
		const cW: Wind = game?.currentWind() || Wind.E;
		const sW: Wind = indexToWind((_p - n[2] + 4) % 4);
		const defaultScoringPongs = [...HBFCards, cW, sW];
		const canPongKang: number = !f[3] && lThAvail ? shown_hTs.filter(t => t.c === lTh.c).length : 0;

		// if can take scoringPong, just take
		if (defaultScoringPongs.includes(lTh?.c) && canPongKang >= 2) {
			return [canPongKang === 2 ? Exec.PONG : Exec.KANG, lTh.c];
		} else {
			// avoid hoisting these
			const shown_hTsA: IShownTile[] = isEmpty(p?.lTa) ? shown_hTs : [...shown_hTs, p?.revealedLTa(tHK)];

			// if priorMeld === pong, pong
			const dc = getDiscardCategories(
				ps.map(p => ({ uN: p.uN, sTs: p.sTs, dTs: p.dTs })),
				shown_hTsA
			);
			const ho = getHandObjectives(dc, p?.ms, [cW, sW]);
			const { priorMeld = MeldType.CHI } = ho;
			if (priorMeld === MeldType.PONG && canPongKang >= 2) {
				return [canPongKang === 2 ? Exec.PONG : Exec.KANG, lTh.c];
			}

			// if _p's turn, -> chi || draw || discard
			if (n[3] === _p) {
				const targetHs: IHand[] = [];
				const votePs: IObj<string, number> = {};
				let maxP = 0;
				let fewestTsLeft = 14;
				let closestHs: IHand[] = [];
				// let shouldTakeLT = '';

				hands.forEach(h => {
					if (
						h.pStr ||
						(h.hideMsStr?.length > 0 &&
							h.hideMsStr.every(m =>
								priorMeld === MeldType.CHI
									? m[0] === MeldType.CHI
									: priorMeld === Exec.PONG
									? m[0] === Exec.KANG || m[0] === Exec.PONG
									: true
							))
					) {
						targetHs.push(h);
					}
					if (h.pStr) {
						let newCount = votePs[h.pStr] ? votePs[h.pStr] + 1 : 1;
						votePs[h.pStr] = newCount;
						maxP = Math.max(maxP, newCount);
					}
					fewestTsLeft = Math.min(fewestTsLeft, h.tsL.length);
				});
				const mostCommonP = Object.keys(votePs).find(key => votePs[key] === maxP);
				// const voteMs: IObj<string, number> = {};
				closestHs = targetHs.filter(
					h => h.tsL.length === fewestTsLeft || (h.pStr === mostCommonP && h.tsL.length <= fewestTsLeft + 1)
				);
				closestHs = closestHs.length > 0 ? closestHs : targetHs;

				if (f[3]) {
					// kang something
					const hCsA = shown_hTsA.map(t => t.c);
					const cs = arrToSetArr(hCsA);
					for (let i = 0; i < cs.length; i++) {
						const sameTs = hCsA.filter(c => c === cs[i]);
						if (
							(sameTs.length === 4 &&
								(priorMeld === MeldType.PONG || defaultScoringPongs.includes(sameTs[0]))) ||
							(sameTs.length === 1 && p?.hasPong(cs[i]))
						) {
							return [Exec.SELF_KANG, cs[i]];
						}
					}
					// if not, discard something
					return [Exec.DISCARD, getDiscardHelper(dc, ho, closestHs)];
				} else {
					if (lThAvail && priorMeld === MeldType.CHI) {
						const howToChi = shouldChi(lTa_lTh, shown_hTs);
						if (howToChi.length === 4) {
							return howToChi;
						}
					}
					return [Exec.DRAW];
				}
			}
			return []; // exec = nothing if not going to pong/kang and not _p's turn
		}
	}
}

export { getBotEval, getHands, getLastThrownOrTaken };
