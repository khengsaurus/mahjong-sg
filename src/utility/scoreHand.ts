import { MeldType, Suit, Wind } from 'enums';
import { greenCards, greenMelds, HBFCards, ScoringHand, thirteen, Winds } from 'handEnums';
import isEmpty from 'lodash.isempty';
import { containsPongOrKang, containsX, getSuitFromStr, getSuitsFromHand, isBigThree } from 'utility';

/**
 * @param pC: pair card
 * @param lTa: last taken tile into hand
 * @param mTsNs: middle tile number of chi's of the same S as the lTa
 * @param noOtherSuitTs: no other tiles of same suit as last taken
 */
function pingHuPair(pC: string, lTa: IShownTile, mTsNs: number[], noOtherSuitTs: boolean) {
	return lTa.c === pC
		? noOtherSuitTs
			? false
			: !!(
					mTsNs.find(n => n === lTa.n - 2) ||
					mTsNs.find(n => n === lTa.n - 1) ||
					mTsNs.find(n => n === lTa.n + 1) ||
					mTsNs.find(n => n === lTa.n + 2)
			  )
		: true;
}

/**
 * @param pN: pair number
 * @param lTN: last taken number
 * @param mTsNs: middle tile number of chi's of the same S as the lTa
 */
function pingHuMeld(pair: IShownTile[], lTa: IShownTile, mTsNs: number[]): boolean {
	const { c: lTC, n: lTN } = lTa;
	if ((lTN === 7 && !mTsNs.includes(6)) || (lTN === 3 && !mTsNs.includes(4))) {
		return false;
	}
	if (pair[0].c === lTC && containsX(mTsNs, lTN) === 2) {
		// if user has c-2w, c-2w, and 2w pair
		return false;
	}
	if (containsX(mTsNs, lTN) === 4) {
		// if user has 4 same chi's and lTa is middle drawn
		return false;
	}
	// if mTsNs includes lTa, e.g. (1,2,3), (2,3,4), (2,2)
	if (mTsNs.includes(lTN)) {
		return !!mTsNs.find(m => m + 1 === lTN || m - 1 === lTN);
	}
	return true;
}

export function didChiButIsPingHu(lTa: IShownTile, openTs: IShownTile[]) {
	// flowers shd be at the end of the arr so filtering not req
	let pos = openTs.findIndex(t => t.r === lTa?.r) % 3;
	if (pos === 1) {
		// is middle tile
		return false;
	} else if (lTa.n !== 3 && lTa.n !== 7) {
		// not middle tile and not 3 || 7
		return true;
	} else {
		// not middle tile and 3 or 7
		if (pos === 0) {
			return lTa.n !== 7; // left tile, isChi if ! 7,8,9
		} else if (pos === 2) {
			return lTa.n !== 3; // right tile, isChi if ! 1,2,3
		}
	}
	return false;
}

export function isChiHand(h: IHand, lTSelf: boolean, meldedLTa: boolean, cW: Wind, sW: Wind, Fs: number): string {
	const { openMsStr = [], openTs, hideMsStr = [], hideMs = [], pStr = '', pair, lTa, tsL = [] } = h;
	const msStr = [...openMsStr, ...hideMsStr];
	let isChi = false;
	if (
		!isEmpty(tsL) ||
		pStr === '' ||
		msStr.length !== 4 ||
		isBigThree(pStr) ||
		pStr === cW ||
		pStr === sW ||
		!msStr.every(m => m[0] === MeldType.CHI)
	) {
		isChi = false;
	} else if (lTSelf) {
		isChi = true;
	} else if (meldedLTa) {
		isChi = didChiButIsPingHu(lTa, openTs);
	} else {
		const mTsNs = hideMs.filter(m => m[0].s === lTa.s).map(m => m[1].n);
		isChi =
			pingHuMeld(pair, lTa, mTsNs) && // note this has to return false when 1,2,3,3,3
			pingHuPair(pair[0].c, lTa, mTsNs, hideMs.flat().filter(m => m.s === lTa.s).length === 0);
	}
	return isChi ? (Fs > 0 ? ScoringHand.CHI_1 : ScoringHand.CHI_4) : '';
}

export function isPongHand(h: IHand): string {
	const { openMsStr = [], hideMsStr = [], tsL = [] } = h;
	const msStr = [...openMsStr, ...hideMsStr];
	return tsL.length !== 0 || msStr.length !== 4
		? ''
		: msStr.every(m => m[0] === MeldType.PONG || m[0] === MeldType.KANG)
		? ScoringHand.PONG
		: '';
}

export function isSevenPair(h: IHand): string {
	if (h.tsL.length !== 12 || isEmpty(h.pair)) {
		return '';
	}
	for (let i = 0; i < 12; i += 2) {
		if (h.tsL[i].c !== h.tsL[i + 1].c) {
			return '';
		}
	}
	return ScoringHand.SEVEN;
}

