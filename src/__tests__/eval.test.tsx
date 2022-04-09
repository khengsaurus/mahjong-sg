import { getHands } from 'bot';
import { CardName, Exec, MeldType, Suit, Wind } from 'enums';
import { ScoringHand } from 'handEnums';
import { Game, User } from 'models';
import { getSuitedHashTileMock, getSuitedTileMock, getWindHashTileMock } from 'utility';
import { primaryLRU } from 'utility/LRUCache';
import { resetGame, resetPlayer } from './util';

describe('adhoc tests', () => {
	const g = new Game('');
	const p1 = new User('', '', '');
	const p2 = new User('', '', '');

	beforeEach(() => {
		resetPlayer([p1, p2]);
		resetGame(g, [p1, p2]);
	});

	afterEach(() => primaryLRU.clear());

	function scenario1() {
		const suoTs1 = [2, 3, 5, 6, 7, 9, 9].map((i, index) =>
			getSuitedHashTileMock(111, Suit.SUO, i, index)
		);
		const windTs1 = [Wind.S, Wind.S, Wind.S].map((w, index) =>
			getWindHashTileMock(111, w, index)
		);
		const lTh = getSuitedTileMock(Suit.SUO, 1, 1);
		g.ps[0].ms = [`${MeldType.CHI}-2${Suit.WAN}`];
		g.ps[0].hTs = [...suoTs1, ...windTs1];
		g.lTh = lTh;
		g.n[0] = 4; // player is South wind
		g.n[2] = 3;
		g.n[3] = 0;
		g.n[7] = 3;
	}

	it('1 player can hu', () => {
		scenario1();
		g.handleDelay();

		const { HH } = getHands(g, 0, 111);
		expect(g.t[2]).not.toBeNull();
		expect(g.sk.length).toBe(1);
		expect(g.sk[0]).toBe(`0${Exec.HU}`);
		expect(HH.maxPx).toBe(1);
		expect(HH.pxs.map(p => p.hD).length).toBe(1);
		expect(HH.pxs[0].hD).toBe(`${ScoringHand.MELDED}-${CardName[Wind.S]}`);
	});

	it('2 players can hu', () => {
		scenario1();
		const suoTs2 = [1, 1, 2, 2, 2, 3, 3, 3, 4, 6, 8].map((i, index) =>
			getSuitedHashTileMock(111, Suit.SUO, i, index)
		);
		g.ps[1].hTs = suoTs2;
		g.handleDelay();

		const { HH } = getHands(g, 0, 111);
		expect(g.t[2]).not.toBeNull();
		expect(g.sk.length).toBe(2);
		expect(g.sk[0]).toBe(`0${Exec.HU}`);
		expect(g.sk[1]).toBe(`1${Exec.PONG}`);
		expect(HH.maxPx).toBe(1);
		expect(HH.pxs.map(p => p.hD).length).toBe(1);
		expect(HH.pxs[0].hD).toBe(`${ScoringHand.MELDED}-${CardName[Wind.S]}`);
	});
});
