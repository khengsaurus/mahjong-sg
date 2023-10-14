import { Suit, Wind } from 'enums';
import {
	HandPoint,
	ScoringHand,
	skipChi,
	skipGreaterThree,
	skipGreen,
	skipHalfSuited,
	skipHonor,
	skipIsSuited,
	skipLesserFour,
	skipLesserThree,
	skipMixedHonoursTerminals,
	skipPong,
	skipSeven,
	skipTerminals,
	skipThirteen
} from 'handEnums';
import { isEmpty } from 'lodash';
import { IPoint } from 'typesPlus';
import { excludes, isNewInSet, tilesCanBeChi, tilesCanBePong } from 'utility';
import {
	isAllGreen,
	isChiHand,
	isEighteen,
	isGreaterFour,
	isGreaterThree,
	isHalfSuited,
	isHonor,
	isLesserFour,
	isLesserThree,
	isMixedHonoursTerminals,
	isPongHand,
	isPureTerminals,
	isSevenPair,
	isSuited,
	isThirteen
} from 'utility/scoreHand';
import { primaryLRU } from './LRUCache';

export function tilesBySuit(tiles: IShownTile[]): ITilesBySuit {
	let arr: ITilesBySuit = {};
	for (let s in [Suit.WAN, Suit.TONG, Suit.SUO, Suit.DAPAI]) {
		arr[s] = tiles.filter(tile => tile.s === s);
	}
	return arr;
}

/* ------------------------- @return: [ meldOrPair, remainingTiles ] ------------------------- */

function rmPIx(i: number, ts: IShownTile[]): { pair: IShownTile[]; tsWoP: IShownTile[] } {
	let tiles = [...ts];
	if (i + 1 < tiles.length && tiles[i].c === tiles[i + 1].c) {
		let pair = tiles.splice(i, 2);
		return { pair, tsWoP: tiles };
	} else {
		return { pair: null, tsWoP: tiles };
	}
}

/**
 * @param ts
 * @returns Obj {meld: string, tsL: IShownTile[]}
 * @O n
 */
function getFirstMeld(
	ts: IShownTile[],
	str = false
): { meldStr: string; meld: IShownTile[]; tsL: IShownTile[] } {
	let l = ts.length;
	let tsL = [...ts];
	if (l <= 2) {
		return { meld: null, meldStr: '', tsL };
	}
	if (l === 3) {
		return tilesCanBeChi(tsL)
			? { meldStr: `c-${tsL[1].c}`, meld: str ? null : tsL, tsL: [] }
			: tilesCanBePong(tsL)
			? { meldStr: `p-${tsL[1].c}`, meld: str ? null : tsL, tsL: [] }
			: { meldStr: '', meld: null, tsL };
	}
	let meld: IShownTile[];
	for (let i = 0; i < l - 2; i++) {
		if (i + 2 < l) {
			// look for pong
			if (tilesCanBePong(tsL.slice(i, i + 3))) {
				meld = tsL.splice(i, 3);
				return { meldStr: `p-${meld[1].c}`, meld: str ? null : meld, tsL };
			}
			// look for chi
			if (tsL[i].n === tsL[i + 1].n - 1 && tsL[i].s === tsL[i + 1].s) {
				for (let j = i + 2; j < l; j++) {
					if (tsL[j].s !== tsL[i].s) {
						break;
					} else if (tsL[i].n === tsL[j].n - 2) {
						meld = tsL.splice(i, 2);
						meld.push(...tsL.splice(j - 2, 1));
						return {
							meldStr: `c-${meld[1].c}`,
							meld: str ? null : meld,
							tsL
						};
					}
				}
			}
		}
	}
	return { meldStr: '', meld: null, tsL };
}

// O: n^2 (getFirstMeld)
function r_getFirstMeld(
	exMsStr: string[],
	exMs: IShownTile[][],
	tilesSkipped: IShownTile[],
	tiles: IShownTile[]
) {
	// r_getFirstMeld_calls += 1;
	let { meld, meldStr, tsL } = getFirstMeld(tiles);
	return {
		hideMsStr: meldStr ? [...exMsStr, meldStr] : exMsStr,
		hideMs: meld ? [...exMs, meld] : exMs,
		tsL: [...tilesSkipped, ...tsL]
	};
}

/**
 * @param ts
 * @param requireMeld = false
 * @param requirePair = false
 * @returns All possible hands, IHand[]
 * @O n^3 ? (recursion + call to n^2 fn)
 */
