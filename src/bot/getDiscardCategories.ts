import { Suit } from 'enums';
import {
	arrToSetArr,
	countStrEle,
	findTwo,
	firstNeighbors,
	getChiWaitingTs,
	countTilesBySuit,
	isSuitedTile,
	secondNeighbors,
	terminalSortTs
} from 'utility';

const getDiscardCategories = (ps: IPlayer[], hTs: IShownTile[]): IDiscardCategories => {
	const otherOpenTs = ps.map(p => [...p.sTs, ...p.dTs]).flat();
	const otherOpenCs = otherOpenTs.map(t => t.c).sort();
	const countOwnCsByS = countTilesBySuit(hTs);
	const ownCs = hTs.map(t => t.c).sort();
	const manyDaPai = hTs.length > 10 && hTs.filter(t => t.s === Suit.DAPAI).length > 5;

	const _ownTsWNs: IShownTileWNeighbors[] = hTs.map(t => {
		const _1 = arrToSetArr(firstNeighbors(t, hTs));
		const _2 = arrToSetArr(secondNeighbors(t, hTs));
		const wChi = arrToSetArr([..._1, ..._2].map(n => getChiWaitingTs(t.c, n)).flat()) || [];
		return { ...t, _1, _2, wChi };
	});
	const allKnownCs = [...otherOpenCs, ...ownCs];
	const countAllKnownCs = countStrEle(allKnownCs);
	const countHandCs = countStrEle(ownCs);
	const ownSingles = arrToSetArr(ownCs.filter(c => countHandCs[c] === 1));
	const multis = arrToSetArr(ownCs.filter(c => countHandCs[c] > 1));
	const _1known = arrToSetArr(allKnownCs.filter(c => countAllKnownCs[c] === 1));
	const _2known = arrToSetArr(allKnownCs.filter(c => countAllKnownCs[c] === 2));
	const _3known = arrToSetArr(allKnownCs.filter(c => countAllKnownCs[c] === 3));
	const _4known = arrToSetArr(allKnownCs.filter(c => countAllKnownCs[c] === 4));
	const loneTs = arrToSetArr(
		terminalSortTs(_ownTsWNs.filter(t => countHandCs[t.c] === 1 && t._1.length === 0)).map(t => t.c)
	);

	function playerHasC(c: string) {
		return ownCs.includes(c);
	}

	function isFreshC(c: string) {
		return !otherOpenCs.includes(c);
	}

	// PONG
	// isOkPC if player has 2 and T has been shown 1 time
	function isOkPC(c: string) {
		return (multis.includes(c) && _3known.includes(c)) || (ownSingles.includes(c) && isFreshC(c));
	}

	// isHPC if player has 1 and T has been shown 1 times
	function isHPC(c: string) {
		return ownSingles.includes(c) && _2known.includes(c);
	}

	// T cannot be pong'd if user has 1 and T has been shown >1 times
	function isDPC(c: string) {
		return ownSingles.includes(c) && [..._3known, ..._4known].includes(c);
	}

	// CHI
	function canBeChi(t: IShownTileWNeighbors) {
		return isSuitedTile(t) && t.wChi.length > 0;
	}

	// isECT if each waitingChiT has is in hand, fresh, or shown 1 time
	function isECT(t: IShownTileWNeighbors) {
		return (
			isSuitedTile(t) &&
			t.wChi.length > 1 &&
			(t.wChi.find(c => playerHasC(c)) ||
				t.wChi.every(c => isFreshC(c) || (!playerHasC(c) && _1known.includes(c))))
		);
	}

	// isHCT if each waitingChiT has been shown >= 2 times
	function isHCT(t: IShownTileWNeighbors) {
		return (
			isSuitedTile(t) &&
			(loneTs.includes(t.c) ||
				t._1.length === 0 ||
				(t.wChi.length > 0 &&
					t.wChi.every(c => !playerHasC(c) && [..._2known, ..._3known, ..._4known].includes(c))))
		);
	}

	// isDCT if each waitingChiT has been shown 4 times
	function isDCT(t: IShownTileWNeighbors) {
		return isSuitedTile(t) && t.wChi.length > 0 && t.wChi.every(c => !playerHasC(c) && _4known.includes(c));
	}

	const deadPairs: string[] = [];
	const easyPong: string[] = [];
	arrToSetArr(multis).forEach(c => {
		if (findTwo(c, otherOpenCs)) {
			deadPairs.push(c);
		} else {
			easyPong.push(c);
		}
	});

	const okayPong: string[] = [];
	const hardPong: string[] = [];
	const deadPong: string[] = [];
	arrToSetArr(ownCs).forEach(c => {
		if (![...easyPong, ...deadPairs].includes(c)) {
			if (isDPC(c)) {
				deadPong.push(c);
			} else if (isHPC(c)) {
				hardPong.push(c);
			} else if (isOkPC(c)) {
				okayPong.push(c);
			}
		}
	});

	const easyChi: string[] = [];
	const okayChi: string[] = [];
	const hardChi: string[] = [];
	const deadChi: string[] = [];
	_ownTsWNs.forEach(t => {
		if (isDCT(t)) {
			deadChi.push(t.c);
		} else if (isHCT(t)) {
			hardChi.push(t.c);
		} else if (isECT(t)) {
			if (t.wChi.length <= 1) {
				easyChi.unshift(t.c);
			} else {
				easyChi.push(t.c);
			}
		} else if (canBeChi(t)) {
			okayChi.push(t.c);
		}
	});

	// function isWaitingOne(t: IShownTileWNeighbors) { return t.wChi.length === 1; }
	function isWaitingTwo(t: IShownTileWNeighbors) {
		return arrToSetArr(t.wChi).length > 1;
	}
	// const minorChiTs = arrToSetArr(hTs.filter(t => isSuitedMinorTile(t)).map(t => t.c));
	// const waitingOneChi = arrToSetArr(_ownTsWNs.filter(t => isWaitingOne(t)).map(t => t.c));
	const waitingTwoChi = arrToSetArr(_ownTsWNs.filter(t => isWaitingTwo(t)).map(t => t.c));

	return {
		ownCs,
		ownSingles,
		multis,
		loneTs,
		deadPairs,
		easyChi: arrToSetArr(easyChi),
		okayChi: arrToSetArr(okayChi),
		hardChi: arrToSetArr(hardChi),
		deadChi: arrToSetArr(deadChi),
		easyPong,
		okayPong,
		hardPong,
		deadPong,
		waitingTwoChi,
		countHandCs,
		countOwnCsByS,
		countAllKnownCs,
		manyDaPai
	};
};

export default getDiscardCategories;
