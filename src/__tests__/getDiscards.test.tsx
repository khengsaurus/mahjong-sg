import { getDeadDiscard, getDiscardCategories, getHandObjectives, getHardDiscard } from 'bot';
import { DaPai, MeldType, Suit } from 'enums';
import { getHBFMock, getSuitedTileMock } from 'utility';

describe('getDiscardCategories & getHandObjectives -> getHardDiscard', () => {
	const dummyUser = { uN: '', sTs: [], msStr: [], fPx: 0, dTs: [] };

	it('getDeadDiscard & getHardDiscard for pong hand', () => {
		const dWans = [2, 2, 2, 3, 3, 4, 4, 5, 6].map((i, index) => getSuitedTileMock(Suit.WAN, i, index));

		const p1 = {
			...dummyUser,
			dTs: dWans
		};
		const wanTs = [3, 2, 4, 4, 5, 6, 6, 7, 8, 8].map((i, index) => getSuitedTileMock(Suit.WAN, i, index));
		const daPai = [DaPai.RED, DaPai.RED, DaPai.RED, DaPai.RED].map((i, index) => getHBFMock(i, index));

		const dc = getDiscardCategories([p1], [...wanTs, ...daPai]);
		let ho = getHandObjectives(dc);
		ho = { ...ho, priorSuits: [Suit.DAPAI, Suit.SUO] }; // mocking to retain wan tiles in array
		const dD = getDeadDiscard(ho, dc, [], false);
		const hDs = getHardDiscard(ho, dc, [], true, true);

		expect(ho.priorMeld).toBe(MeldType.PONG);
		expect(dc.hardPong[0]).toBe(`5${Suit.WAN}`);
		expect(dD).toBe(`2${Suit.WAN}`);
		expect(hDs.join('')).toBe(`4${Suit.WAN}5${Suit.WAN}7${Suit.WAN}8${Suit.WAN}6${Suit.WAN}`);
	});

	it('getDeadDiscard & getHardDiscard for chi hand', () => {
		const dWanTs = [3, 3, 3, 3, 7].map((i, index) => getSuitedTileMock(Suit.WAN, i, index));
		const dTongTs = [6, 6, 9, 9].map((i, index) => getSuitedTileMock(Suit.TONG, i, index));
		const dSuoTs = [3, 3, 3].map((i, index) => getSuitedTileMock(Suit.SUO, i, index));
		const p1 = {
			...dummyUser,
			dTs: [...dWanTs, ...dTongTs, ...dSuoTs]
		};
		const wanTs = [2, 1, 5, 6, 8, 8].map((i, index) => getSuitedTileMock(Suit.WAN, i, index));
		const tongTs = [3, 5, 7, 8].map((i, index) => getSuitedTileMock(Suit.TONG, i, index));
		const suoTs = [7, 8, 4, 5].map((i, index) => getSuitedTileMock(Suit.SUO, i, index));

		const dc = getDiscardCategories([p1], [...wanTs, ...tongTs, ...suoTs]);
		const ho = getHandObjectives(dc);
		const dD = getDeadDiscard(ho, dc, [], false);
		const hDs = getHardDiscard(ho, dc, [], true, true);

		expect(ho.priorMeld).toBe(MeldType.CHI);
		expect(dD).toBe(`1${Suit.WAN}`);
		expect(hDs.join('').slice(0, 10)).toBe(`8${Suit.WAN}8${Suit.TONG}3${Suit.TONG}7${Suit.TONG}5${Suit.TONG}`);
	});
});