export function getMeldsPairs(ts: IShownTile[], lTa?: IShownTile): IHand[] {
	const key = `gmp-${ts.map(t => t.c).join('')}${lTa?.r}`;
	const cached = primaryLRU.read(key);
	if (cached) return cached;

	const pairsSet = new Set<string>();
	const handsSet = new Set<string>();
	const hs: IHand[] = [];

	// O: n, recursion
	function r_breakIntoMelds(
		exMsStr: string[],
		exMs: IShownTile[][],
		pStr: string,
		pair: IShownTile[],
		ts: IShownTile[]
	) {
		let tiles = [...ts];
		if (tiles.length === 0) {
			if (isNewInSet(exMsStr.sort().join('') + pStr, handsSet)) {
				hs.push({
					hideMsStr: exMsStr.sort(),
					hideMs: exMs,
					pStr,
					pair,
					tsL: [],
					lTa
				});
			}
		} else {
			for (let i = 0; i < tiles.length - 2; i++) {
				let { hideMs, hideMsStr, tsL } = r_getFirstMeld(
					exMsStr,
					exMs,
					tiles.slice(0, i),
					tiles.slice(i)
				);
				hideMsStr.sort();
				if (isNewInSet(hideMsStr.join('') + pStr, handsSet)) {
					hs.push({
						hideMsStr: hideMsStr,
						hideMs: hideMs,
						pStr,
						pair,
						tsL,
						lTa
					});
				}
				if (tsL.length !== 0 && tsL.length !== tiles.length) {
					r_breakIntoMelds(hideMsStr, hideMs, pStr, pair, tsL);
				}
			}
		}
	}

	// O: n *
	function breakIntoPairs_thenMelds(ts: IShownTile[]) {
		let tiles = [...ts];
		for (let i = 0; i < tiles.length - 1; i++) {
			let { pair, tsWoP } = rmPIx(i, ts);
			let pStr: string = isEmpty(pair) ? '' : pair[0].c;
			if (isNewInSet(pStr, pairsSet)) {
				r_breakIntoMelds([], [], pStr, pair, tsWoP);
			}
		}
	}

	breakIntoPairs_thenMelds(ts);
	return primaryLRU.write(key, hs);
}

/**
 * @param ach To skip check if a particular hand has been achieved, e.g. 7 pairs achieved -> skip checking for 13
 * @returns IPoing
 */
export function scoreHand(
	hand: IHand,
	check: ScoringHand,
	lTaSelf: boolean,
	meldedLTa: boolean,
	cW: Wind,
	sW: Wind,
	ach: string[],
	Fs: number[]
): IPoint {
	const melds = (hand.openMsStr?.length || 0) + (hand.hideMsStr?.length || 0);
	const pair = hand.pStr;
	switch (check) {
		case ScoringHand.CHI:
			return melds !== 4 || !pair || !excludes(skipChi, ach)
				? {}
				: {
						hD: isChiHand(hand, lTaSelf, meldedLTa, cW, sW, Fs[0] + Fs[2]),
						px: Number(Fs[0] + Fs[2]) ? HandPoint.CHI_1 : HandPoint.CHI_4
				  };
		case ScoringHand.PONG:
			return melds !== 4 || !pair || !excludes(skipPong, ach)
				? {}
				: {
						hD: isPongHand(hand),
						px: HandPoint.PONG
				  };
		case ScoringHand.H_SUITED:
			return melds !== 4 || !pair || !excludes(skipHalfSuited, ach)
				? {}
				: {
						hD: isHalfSuited(hand),
						px: HandPoint.H_SUITED
				  };
		case ScoringHand.SUITED:
			return melds !== 4 || !pair || !excludes(skipIsSuited, ach)
				? {}
				: {
						hD: isSuited(hand),
						px: HandPoint.SUITED
				  };
		case ScoringHand.SEVEN:
			return !excludes(skipSeven, ach)
				? {}
				: {
						hD: isSevenPair(hand),
						px: HandPoint.MAX
				  };
		case ScoringHand.TERMS:
			return melds !== 4 || !pair || !excludes(skipTerminals, ach)
				? {}
				: {
						hD: isPureTerminals(hand),
						px: HandPoint.TERMS
				  };
		case ScoringHand.HONOR:
			return melds !== 4 || !pair || !excludes(skipHonor, ach)
				? {}
				: {
						hD: isHonor(hand),
						px: HandPoint.HONOR
				  };
		case ScoringHand.MIXED_HONOURS_TERMS:
			return melds !== 4 || !pair || !excludes(skipMixedHonoursTerminals, ach)
				? {}
				: {
						hD: isMixedHonoursTerminals(hand),
						px: HandPoint.MIXED_HONOURS_TERMS
				  };
		case ScoringHand.L_3:
			return melds !== 4 || !pair || !excludes(skipLesserThree, ach)
				? {}
				: {
						hD: isLesserThree(hand),
						px: HandPoint.L_3
				  };
		case ScoringHand.G_3:
			return !excludes(skipGreaterThree, ach)
				? {}
				: {
						hD: isGreaterThree(hand),
						px: HandPoint.MAX
				  };
		case ScoringHand.ANIMALS:
			return melds !== 4 || !pair
				? {}
				: {
						hD: Fs[0] === 4 ? ScoringHand.ANIMALS : '',
						px: HandPoint.MAX
				  };
		case ScoringHand.FLOWERS:
			return melds !== 4 || !pair
				? {}
				: {
						hD: Fs[2] === 8 ? ScoringHand.FLOWERS : '',
						px: HandPoint.MAX
				  };
		case ScoringHand._13:
			return !excludes(skipThirteen, ach)
				? {}
				: {
						hD: isThirteen(hand),
						px: HandPoint.MAX
				  };
		case ScoringHand.L_4:
			return melds !== 4 || !pair || !excludes(skipLesserFour, ach)
				? {}
				: {
						hD: isLesserFour(hand),
						px: HandPoint.L_4
				  };
		case ScoringHand.GREEN:
			return melds !== 4 || !pair || !excludes(skipGreen, ach)
				? {}
				: {
						hD: isAllGreen(hand),
						px: HandPoint.MAX
				  };
		case ScoringHand.G_4:
			return melds !== 4 || !pair
				? {}
				: {
						hD: isGreaterFour(hand),
						px: HandPoint.MAX
				  };
		case ScoringHand._18:
			return melds !== 4 || !pair
				? {}
				: {
						hD: isEighteen(hand),
						px: HandPoint.MAX
				  };
		// case (ScoringHand.NINE):
		default:
			return {};
	}
}
