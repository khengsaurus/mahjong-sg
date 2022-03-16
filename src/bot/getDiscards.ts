import { MeldType, Suit } from 'enums';
import { arrToSetArr, getSuitFromStr, processChiArr, sortDaPaiDiscards, terminalSortCs, trimCs } from 'utility';

const getDeadDiscard = (
	ho: IHandObjectives,
	dc: IDiscardCategories,
	reqCs: string[] = [],
	considerS = true
): string => {
	const { priorMeld, priorSuits, keepDaPai } = ho;
	const { countAllKnownCs, ownCs, deadChi, deadPong, ownSingles } = dc;
	const _priorSuits = priorSuits.slice(0, 2);
	const _deadPong = trimCs(deadPong, _priorSuits, considerS);
	const _deadChi = trimCs(deadChi, _priorSuits, considerS);
	let deadTs: string[] = [];

	switch (priorMeld) {
		case MeldType.CHI:
			deadTs = [
				...(keepDaPai
					? ownCs.filter(c => deadPong.includes(c))
					: sortDaPaiDiscards(
							ownCs.filter(c => getSuitFromStr(c) === Suit.DAPAI && !reqCs.includes(c)),
							ho.scoringPongs,
							ownSingles,
							countAllKnownCs
					  )),
				...terminalSortCs(_deadChi)
			];
			break;
		case MeldType.PONG:
			deadTs = terminalSortCs(_deadPong);
			break;
		default:
			deadTs = [...terminalSortCs(_deadPong), ...terminalSortCs(_deadChi)];
			break;
	}
	return deadTs[0] || null;
};

const getHardDiscard = (
	ho: IHandObjectives,
	dc: IDiscardCategories,
	reqCs: string[] = [],
	considerS = true,
	full = false
): string[] => {
	const {
		countAllKnownCs,
		hardPong,
		deadPairs,
		ownCs,
		ownSingles,
		multis,
		easyChi,
		okayChi,
		hardChi,
		easyPong,
		okayPong
	} = dc;
	const { priorMeld, priorSuits, keepDaPai, scoringPongs: scPs } = ho;

	const _priorSuits = priorSuits.slice(0, 2);
	let _hardPong = trimCs(hardPong, _priorSuits, considerS);

	// early retrun for hardChi/ hardPong
	let c: string[] = [];
	let toAdd: string[] = [];
	if (priorMeld === MeldType.CHI) {
		let _hardChi = trimCs(hardChi, _priorSuits, considerS);
		toAdd = [
			...(keepDaPai
				? []
				: sortDaPaiDiscards(
						ownCs.filter(c => getSuitFromStr(c) === Suit.DAPAI),
						scPs,
						ownSingles,
						countAllKnownCs
				  )),
			...processChiArr(_hardChi, hardChi, multis)
		];
	} else {
		let _deadPairs = trimCs(deadPairs, _priorSuits, considerS);
		_hardPong = trimCs(_hardPong, scPs);
		toAdd = [...terminalSortCs(_deadPairs.length > 0 ? _deadPairs : deadPairs), ...terminalSortCs(_hardPong)];
	}
	toAdd = trimCs(toAdd, reqCs, !!reqCs.length);
	c = [...c, ...toAdd];
	if (c.length > 0 && !full) {
		return [c[0]];
	}

	// early retrun for okayChi/ okayPong
	if (priorMeld === MeldType.CHI) {
		let _okayChi = trimCs(okayChi, _priorSuits, considerS);
		toAdd = [
			...terminalSortCs(multis.length > 1 ? multis.filter(c => ![...easyChi].includes(c)) : []),
			...terminalSortCs(_okayChi.length > 0 ? _okayChi : okayChi)
		];
	} else {
		let _okayPong = trimCs(okayPong, _priorSuits, considerS);
		toAdd = terminalSortCs(_okayPong);
	}
	toAdd = trimCs(toAdd, reqCs, !!reqCs.length);
	c = [...c, ...toAdd];
	if (c.length > 0 && !full) {
		return [c[0]];
	}

	// early retrun for easyChi/ easyPong
	if (priorMeld === MeldType.CHI) {
		let _easyChi = trimCs(easyChi, _priorSuits, considerS);
		toAdd = terminalSortCs(_easyChi.length > 0 ? _easyChi : okayChi);
	} else {
		let _easyPong = trimCs(easyPong, _priorSuits, considerS);
		toAdd = terminalSortCs(_easyPong);
	}
	toAdd = trimCs(toAdd, reqCs, !!reqCs.length);
	c = [...c, ...toAdd];
	if (c.length > 0 && !full) {
		return [c[0]];
	}

	let discard = arrToSetArr(c);
	return full ? discard : [discard[0]] || [];
};

export { getDeadDiscard, getHardDiscard };
