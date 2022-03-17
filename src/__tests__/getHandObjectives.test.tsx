import { getDiscardCategories, getHandObjectives } from 'bot';
import { DaPai, MeldType, Suit, Wind } from 'enums';
import isEmpty from 'lodash.isempty';
import { getHBFMock, getSuitedTileMock } from 'utility';

const dummyUser = { uN: '', sTs: [], msStr: [], fPx: 0, dTs: [] };

describe('getHandObjectives', () => {
	const p1WanTs = [1, 1].map((i, x) => getSuitedTileMock(Suit.WAN, i, x));
	const p1TongTs = [3, 3, 3, 3, 6, 6].map((i, x) => getSuitedTileMock(Suit.TONG, i, x));
	const p1SuoTs = [6, 7, 8, 9, 9, 9].map((i, x) => getSuitedTileMock(Suit.SUO, i, x));
	const p1 = {
		...dummyUser,
		sTs: p1SuoTs,
		dTs: [...p1WanTs, ...p1TongTs]
	};

	it('chi hand no dapai -> prior chi, no dapai', () => {
		const hWanTs = [1, 1, 2, 3, 4, 9].map((i, x) => getSuitedTileMock(Suit.WAN, i, x));
		const hTongTs = [1, 2, 4, 5].map((i, x) => getSuitedTileMock(Suit.TONG, i, x));
		const hSuoTs = [1, 2, 3, 6, 6, 7].map((i, x) => getSuitedTileMock(Suit.SUO, i, x));
		const hTs = [...hWanTs, ...hTongTs, ...hSuoTs];
		const discardCategories = getDiscardCategories([p1], hTs);
		const ho = getHandObjectives(discardCategories, [], [Wind.E, Wind.E], 0);

		expect(ho.priorMeld).toBe(MeldType.CHI);
		expect(isEmpty(ho.priorSuits)).toBeTruthy();
		expect(ho.keepDaPai).toBeFalsy();
	});

	it('melded 3x chi 2S -> prior chi, no prior S, no dapai', () => {
		const hWanTs = [1, 1, 2, 3, 4, 9].map((i, x) => getSuitedTileMock(Suit.WAN, i, x));
		const hTs = hWanTs;
		const discardCategories = getDiscardCategories([p1], hTs);
		const ho = getHandObjectives(
			discardCategories,
			[`${MeldType.CHI}-7${Suit.TONG}`, `${MeldType.CHI}-7${Suit.TONG}`, `${MeldType.CHI}-7${Suit.WAN}`],
			[Wind.E, Wind.E],
			0
		);
		expect(ho.priorMeld).toBe(MeldType.CHI);
		expect(isEmpty(ho.priorSuits)).toBeTruthy();
		expect(ho.keepDaPai).toBeFalsy();
	});

	it('chi 3x S, easy scoring pong -> prior C, S, keep dapai', () => {
		const hWanTs = [1, 1, 2, 3].map((i, x) => getSuitedTileMock(Suit.WAN, i, x));
		const daPai = [DaPai.GREEN, DaPai.GREEN].map((c, x) => getHBFMock(c, x));
		const hTs = [...hWanTs, ...daPai];
		const discardCategories = getDiscardCategories([p1], hTs);
		const ho = getHandObjectives(
			discardCategories,
			[`${MeldType.CHI}-7${Suit.WAN}`, `${MeldType.CHI}-7${Suit.WAN}`],
			[Wind.E, Wind.E],
			0
		);
		expect(ho.priorMeld).toBe(MeldType.CHI);
		expect(ho.priorSuits[0]).toBe(Suit.WAN);
		expect(ho.keepDaPai).toBeTruthy();
	});

	it('no melds, strong wan, easy scoring pong -> prior pong, dapai & wan', () => {
		const hWanTs = [1, 1, 1, 2, 2, 3, 3, 4, 9].map((i, x) => getSuitedTileMock(Suit.WAN, i, x));
		const hTongTs = [1, 2, 4, 5, 6].map((i, x) => getSuitedTileMock(Suit.TONG, i, x));
		const hDaPai = [DaPai.GREEN, DaPai.GREEN, DaPai.GREEN].map((i, x) => getHBFMock(i, x));
		const hTs = [...hWanTs, ...hTongTs, ...hDaPai];
		const discardCategories = getDiscardCategories([p1], hTs);
		const ho = getHandObjectives(discardCategories, [], [Wind.E, Wind.E], 0);

		expect(ho.priorMeld).toBe(MeldType.PONG);
		expect(ho.priorSuits[0]).toBe(Suit.WAN);
		expect(ho.priorSuits[1]).toBe(Suit.DAPAI);
		expect(ho.keepDaPai).toBeTruthy();
	});

	it('no meld // 3x pong W // 2x pong 1 chi W -> prior P D // P W & D // null W & D', () => {
		const hWanTs = [1, 1, 2, 2, 4, 9, 9].map((i, x) => getSuitedTileMock(Suit.WAN, i, x));
		const hTongTs = [4, 4, 5, 6, 9, 9].map((i, x) => getSuitedTileMock(Suit.TONG, i, x));
		const hDaPai = [DaPai.GREEN, DaPai.GREEN, DaPai.GREEN].map((i, x) => getHBFMock(i, x));
		const hTs = [...hWanTs, ...hTongTs, ...hDaPai];
		const discardCategories = getDiscardCategories([p1], hTs);

		const ho1 = getHandObjectives(discardCategories, [], [Wind.E, Wind.E], 0);
		expect(ho1.priorMeld).toBe(MeldType.PONG);
		expect(ho1.priorSuits[0]).toBe(Suit.WAN);
		expect(ho1.priorSuits[1]).toBe(Suit.DAPAI);

		const ho2 = getHandObjectives(
			discardCategories,
			[`${MeldType.KANG}-8${Suit.WAN}`, `${MeldType.PONG}-6${Suit.WAN}`, `${MeldType.PONG}-7${Suit.WAN}`],
			[Wind.E, Wind.E],
			0
		);
		expect(ho2.priorMeld).toBe(MeldType.PONG);
		expect(ho2.priorSuits[0]).toBe(Suit.WAN);
		expect(ho2.priorSuits[1]).toBe(Suit.DAPAI);

		const ho3 = getHandObjectives(
			discardCategories,
			[`${MeldType.CHI}-8${Suit.WAN}`, `${MeldType.PONG}-6${Suit.WAN}`, `${MeldType.PONG}-7${Suit.WAN}`],
			[Wind.E, Wind.E],
			0
		);

		expect(ho3.priorMeld).toBe(null);
		expect(ho3.priorSuits[0]).toBe(Suit.WAN);
		expect(ho3.priorSuits[1]).toBe(Suit.DAPAI);
		expect(ho1.keepDaPai && ho2.keepDaPai && ho3.keepDaPai).toBeTruthy();
	});

	it('pong 2 S -> prior P D', () => {
		const hWanTs = [1, 1, 2, 2, 4, 9, 9].map((i, x) => getSuitedTileMock(Suit.WAN, i, x));
		const hTongTs = [4, 4, 5].map((i, x) => getSuitedTileMock(Suit.TONG, i, x));
		const hDaPai = [DaPai.GREEN, DaPai.GREEN].map((i, x) => getHBFMock(i, x));
		const lTa = getHBFMock(DaPai.GREEN, 9);
		const hTs = [...hWanTs, ...hTongTs, ...hDaPai, lTa];
		const discardCategories = getDiscardCategories([p1], hTs);
		const ho = getHandObjectives(
			discardCategories,
			[`${MeldType.PONG}-8${Suit.WAN}`, `${MeldType.PONG}-9${Suit.TONG}`],
			[Wind.E, Wind.E],
			0
		);

		expect(ho.priorMeld).toBe(MeldType.PONG);
		expect(ho.priorSuits[0]).toBe(Suit.DAPAI);
		expect(ho.priorSuits.length).toBe(1);
		expect(ho.keepDaPai).toBeTruthy();
	});
});
