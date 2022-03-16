import { getHands } from 'bot';
import { Animal, CardName, DaPai, Flower, MeldType, Suit, Wind } from 'enums';
import { FlowersS, ScoringHand } from 'handEnums';
import { Game, User } from 'models';
import {
	getAnimalMock,
	getFlowerMock,
	getHBFHashTileMock,
	getHBFMock,
	getSuitedHashTileMock,
	getSuitedTileMock,
	getWindHashTileMock,
	getWindTileMock
} from 'utility';
import { mainLRUCache } from 'utility/LRUCache';
import { hasSelfDrawn, resetGame, resetPlayer } from './util';

describe('useHand -> HH', () => {
	const g = new Game('');
	const p = new User('', '', '');

	beforeEach(() => {
		resetPlayer([p]);
		resetGame(g, [p]);
	});

	afterEach(() => mainLRUCache.clear());

	it('can hu with 1 tile left, drawing to form pair', () => {
		const tiles = [getSuitedTileMock(Suit.SUO, 1, 1)];
		g.ps[0].ms = [
			`${MeldType.PONG}-${Wind.E}`,
			`${MeldType.PONG}-${Wind.N}`,
			`${MeldType.CHI}-2${Suit.WAN}`,
			`${MeldType.CHI}-2${Suit.SUO}`
		];
		g.lTh = getSuitedTileMock(Suit.SUO, 1, 2);
		g.f[3] = false;
		const { HH } = getHands(g, 0, 111, tiles);
		const hDs = HH.pxs?.map(p => p.hD) || [];
		expect(hDs.includes(`${ScoringHand.MELDED}-${CardName[Wind.E]}`)).toBeTruthy();
		expect(hDs.length).toBe(1);
		expect(HH.maxPx).toBe(2);
	});

	it('concealed', () => {
		const wanTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i, index) => getSuitedTileMock(Suit.WAN, i, index));
		const suoTiles = [1, 2, 3, 4].map((i, index) => getSuitedTileMock(Suit.SUO, i, index));
		const lT = getSuitedTileMock(Suit.SUO, 4, 4);
		g.f[3] = true;
		g.ps[0].lTa = lT;

		const { HH: HH_concealed } = getHands(g, 0, 111, [...wanTiles, ...suoTiles]);
		const hDs_concealed = HH_concealed.pxs?.map(p => p.hD) || [];
		expect(hDs_concealed.includes(ScoringHand.CHI_4)).toBeTruthy();
		expect(hDs_concealed.includes(ScoringHand.CONCEALED)).toBeTruthy();
		expect(hDs_concealed.length).toBe(2);
		expect(HH_concealed.maxPx).toBe(5);

		g.lTh = lT;
		g.f[3] = false;
		g.ps[0].lTa = {};
		const { HH: HH_n_concealed } = getHands(g, 0, 111, [...wanTiles, ...suoTiles]);
		const hDs_n_concealed = HH_n_concealed.pxs?.map(p => p.hD) || [];
		expect(hDs_n_concealed.includes(ScoringHand.CHI_4)).toBeTruthy();
		expect(hDs_n_concealed.includes(ScoringHand.CONCEALED)).toBeFalsy();
	});

	it('pure terminals', () => {
		const wanTs = [1, 9, 9, 9].map((i, index) => getSuitedHashTileMock(111, Suit.WAN, i, index));
		const suoTs = [9, 9, 9].map((i, index) => getSuitedHashTileMock(111, Suit.SUO, i, index));
		g.ps[0].ms = [`${MeldType.KANG}-1${Suit.TONG}`, `${MeldType.PONG}-1${Suit.SUO}`];
		g.ps[0].hTs = [...wanTs, ...suoTs];
		g.lTh = getSuitedTileMock(Suit.WAN, 1, 1);

		const { HH } = getHands(g, 0, 111);
		const hDs = HH.pxs.map(p => p.hD);
		expect(hDs.includes(ScoringHand.TERMS)).toBeTruthy();
		expect(hDs.includes(ScoringHand.PONG)).toBeFalsy();
		expect(hDs.length).toBe(1);
		expect(HH.maxPx).toBe(5);
	});

	it('pure honours', () => {
		const HBFTs = [DaPai.RED, DaPai.RED].map((i, index) => getHBFHashTileMock(111, i, index));
		const windTs = [Wind.E, Wind.E, Wind.E, Wind.S, Wind.S, Wind.S, Wind.W, Wind.W].map((i, index) =>
			getWindHashTileMock(111, i, index)
		);
		g.ps[0].ms = [`${MeldType.KANG}-${DaPai.GREEN}`];
		g.ps[0].hTs = [...HBFTs, ...windTs];
		g.lTh = getWindTileMock(Wind.W, 9);

		const { HH } = getHands(g, 0, 111);
		const hDs = HH.pxs.map(p => p.hD);
		expect(hDs.includes(ScoringHand.HONOR)).toBeTruthy();
		expect(hDs.includes(ScoringHand.PONG)).toBeFalsy();
		expect(hDs.includes(`${ScoringHand.MELDED}-${CardName.we}`)).toBeFalsy();
		expect(hDs.length).toBe(1);
		expect(HH.maxPx).toBe(5);
	});

	it('mixed terminals/honours, pong, melded we', () => {
		const HBFTs = [DaPai.RED, DaPai.RED].map((i, index) => getHBFHashTileMock(111, i, index));
		const windTs = [Wind.E, Wind.E, Wind.E, Wind.W, Wind.W].map((i, index) => getWindHashTileMock(111, i, index));
		g.ps[0].ms = [`${MeldType.KANG}-1${Suit.TONG}`, `${MeldType.PONG}-1${Suit.SUO}`];
		g.ps[0].hTs = [...HBFTs, ...windTs];
		g.lTh = getWindTileMock(Wind.W, 9);

		const { HH } = getHands(g, 0, 111);
		const hDs = HH.pxs.map(p => p.hD);
		expect(hDs.includes(ScoringHand.MIXED_HONOURS_TERMS)).toBeTruthy();
		expect(hDs.includes(ScoringHand.PONG)).toBeTruthy();
		expect(hDs.includes(`${ScoringHand.MELDED}-${CardName.we}`)).toBeTruthy();
		expect(hDs.includes(ScoringHand.HONOR)).toBeFalsy();
		expect(hDs.includes(ScoringHand.TERMS)).toBeFalsy();
		expect(hDs.length).toBe(3);
		expect(HH.maxPx).toBe(6);
	});

	it('seven pairs', () => {
		const wanTiles = [1, 1, 9, 9].map((i, index) => getSuitedTileMock(Suit.WAN, i, index));
		const suoTiles = [1, 1, 9].map((i, index) => getSuitedTileMock(Suit.SUO, i, index));
		const daPaiTiles = [DaPai.RED, DaPai.RED, DaPai.GREEN, DaPai.GREEN, DaPai.WHITE, DaPai.WHITE].map((i, index) =>
			getHBFMock(i, index)
		);
		g.lTh = getSuitedTileMock(Suit.SUO, 9, 9);
		g.ps[0].lTa = {};
		g.f[3] = false;

		const { HH } = getHands(g, 0, 111, [...wanTiles, ...suoTiles, ...daPaiTiles]);
		const hDs = HH.pxs.map(p => p.hD);
		expect(hDs.includes(ScoringHand.SEVEN)).toBeTruthy();
		expect(hDs.length).toBe(1);
		expect(HH.maxPx).toBe(5);
	});

	it('lesser three, two pxs for cW and sW', () => {
		const daPaiTiles = [DaPai.RED, DaPai.RED, DaPai.RED, DaPai.GREEN, DaPai.GREEN, DaPai.GREEN, DaPai.WHITE].map(
			(i, index) => getHBFMock(i, index)
		);
		const windTiles = [Wind.E, Wind.E, Wind.E].map((card, index) => getWindTileMock(card, index));
		g.ps[0].ms = [`${MeldType.CHI}-2${Suit.SUO}`];
		g.lTh = getHBFMock(DaPai.WHITE, 9);

		const { HH } = getHands(g, 0, 111, [...daPaiTiles, ...windTiles]);
		const hDs = HH.pxs.map(p => p.hD);
		expect(hDs.includes(ScoringHand.H_SUITED)).toBeTruthy();
		expect(hDs.includes(ScoringHand.L_3)).toBeTruthy();
		expect(hDs.includes(`${ScoringHand.MELDED}-${CardName[Wind.E]}`)).toBeTruthy();
		expect(HH.pxs.find(ps => ps.hD === `${ScoringHand.MELDED}-${CardName[Wind.E]}`).px).toBe(2);
		expect(hDs.length).toBe(3);
		expect(HH.maxPx).toBe(7);
	});

	it('greater three w unmelded tiles', () => {
		const daPaiTiles = [
			DaPai.RED,
			DaPai.RED,
			DaPai.RED,
			DaPai.RED, // kang
			DaPai.GREEN,
			DaPai.GREEN,
			DaPai.GREEN,
			DaPai.WHITE,
			DaPai.WHITE
		].map((i, index) => getHBFMock(i, index));
		const wanTiles = [1, 2].map((i, index) => getSuitedTileMock(Suit.WAN, i, index));
		const suoTiles = [1].map((i, index) => getSuitedTileMock(Suit.SUO, i, index));
		g.lTh = getHBFMock(DaPai.WHITE, 9);

		const { HH } = getHands(g, 0, 111, [...daPaiTiles, ...wanTiles, ...suoTiles]);
		const hDs = HH.pxs.map(p => p.hD);
		expect(hDs.includes(ScoringHand.G_3)).toBeTruthy();
		expect(HH.maxPx).toBe(5);
	});

	it('green, pong fa', () => {
		const suoTiles = [2, 2, 2, 3, 3, 3, 4, 4, 4, 6].map((i, index) => getSuitedTileMock(Suit.SUO, i, index));
		const daPaiTiles = [DaPai.GREEN, DaPai.GREEN, DaPai.GREEN].map((i, index) => getHBFMock(i, index));
		g.lTh = getSuitedTileMock(Suit.SUO, 6, 6);

		const { HH } = getHands(g, 0, 111, [...suoTiles, ...daPaiTiles]);
		const hDs = HH.pxs.map(p => p.hD);
		expect(hDs.includes(ScoringHand.GREEN)).toBeTruthy();
		expect(HH.maxPx).toBe(5);
	});

	it('moon, 1 flower set, 1 animal, chi', () => {
		const suoTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i, index) => getSuitedTileMock(Suit.SUO, i, index));
		const wanTiles = [1, 2, 3, 4].map((i, index) => getSuitedTileMock(Suit.WAN, i, index));
		g.ps[0].sTs = [...[...FlowersS, Flower.FM].map(c => getFlowerMock(c)), getAnimalMock(Animal.ROOSTER)];
		g.ps[0].sTs[0].v = true; // manually assign valid flower
		g.ps[0].sTs[4].v = true;
		g.ps[0].lTa = getSuitedHashTileMock(111, Suit.WAN, 4, 4);
		g.ts = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
		g.f[3] = true;

		const { HH } = getHands(g, 0, 111, [...suoTiles, ...wanTiles]);
		const hDs = HH.pxs.map(p => p.hD);

		expect(hDs.includes(`${ScoringHand.FS}-3`)).toBeTruthy();
		expect(hDs.includes(ScoringHand.CFS)).toBeTruthy();
		expect(hDs.includes(ScoringHand.MOON)).toBeTruthy();
		expect(hDs.length).toBe(5);
		expect(HH.maxPx).toBe(7);
	});

	it('full animal set', () => {
		const suoTs = [2, 2, 2, 3, 3, 3, 5, 5, 5, 6].map((i, index) => getSuitedHashTileMock(111, Suit.SUO, i, index));
		const animalTs = [Animal.CAT, Animal.ROOSTER, Animal.MOUSE, Animal.WORM].map(a => getAnimalMock(a));
		const wanTs = [1, 2, 3].map(i => getSuitedHashTileMock(111, Suit.WAN, i));
		hasSelfDrawn(g, getSuitedHashTileMock(111, Suit.SUO, 6, 2));
		g.ps[0].hTs = suoTs;
		g.ps[0].sTs = [...wanTs, ...animalTs];
		g.ps[0].ms = [`${MeldType.CHI}-2${Suit.WAN}`];

		const { HH } = getHands(g, 0, 111);
		const hDs = HH.pxs.map(p => p.hD);
		expect(hDs.includes(ScoringHand.ANIMALS)).toBeTruthy();
		expect(HH.maxPx).toBe(5);
	});

	it('1 flower set + 1 animal', () => {
		const suoTs = [2, 2, 2, 3, 3, 3, 5, 5, 5, 6].map((i, index) => getSuitedHashTileMock(111, Suit.SUO, i, index));
		const animalTs = [Animal.CAT].map(a => getAnimalMock(a));
		const flowerTs = [Flower.FJ, Flower.FL, Flower.FM, Flower.FZ].map(f => getFlowerMock(f, f === Flower.FJ));
		const wanTs = [1, 2, 3].map(i => getSuitedHashTileMock(111, Suit.WAN, i));
		hasSelfDrawn(g, getSuitedHashTileMock(111, Suit.SUO, 6, 2));
		g.ps[0].hTs = suoTs;
		g.ps[0].sTs = [...wanTs, ...animalTs, ...flowerTs];
		g.ps[0].ms = [`${MeldType.CHI}-2${Suit.WAN}`];

		const { HH } = getHands(g, 0, 111);
		const hDs = HH.pxs.map(p => p.hD);
		expect(hDs.length).toBe(2);
		expect(hDs.includes(ScoringHand.CFS)).toBeTruthy();
		expect(hDs.includes(`${ScoringHand.FS}-2`)).toBeTruthy();
		expect(HH.maxPx).toBe(3);
	});

	it('8 flowers + 1 animal', () => {
		const suoTs = [2, 2, 2, 3, 3, 3, 5, 5, 5, 6].map((i, index) => getSuitedHashTileMock(111, Suit.SUO, i, index));
		const animalTs = [Animal.CAT].map(a => getAnimalMock(a));
		const flowerTs = [Flower.FJ, Flower.FL, Flower.FM, Flower.FZ, Flower.SC, Flower.SX, Flower.SQ, Flower.SD].map(
			f => getFlowerMock(f, f === Flower.FJ || f === Flower.SC)
		);
		const wanTs = [1, 2, 3].map(i => getSuitedHashTileMock(111, Suit.WAN, i));
		hasSelfDrawn(g, getSuitedHashTileMock(111, Suit.SUO, 6, 2));
		g.ps[0].hTs = suoTs;
		g.ps[0].sTs = [...wanTs, ...animalTs, ...flowerTs];
		g.ps[0].ms = [`${MeldType.CHI}-2${Suit.WAN}`];

		const { HH } = getHands(g, 0, 111);
		const hDs = HH.pxs.map(p => p.hD);
		expect(hDs.length).toBe(2);
		expect(hDs.includes(ScoringHand.FLOWERS)).toBeTruthy();
		expect(hDs.includes(`${ScoringHand.FS}-1`)).toBeTruthy();
		expect(HH.maxPx).toBe(6);
	});
});
