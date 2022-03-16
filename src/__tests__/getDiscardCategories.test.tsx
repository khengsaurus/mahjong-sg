import { getDiscardCategories } from 'bot';
import { DaPai, Suit } from 'enums';
import { getHBFMock, getSuitedTileMock } from 'utility';

describe('getDiscardCategories -> meld categories', () => {
	const dummyUser = { uN: '', sTs: [], msStr: [], fPx: 0, dTs: [] };

	it('pong tiles difficulty', () => {
		const p1 = {
			...dummyUser,
			dTs: [2, 2, 2, 3, 3, 4, 4, 5, 6].map((i, index) => getSuitedTileMock(Suit.WAN, i, index))
		};
		const wanTs = [2, 3, 4, 4, 5, 6, 6, 7, 8, 8].map((i, index) => getSuitedTileMock(Suit.WAN, i, index));
		const daPai = [DaPai.RED, DaPai.RED, DaPai.RED, DaPai.RED].map((i, index) => getHBFMock(i, index));
		const { easyPong, okayPong, hardPong, deadPong, deadPairs } = getDiscardCategories([p1], [...wanTs, ...daPai]);

		// Pong difficulty
		expect(deadPong.length).toBe(2);
		expect(deadPong.includes(`2${Suit.WAN}`) && deadPong.includes(`3${Suit.WAN}`)).toBeTruthy();

		expect(hardPong.length).toBe(1);
		expect(hardPong.includes(`5${Suit.WAN}`)).toBeTruthy();

		expect(okayPong.length).toBe(1);
		expect(okayPong[0]).toBe(`7${Suit.WAN}`);

		expect(easyPong.length).toBe(3);
		expect(
			easyPong.includes(`6${Suit.WAN}`) && easyPong.includes(`8${Suit.WAN}`) && easyPong.includes(DaPai.RED)
		).toBeTruthy();

		// Others
		expect(deadPairs.length).toBe(1);
		expect(deadPairs[0]).toBe(`4${Suit.WAN}`);
	});

	it('chi tiles difficulty', () => {
		const dWanTs = [3, 3, 3, 3, 7].map((i, index) => getSuitedTileMock(Suit.WAN, i, index));
		const dTongTs = [6, 6, 9, 9].map((i, index) => getSuitedTileMock(Suit.TONG, i, index));
		const dSuoTs = [3, 3, 3].map((i, index) => getSuitedTileMock(Suit.SUO, i, index));
		const p1 = {
			...dummyUser,
			dTs: [...dWanTs, ...dTongTs, ...dSuoTs]
		};
		const wanTs = [1, 2, 5, 6, 8, 8].map((i, index) => getSuitedTileMock(Suit.WAN, i, index));
		const tongTs = [3, 5, 7, 8].map((i, index) => getSuitedTileMock(Suit.TONG, i, index));
		const suoTs = [4, 5].map((i, index) => getSuitedTileMock(Suit.SUO, i, index));

		const { easyChi, okayChi, hardChi, deadChi } = getDiscardCategories([p1], [...wanTs, ...tongTs, ...suoTs]);

		// Chi difficulty
		expect(deadChi.length).toBe(2);
		expect(deadChi.includes(`1${Suit.WAN}`) && deadChi.includes(`2${Suit.WAN}`)).toBeTruthy();

		expect(hardChi.length).toBe(5);
		expect(
			hardChi.includes(`3${Suit.TONG}`) &&
				hardChi.includes(`5${Suit.TONG}`) &&
				hardChi.includes(`7${Suit.TONG}`) &&
				hardChi.includes(`8${Suit.TONG}`)
		).toBeTruthy();

		expect(okayChi.length).toBe(2);
		expect(okayChi.includes(`4${Suit.SUO}`) && okayChi.includes(`5${Suit.SUO}`)).toBeTruthy();

		expect(easyChi.length).toBe(2);
		expect(easyChi.includes(`5${Suit.WAN}`) && easyChi.includes(`6${Suit.WAN}`)).toBeTruthy();
	});
});
