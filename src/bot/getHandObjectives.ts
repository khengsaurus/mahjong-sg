import { DaPai, MeldType, Suit, Wind } from 'enums';
import { arrToSetArr, excludes, getCountPerSuit, getKeysByDescVal, getSuitFromStr } from 'utility';

/**
 * Get
 * @param dc
 * @param openMsStr
 * @param winds
 * @param px
 * @param pxTh
 * @returns {priorMeld, priorSuits, keepDaPai, scoringPongs}
 * @description Respects the following guidelines:
 *   1: If points from flowers/pongs > pxTh, prioritize M = C & S = []
 *   2: Set prior M
 *    - If no Ms yet, set prior:
 *      (easyChi/2 + okayChi/4 < easyPong + okayPong/3 || has easy scoring pong) ? C : P
 *    - Prior P if:
 *      • C not melded
 *      • Only P melded || easyPong + okayPong/3 >= msReq
 *    - Prior C
 *      • P not melded
 *      • Only C melded || easyChi/2 + okayChi/4 >= msReq
 *    - Else, prior null
 *   3: Keep DaPai if:
 *      • Prior P
 *      • Prior C && <3 C melded && has easy scoring pong
 *   3: Set prior S
 *    - Case DaPai melded
 *      • No S           -> [DaPai]
 *      • 1 S melded     -> [S, DaPai]
 *      • >1 S melded    -> [DaPai]
 *    - Case DaPai not melded
 *      • No S melded    -> [Strongest S, DaPai]
 *      • 1 S melded     -> [S, DaPai]
 *      • >1 S melded    -> keepDapai ? [DaPai] : []
 * Abbreviations: prior = prioritize/priority, comm = committed, th = threshold
 */
function getHandObjectives(
	dc: IDiscardCategories,
	openMsStr: string[] = [],
	winds: Wind[] = [],
	px: number = 0,
	pxTh = 2
): IHandObjectives {
	// #1: Default prior S & M
	const { ownCs, easyChi, okayChi, easyPong, manyDaPai } = dc;

	let priorSuits: Suit[] = [];
	let priorMeld = MeldType.CHI;
	let keepDaPai = true;
	const scoringPongs: string[] = [...winds, DaPai.RED, DaPai.WHITE, DaPai.GREEN];
	const hasEasyScorePong = !excludes(easyPong, scoringPongs);

	// #2: Set prior M
	let pongs = 0;
	let chis = 0;
	if (px <= pxTh) {
		openMsStr.forEach(m => {
			if (m[0] === MeldType.CHI) {
				chis += 1;
			} else {
				pongs += 1;
			}
		});
		const inclinePong =
			hasEasyScorePong || (manyDaPai ? 2 : 0) + easyPong.length > easyChi.length / 2 + okayChi.length / 4;
		if (chis + pongs === 0) {
			priorMeld = inclinePong ? MeldType.PONG : MeldType.CHI;
		} else if (chis === 0 && (pongs !== 0 || inclinePong)) {
			priorMeld = MeldType.PONG;
		} else if (pongs === 0 && (chis !== 0 || !inclinePong)) {
			priorMeld = MeldType.CHI;
		} else {
			priorMeld = null;
		}
	}

	// #3: Keep DaPai
	if (priorMeld === MeldType.CHI) {
		if (pongs === 0 && chis < 3 && hasEasyScorePong) {
			keepDaPai = true;
		} else {
			keepDaPai = false;
		}
	}

	// #4: Set prior S
	if (px <= pxTh) {
		const tsPerS = getCountPerSuit(ownCs);
		const sByCount = getKeysByDescVal(tsPerS).filter(s => s !== Suit.DAPAI) as Suit[];
		const commS_WD = arrToSetArr(openMsStr.map(m => getSuitFromStr(m)));
		const commS = commS_WD.filter(s => s !== Suit.DAPAI);
		const goForSuited =
			commS.length <= 1 &&
			(pongs + chis > 2 ||
				tsPerS[sByCount[0]] / ownCs.filter(c => getSuitFromStr(c) !== Suit.DAPAI).length >= 0.5);

		if (priorMeld === MeldType.CHI) {
			if (keepDaPai || commS_WD.includes(Suit.DAPAI)) {
				priorSuits = (goForSuited ? [commS[0], Suit.DAPAI] : [Suit.DAPAI]) as Suit[];
			} else {
				priorSuits = (goForSuited ? [commS[0]] : []) as Suit[];
			}
		} else {
			priorSuits = (goForSuited ? [commS[0] || sByCount[0], Suit.DAPAI] : [Suit.DAPAI]) as Suit[];
		}
	}

	return {
		priorMeld,
		priorSuits,
		keepDaPai: keepDaPai || priorMeld === MeldType.PONG,
		scoringPongs
	};
}

export default getHandObjectives;
