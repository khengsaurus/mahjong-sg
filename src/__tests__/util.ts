import { LocalFlag, MeldType, Suit } from 'enums';
import { Game, User } from 'models';
import { getSuitedTileMock } from 'utility';

export function hasNotDrawn(g: Game, lTh: IShownTile) {
	g.lTh = lTh;
	g.f[3] = false;
	g.ps[0].lTa = {};
}
export function hasSelfDrawn(g, lTa: IHiddenTile) {
	g.f[3] = true;
	g.ps[0].lTa = lTa;
}

export function hasMelded_2S_3S(g: Game, flowers: IShownTile[] = []) {
	g.ps[0].sTs = [
		...[1, 2, 3, 2, 3, 4].map((i, index) => getSuitedTileMock(Suit.SUO, i, index)),
		...flowers
	];
	g.ps[0].ms = [`${MeldType.CHI}-2${Suit.SUO}`, `${MeldType.CHI}-3${Suit.SUO}`];
}

export function hasMelded_2S_3S_2W(g: Game) {
	const suoTs = [1, 2, 3, 2, 3, 4].map((i, index) =>
		getSuitedTileMock(Suit.SUO, i, index)
	);
	const wanTs = [1, 2, 3].map((i, index) => getSuitedTileMock(Suit.WAN, i, index));
	g.ps[0].sTs = [...suoTs, ...wanTs];
	g.ps[0].ms = [
		`${MeldType.CHI}-2${Suit.SUO}`,
		`${MeldType.CHI}-3${Suit.SUO}`,
		`${MeldType.CHI}-2${Suit.WAN}`
	];
}

export function hasMelded_2S_3S_2W_3W(g: Game) {
	const suoTs = [1, 2, 3, 2, 3, 4].map((i, index) =>
		getSuitedTileMock(Suit.SUO, i, index)
	);
	const wanTs = [1, 2, 3, 2, 3, 4].map((i, index) =>
		getSuitedTileMock(Suit.WAN, i, index)
	);
	g.ps[0].sTs = [...suoTs, ...wanTs];
	g.ps[0].ms = [
		`${MeldType.CHI}-2${Suit.SUO}`,
		`${MeldType.CHI}-3${Suit.SUO}`,
		`${MeldType.CHI}-2${Suit.WAN}`,
		`${MeldType.CHI}-3${Suit.WAN}`
	];
}

export function resetPlayer(ps: User[]) {
	ps.forEach(p => {
		p.hTs = [];
		p.ms = [];
		p.sTs = [];
		p.ms = [];
	});
}

export function resetGame(g: Game, ps: User[]) {
	g.id = LocalFlag;
	g.f = [true, true, false, false, false, true, false, false];
	g.n = [1, 0, 0, 0, 1, 2, 0, 0, 1, 5];
	g.lTh = {};
	g.ps = ps;
	g.t = [];
	g.ts = [];
	g.sHs = [];
}

export function meldedLastThrown(g: Game, lTh: IShownTile, _p = 0) {
	g.lTh = { r: lTh.r }; // taken lTh tile
	g.ps[_p].sTs = [...g.ps[_p].sTs, lTh];
	g.ps[_p].lTa = {}; // not self drawn
	g.f[3] = true; // taken
}
