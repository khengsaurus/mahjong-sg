import isEmpty from 'lodash/isempty';
import { getHands } from 'bot';
import { Animal, DaPai, Flower, MeldType, Suit, Wind } from 'enums';
import { ScoringHand } from 'handEnums';
import { Game, User } from 'models';
import {
	getAnimalMock,
	getFlowerMock,
	getHBFHashTileMock,
	getSuitedHashTileMock,
	getSuitedTileMock,
	getWindHashTileMock
} from 'utility';
import { mainLRUCache } from 'utility/LRUCache';
import {
	hasMelded_2S_3S,
	hasMelded_2S_3S_2W,
	hasMelded_2S_3S_2W_3W,
	hasNotDrawn,
	hasSelfDrawn,
	meldedLastThrown,
	resetGame,
	resetPlayer
} from './util';

describe('useHand -> HH', () => {
	const g = new Game('');
	const p = new User('', '', '');

	beforeEach(() => {
		resetPlayer([p]);
		resetGame(g, [p]);
	});

	afterEach(() => mainLRUCache.clear());

	function reuseMockHashLess7W() {
		g.ps[0].hTs = [1, 2, 3, 4, 4, 8, 9].map((i, index) =>
			getSuitedHashTileMock(111, Suit.WAN, i, index)
		);
	}

	function reuseMockHashLess3W() {
		g.ps[0].hTs = [1, 1, 2, 2, 3, 9, 9].map((i, index) =>
			getSuitedHashTileMock(111, Suit.WAN, i, index)
		);
	}

	function reuseMockHashLess2W() {
		g.ps[0].hTs = [1, 1, 2, 3, 3, 9, 9].map((i, index) =>
			getSuitedHashTileMock(111, Suit.WAN, i, index)
		);
	}

	function lacking9WPair() {
		g.ps[0].hTs = [1, 2, 3, 4, 5, 6, 9].map((i, index) =>
			getSuitedHashTileMock(111, Suit.WAN, i, index)
		);
	}

	function lacking3WEdgePair() {
		g.ps[0].hTs = [1, 2, 3, 3, 5, 6, 7].map((i, index) =>
			getSuitedHashTileMock(111, Suit.WAN, i, index)
		);
	}

	describe('HH', () => {
		it('pinghu if self drawn (7 edge tile)', () => {
			hasMelded_2S_3S(g);
			reuseMockHashLess7W();
			hasSelfDrawn(g, getSuitedHashTileMock(111, Suit.WAN, 7, 9));

			const { HH } = getHands(g, 0, 111);
			expect(HH.pxs[0].hD).toBe(ScoringHand.CHI_4);
			expect(HH.maxPx).toBe(4);
		});

		it('not pinghu if not self drawn (7 edge tile)', () => {
			hasMelded_2S_3S(g);
			reuseMockHashLess7W();
			hasNotDrawn(g, getSuitedTileMock(Suit.WAN, 7, 9));

			const { HH } = getHands(g, 0, 111);
			expect(isEmpty(HH)).toBeTruthy();
		});

		it('pinghu if self drawn (3 edge tile)', () => {
			hasMelded_2S_3S(g);
			reuseMockHashLess3W();
			hasSelfDrawn(g, getSuitedHashTileMock(111, Suit.WAN, 3, 9));

			const { HH } = getHands(g, 0, 111);
			expect(HH.pxs[0].hD).toBe(ScoringHand.CHI_4);
			expect(HH.maxPx).toBe(4);
		});

		it('not pinghu if not self drawn (3 edge tile)', () => {
			hasMelded_2S_3S(g);
			reuseMockHashLess3W();
			hasNotDrawn(g, getSuitedTileMock(Suit.WAN, 3, 9));

			const { HH } = getHands(g, 0, 111);
			expect(isEmpty(HH)).toBeTruthy();
		});

		it('pingHu if self drawn (middle tile), with flowers', () => {
			hasMelded_2S_3S(g, [getAnimalMock(Animal.CAT)]);
			reuseMockHashLess2W();
			hasSelfDrawn(g, getSuitedHashTileMock(111, Suit.WAN, 2));

			const { HH } = getHands(g, 0, 111);
			const hDs = HH.pxs.map(p => p.hD);
			expect(hDs.includes(ScoringHand.CHI_1)).toBeTruthy();
			expect(hDs.includes(`${ScoringHand.FS}-1`)).toBeTruthy();
			expect(HH.maxPx).toBe(2);
		});

		it('not pingHu if not self drawn (middle tile)', () => {
			hasMelded_2S_3S(g);
			hasNotDrawn(g, getSuitedTileMock(Suit.WAN, 2, 9));
			reuseMockHashLess2W();

			const { HH } = getHands(g, 0, 111);
			expect(isEmpty(HH)).toBeTruthy();
		});

		it('pingHu if self drawn (pair)', () => {
			lacking9WPair();
			hasMelded_2S_3S(g);
			hasSelfDrawn(g, getSuitedHashTileMock(111, Suit.WAN, 9, 9));

			const { HH } = getHands(g, 0, 111);
			expect(HH.pxs[0].hD).toBe(ScoringHand.CHI_4);
			expect(HH.maxPx).toBe(4);
		});

		it('not pingHu if not self drawn (pair)', () => {
			lacking9WPair();
			hasMelded_2S_3S(g);
			hasNotDrawn(g, getSuitedTileMock(Suit.WAN, 9, 9));

			const { HH } = getHands(g, 0, 111);
			expect(isEmpty(HH)).toBeTruthy();
		});

		it('pingHu if self drawn edge (pair)', () => {
			lacking3WEdgePair();
			hasMelded_2S_3S(g);
			hasSelfDrawn(g, getSuitedHashTileMock(111, Suit.WAN, 3, 9));

			const { HH } = getHands(g, 0, 111);
			expect(HH.pxs[0].hD).toBe(ScoringHand.CHI_4);
			expect(HH.maxPx).toBe(4);
		});

		it('not pingHu if not self drawn edge (pair)', () => {
			lacking3WEdgePair();
			hasMelded_2S_3S(g);
			hasNotDrawn(g, getSuitedTileMock(Suit.WAN, 3, 9));

			const { HH } = getHands(g, 0, 111);
			expect(isEmpty(HH)).toBeTruthy();
		});

		it('not pingHu - HBF pair', () => {
			hasMelded_2S_3S_2W_3W(g);
			hasSelfDrawn(g, getHBFHashTileMock(111, DaPai.RED, 1));
			g.ps[0].hTs = [getHBFHashTileMock(111, DaPai.RED, 1)];

			const { HH } = getHands(g, 0, 111);
			expect(isEmpty(HH)).toBeTruthy();
		});

		it('pingHu - non scoring wind pair, self drawn', () => {
			hasMelded_2S_3S_2W_3W(g);
			hasSelfDrawn(g, getWindHashTileMock(111, Wind.S, 1));
			g.ps[0].hTs = [getWindHashTileMock(111, Wind.S, 2)];

			const { HH } = getHands(g, 0, 111);
			const hDs = HH.pxs.map(p => p.hD);
			expect(hDs.includes(ScoringHand.CHI_4)).toBeTruthy();
			expect(HH.maxPx).toBe(4);
		});

		it('not pingHu - scoring wind pair', () => {
			hasMelded_2S_3S_2W_3W(g);
			hasNotDrawn(g, getWindHashTileMock(111, Wind.E, 1));
			g.ps[0].hTs = [getWindHashTileMock(111, Wind.E, 2)];

			const { HH } = getHands(g, 0, 111);
			expect(isEmpty(HH)).toBeTruthy();
		});

		it('pingHu, suited, concealed', () => {
			g.ps[0].hTs = [1, 2, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9].map((i, index) =>
				getSuitedHashTileMock(111, Suit.WAN, i, index)
			);
			hasSelfDrawn(g, getSuitedHashTileMock(111, Suit.WAN, 1, 1));

			const { HH } = getHands(g, 0, 111);
			const hDs = HH.pxs.map(p => p.hD);
			expect(hDs.includes(ScoringHand.CHI_4)).toBeTruthy();
			expect(hDs.includes(ScoringHand.SUITED)).toBeTruthy();
			expect(hDs.includes(ScoringHand.CONCEALED)).toBeTruthy();
			expect(hDs.length).toBe(3);
			expect(HH.maxPx).toBe(9);
		});

		it('ping hu - formed 1 pair when waiting with 1 2 3 4, self drawn', () => {
			hasMelded_2S_3S_2W(g);
			g.ps[0].hTs = [1, 2, 3, 4].map(i =>
				getSuitedHashTileMock(111, Suit.TONG, i, i)
			);
			hasSelfDrawn(g, getSuitedHashTileMock(111, Suit.TONG, 1, 2));

			const { HH } = getHands(g, 0, 111);
			const hDs = HH.pxs.map(p => p.hD);
			expect(hDs.includes(ScoringHand.CHI_4)).toBeTruthy();
			expect(HH.maxPx).toBe(4);
		});

		it('ping hu - formed 7 pair when waiting with 4 5 6 7, with flower, not self drawn', () => {
			hasMelded_2S_3S(g, [getFlowerMock(Flower.FM, true)]);
			const wanTs = [7, 8, 9].map(i => getSuitedHashTileMock(111, Suit.WAN, i, i));
			const tongTs = [4, 5, 6, 7].map(i =>
				getSuitedHashTileMock(111, Suit.TONG, i, i)
			);
			g.ps[0].hTs = [...wanTs, ...tongTs];

			hasNotDrawn(g, getSuitedTileMock(Suit.TONG, 7, 2));

			const { HH } = getHands(g, 0, 111);
			const hDs = HH.pxs.map(p => p.hD);
			expect(hDs.includes(ScoringHand.CHI_1)).toBeTruthy();
			expect(HH.maxPx).toBe(2);
		});

		it('ping hu - formed 3 pair when waiting with 3 4 5 6, not self drawn', () => {
			hasMelded_2S_3S(g);
			const wanTs = [2, 3, 4].map(i => getSuitedHashTileMock(111, Suit.WAN, i, i));
			const tongTs = [3, 4, 5, 6].map(i =>
				getSuitedHashTileMock(111, Suit.TONG, i, i)
			);
			g.ps[0].hTs = [...wanTs, ...tongTs];

			hasNotDrawn(g, getSuitedTileMock(Suit.TONG, 3, 2));

			const { HH } = getHands(g, 0, 111);
			const hDs = HH.pxs.map(p => p.hD);
			expect(hDs.includes(ScoringHand.CHI_4)).toBeTruthy();
			expect(HH.maxPx).toBe(4);
		});

		it('not ping hu - non unique waiting pair', () => {
			hasMelded_2S_3S_2W(g);
			g.ps[0].hTs = [1, 3, 4, 5].map((i, index) =>
				getSuitedHashTileMock(111, Suit.WAN, i, index)
			);
			hasNotDrawn(g, getSuitedTileMock(Suit.WAN, 1, 9));

			const { HH } = getHands(g, 0, 111);
			expect(isEmpty(HH)).toBeTruthy();
		});

		/* ----------------------------------- Player melded first ----------------------------------- */

		it('not ping hu - alr melded middle tile to form complete chi hand', () => {
			const hiddenTs = [1, 2, 2, 3, 3, 4, 9, 9].map((i, index) =>
				getSuitedHashTileMock(111, Suit.SUO, i, index)
			);
			const shownTs = [2, 3, 4, 1].map((i, index) =>
				getSuitedTileMock(Suit.WAN, i, index)
			);
			const lTh = getSuitedTileMock(Suit.WAN, 2, 2);
			g.lTh = { r: lTh.r }; // taken lTh tile
			g.ps[0].ms = [`${MeldType.CHI}-3${Suit.WAN}`, `${MeldType.CHI}-2${Suit.WAN}`];
			g.ps[0].hTs = hiddenTs;
			g.ps[0].sTs = [...shownTs, lTh, getSuitedTileMock(Suit.WAN, 3, 2)];
			g.ps[0].lTa = {}; // not self drawn
			g.f[3] = true; // taken

			const { HH } = getHands(g, 0, 111);
			expect(isEmpty(HH)).toBeTruthy();
		});

		it('not ping hu - alr melded edge tile to form complete chi hand', () => {
			g.ps[0].sTs = [2, 3, 4, 1, 2].map((i, index) =>
				getSuitedTileMock(Suit.WAN, i, index)
			);
			g.ps[0].ms = [`${MeldType.CHI}-3${Suit.WAN}`, `${MeldType.CHI}-2${Suit.WAN}`];
			g.ps[0].hTs = [1, 2, 2, 3, 3, 4, 9, 9].map((i, index) =>
				getSuitedHashTileMock(111, Suit.SUO, i, index)
			);
			meldedLastThrown(g, getSuitedTileMock(Suit.WAN, 3, 2));

			const { HH } = getHands(g, 0, 111);
			expect(isEmpty(HH)).toBeTruthy();
		});

		it('ping hu - alr melded tile to form complete chi hand', () => {
			g.ps[0].sTs = [2, 3, 4, 2, 3].map((i, index) =>
				getSuitedTileMock(Suit.WAN, i, index)
			);
			g.ps[0].ms = [`${MeldType.CHI}-3${Suit.WAN}`, `${MeldType.CHI}-3${Suit.WAN}`];
			g.ps[0].hTs = [1, 2, 2, 3, 3, 4, 9, 9].map((i, index) =>
				getSuitedHashTileMock(111, Suit.SUO, i, index)
			);
			meldedLastThrown(g, getSuitedTileMock(Suit.WAN, 4, 2));

			const { HH } = getHands(g, 0, 111);
			const hDs = HH.pxs.map(p => p.hD);
			expect(hDs.includes(ScoringHand.CHI_4)).toBeTruthy();
			expect(HH.maxPx).toBe(4);
		});
	});
});
