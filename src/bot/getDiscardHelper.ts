import { MeldType, Suit } from 'enums';
import isEmpty from 'lodash.isempty';
import { isDevBot } from 'platform';
import {
	arrToSetArr,
	cardsWithoutNeighbors,
	commonEs,
	getCountPerStr,
	getInclExcl,
	getSuitFromStr,
	sortDaPaiDiscards,
	terminalSortCs
} from 'utility';
import { getDeadDiscard, getHardDiscard } from './getDiscards';

// Feeling really tired and just want to get this done... shd proabably come up with a better optimal approach
function getDiscardHelper(
	dc: IDiscardCategories,
	ho: IHandObjectives,
	hs: IHand[]
): string {
	const countReqCs: IObj<string, number> = {};
	const {
		countAllKnownCs,
		countHandCs,
		deadChi,
		deadPairs,
		deadPong,
		easyChi,
		easyPong,
		hardChi,
		hardPong,
		loneTs,
		multis,
		okayChi,
		okayPong,
		ownCs,
		ownSingles,
		waitingTwoChi
	} = dc;
	const { keepDaPai, priorMeld, scoringPongs } = ho;
	let reqMs: any[] = []; // cumulative req ts for meld
	let reqPs: any[] = [];
	let reqCs: string[] = [];
	let unreqPs: string[] = [];
	let unreqCs: string[] = [];
	let _unreqCs: string[] = [];
	let leastReqCount = 4;
	let tsL: string[] = []; // cummulative tsL
	let ss: string | string[];

	if (hs.length > 0) {
		hs.forEach(h => {
			tsL = [...tsL, ...h.tsL.map(t => t.c)];
		});
		if (hs.length > 1) {
			hs.forEach(h => {
				const { hideMs = [], pStr = '' } = h || {};
				hideMs.forEach(m => reqMs.push(m));
				if (pStr) {
					reqPs.push(pStr);
					tsL.push(pStr);
				}
			});
			reqMs = arrToSetArr(reqMs.flat().map(t => t.c));
			reqPs = arrToSetArr(reqPs);
		} else {
			reqMs = arrToSetArr(hs[0].hideMs.flat().map(t => t.c));
			reqPs = [hs[0].pStr];
			// }
		}

		// *1: Select between two pairs, where one may form a chi, e.g. 4w 4w 5w 9s 9s -> keep 9s, discard 4w
		if ((!priorMeld || priorMeld === MeldType.CHI) && reqPs.length > 0) {
			const { incl, excl } = getInclExcl(
				reqPs,
				[],
				c => getSuitFromStr(c) === Suit.DAPAI && !scoringPongs.includes(c)
			);
			if (incl.length > 0 && incl.length < reqPs.length) {
				reqPs = incl;
				unreqPs = excl;
				unreqCs = excl;
			} else {
				const { incl, excl } = getInclExcl(
					reqPs,
					[],
					c => ![...easyChi, ...okayChi].includes(c)
				);
				if (incl.length > 0 && incl.length < reqPs.length) {
					reqPs = incl;
					unreqPs = excl;
					unreqCs = excl;
				}
			}
		}

		reqCs = [...reqMs, ...reqPs].sort();

		reqCs.forEach(c => {
			const n = countReqCs[c] ? countReqCs[c] + 1 : 1;
			countReqCs[c] = n;
			leastReqCount = Math.min(leastReqCount, n);
		});

		unreqCs = ownCs.filter(c => !reqCs.includes(c));
		let s = hs.map(h => h.tsL);
		_unreqCs = (
			(s.length === 1 ? s[0] : s.reduce((a, b) => commonEs(a, b, 'r'), [])) || []
		).map(t => t.c);
		_unreqCs = _unreqCs.length > 0 ? _unreqCs : unreqCs;
	}

	switch (_unreqCs.length) {
		case 0:
			isDevBot && console.info('getDiscardHelper - all tiles may be required');
			const l_reqCs = Object.keys(countReqCs).filter(
				c => countReqCs[c] === leastReqCount
			);
			if (l_reqCs.length === 1) {
				return l_reqCs[0];
			} else if (l_reqCs.length === 2) {
				const c0_c1 = countHandCs[l_reqCs[0]] - countHandCs[l_reqCs[1]];
				if (c0_c1 < 0) return l_reqCs[1];
				if (c0_c1 > 0) return l_reqCs[0];
				return terminalSortCs(l_reqCs)[0];
			}
			if (priorMeld === MeldType.CHI) {
				ss = sortDaPaiDiscards(
					unreqCs.filter(
						c => getSuitFromStr(c) === Suit.DAPAI && !reqPs.includes(c)
					),
					scoringPongs,
					ownSingles,
					countAllKnownCs
				);
				if (ss?.length > 0) return ss[0];
			} else {
				if (ownSingles.length > 0) return terminalSortCs(ownSingles)[0];
				ss = ownCs.filter(
					c => !easyPong.includes(c) && !scoringPongs.includes(c)
				);
				ss = !isEmpty(ss)
					? ss
					: ownCs.filter(
							c => !okayPong.includes(c) && !scoringPongs.includes(c)
					  );
				if (ss?.length > 0) return terminalSortCs(ss)[0];
			}
			break;
		case 1:
			isDevBot && console.info('getDiscardHelper - only 1 unrequired tile');
			return _unreqCs[0];
		case 3:
			isDevBot && console.info('getDiscardHelper - 3 unrequired tiles');
			if (priorMeld === MeldType.CHI) {
				if (!keepDaPai) {
					ss = sortDaPaiDiscards(
						_unreqCs.filter(
							c => !reqPs.includes(c) && getSuitFromStr(c) === Suit.DAPAI
						),
						scoringPongs,
						ownSingles,
						countAllKnownCs
					);
					if (ss?.length > 0) return ss[0];
				}
				// *1
				if (unreqPs.length > 0) {
					ss = unreqPs.filter(c => !reqMs.includes(c));
					if (ss?.length > 0) return terminalSortCs(ss)[0];
					return terminalSortCs(unreqPs)[0];
				}
				if (multis.length > 1) {
					ss = multis.filter(c => !reqPs.includes(c) && !easyChi.includes(c));
					if (ss?.length > 0) return terminalSortCs(ss)[0];
				}
				ss = _unreqCs.filter(c => deadChi.includes(c));
				ss = !isEmpty(ss) ? ss : cardsWithoutNeighbors(_unreqCs);
				ss = !isEmpty(ss) ? ss : _unreqCs.filter(c => !waitingTwoChi.includes(c));
				ss = !isEmpty(ss) ? ss : _unreqCs.filter(c => !easyChi.includes(c));
				ss = !isEmpty(ss) ? ss : _unreqCs.filter(c => loneTs.includes(c));
				if (ss?.length > 0) return terminalSortCs(ss)[0];
			} else {
				ss = _unreqCs.filter(c => deadPong.includes(c));
				ss = !isEmpty(ss) ? ss : _unreqCs.filter(c => deadPairs.includes(c));
				ss = !isEmpty(ss) ? ss : _unreqCs.filter(c => hardPong.includes(c));
				ss = !isEmpty(ss) ? ss : loneTs.filter(c => _unreqCs.includes(c));
				ss = !isEmpty(ss) ? ss : ownSingles.filter(c => ownSingles.includes(c));
				if (ss?.length > 0) return terminalSortCs(ss)[0];
				return terminalSortCs(_unreqCs)[0];
			}
			break;
		default:
			isDevBot && console.info('getDiscardHelper - more than 3 unrequired tiles');
			ss = getDeadDiscard(ho, dc, reqCs, false);
			if (ss) {
				return ss;
			}
			if (!priorMeld || priorMeld === MeldType.CHI) {
				// *1
				if (unreqPs.length > 0) {
					ss = unreqPs.filter(c => !reqMs.includes(c));
					if (ss?.length > 0) {
						return terminalSortCs(ss)[0];
					}
					return terminalSortCs(unreqPs)[0];
				}

				const { incl, excl } = getInclExcl(_unreqCs, [
					...easyChi,
					...okayChi,
					...easyPong
				]);
				if (incl.length > 0 && excl.length > 0) {
					return terminalSortCs(excl)[0];
				}
			}
			let _ds = getHardDiscard(ho, dc, reqCs, true, true);
			_ds = !isEmpty(_ds) ? _ds : getHardDiscard(ho, dc, reqCs, false, true);
			ss = isEmpty(_ds) ? [] : commonEs(_ds, _unreqCs);
			if (ss?.length > 0) {
				return ss[0];
			}
			break;
	}

	isDevBot && console.info('getDiscardHelper - failed switch case -> final step');

	// Where 6,7,7,8,9 and no other pairs -> if there is one most frequent tsL (multis will get an additional count), discard that
	if (priorMeld === MeldType.CHI) {
		const { counted: countPerCard, max } = getCountPerStr(tsL);
		ss = Object.keys(countPerCard).filter(c => countPerCard[c] === max);
		if (ss?.length === 1) {
			return ss[0];
		}
	}

	ss = commonEs(
		_unreqCs,
		priorMeld === MeldType.CHI
			? hardChi.length > 0
				? hardChi
				: loneTs.length > 0
				? loneTs
				: okayChi
			: [...hardPong, ...okayPong].filter(c => !scoringPongs.includes(c)).length > 0
			? [...hardPong, ...okayPong].filter(c => !scoringPongs.includes(c))
			: easyPong.filter(c => !scoringPongs.includes(c)).length > 0
			? easyPong.filter(c => !scoringPongs.includes(c))
			: [...hardPong, ...okayPong].length > 0
			? [...hardPong, ...okayPong]
			: easyPong,
		'r'
	);
	return terminalSortCs(
		ss?.length > 0 ? ss : _unreqCs.length > 0 ? _unreqCs : ownCs
	)[0];
}

export default getDiscardHelper;