export function isGreaterThree(h: IHand): string {
	const { openMsStr = [], hideMsStr = [] } = h;
	if (openMsStr.length + hideMsStr.length < 3) {
		return '';
	}
	for (let i = 0; i < 3; i++) {
		if (!containsPongOrKang(h, HBFCards[i])) {
			return '';
		} else {
		}
	}
	return ScoringHand.G_3;
}

export function isLesserThree(h: IHand): string {
	if (h.tsL.length !== 0 || !HBFCards.includes(h.pStr)) {
		return '';
	}
	let pairFound = false;
	for (let i = 0; i < 3; i++) {
		if (!containsPongOrKang(h, HBFCards[i])) {
			if (h.pStr === HBFCards[i]) {
				if (pairFound) {
					return '';
				} else {
					pairFound = true;
				}
			} else {
				return '';
			}
		}
	}
	return pairFound ? ScoringHand.L_3 : '';
}

export function isGreaterFour(h: IHand): string {
	for (let i = 0; i < 4; i++) {
		if (!containsPongOrKang(h, Winds[i])) {
			return '';
		}
	}
	return ScoringHand.G_4;
}

export function isLesserFour(h: IHand): string {
	if (h.tsL.length !== 0) {
		return '';
	}
	let pairFound = false;
	for (let i = 0; i < 4; i++) {
		if (!containsPongOrKang(h, Winds[i])) {
			if (h.pStr === Winds[i]) {
				if (pairFound) {
					return '';
				} else {
					pairFound = true;
				}
			} else {
				return '';
			}
		}
	}
	return pairFound ? ScoringHand.L_4 : '';
}

export function isAllGreen(h: IHand): string {
	const { openMsStr = [], hideMsStr = [] } = h;
	const msStr = [...openMsStr, ...hideMsStr];
	if (h.tsL.length !== 0) {
		return '';
	}
	for (let i = 0; i < msStr.length; i++) {
		if (!greenMelds.includes(msStr[i])) {
			return '';
		}
	}
	return greenCards.includes(h.pStr) ? ScoringHand.GREEN : '';
}

export function isEighteen(h: IHand): string {
	const { openMsStr = [], hideMsStr = [] } = h;
	const msStr = [...openMsStr, ...hideMsStr];
	return msStr.length === 4 && msStr.every(m => m[0] === MeldType.KANG) ? ScoringHand._18 : '';
}

export function isThirteen(h: IHand): string {
	if (h.tsL.length !== 12 || isEmpty(h.pair)) {
		return '';
	}
	const cards = [...h.tsL.map(t => t.c), h.pair[0].c];
	for (let i = 0; i < 13; i++) {
		if (!cards.includes(thirteen[i])) {
			return '';
		}
	}
	return ScoringHand._13;
}
export function isSuited(h: IHand): string {
	const suits = getSuitsFromHand(h);
	return suits.length === 1 ? (suits[0] !== Suit.DAPAI ? ScoringHand.SUITED : '') : '';
}

export function isHonor(h: IHand): string {
	const { openMsStr = [], hideMsStr = [] } = h;
	if (!![...openMsStr, ...hideMsStr].find(m => m[0] === MeldType.CHI)) {
		return '';
	}
	const suits = getSuitsFromHand(h);
	return suits.length === 1 && suits.includes(Suit.DAPAI) ? ScoringHand.HONOR : '';
}

export function isHalfSuited(h: IHand): string {
	const suits = getSuitsFromHand(h);
	return suits.length === 2 && suits.includes(Suit.DAPAI) ? ScoringHand.H_SUITED : '';
}

export function isPureTerminals(h: IHand): string {
	const { openMsStr = [], hideMsStr = [], pStr } = h;
	const msStrNs = [...openMsStr, ...hideMsStr].map(m => (m[0] === MeldType.CHI ? '5' : m[2])) || [];
	const allNsStr = [pStr, ...msStrNs].map(c => c[0]);
	for (let i = 0; i < allNsStr.length; i++) {
		const n = Number(allNsStr[i]) || 0;
		if (n === 0 || ![1, 9].includes(n)) {
			return '';
		}
	}
	return ScoringHand.TERMS;
}

export function isMixedHonoursTerminals(h: IHand): string {
	const { openMsStr = [], hideMsStr = [], pStr } = h;
	const allMs = [...openMsStr, ...hideMsStr, `${MeldType.PONG}-${pStr}`];
	let hasDapai = false;
	let hasTerms = false;
	for (let i = 0; i < allMs.length; i++) {
		if (allMs[i][0] === MeldType.CHI) {
			return '';
		}
		if (getSuitFromStr(allMs[i]) === Suit.DAPAI) {
			hasDapai = true;
		} else {
			const n = Number(allMs[i][2]);
			if ([1, 9].includes(n)) {
				hasTerms = true;
			} else {
				return '';
			}
		}
	}
	return hasDapai && hasTerms ? ScoringHand.MIXED_HONOURS_TERMS : '';
}
