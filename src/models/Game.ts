import { getHands } from 'bot';
import {
	Animal,
	AnimalIndex,
	CardCategory,
	CardName,
	DaPaiIndex,
	Exec,
	FlowerIndex,
	LocalFlag,
	MeldType,
	PaymentType,
	PlayerFlower,
	Suit,
	SuitsIndex,
	TestUser,
	Wind,
	WindIndex
} from 'enums';
import {
	Animals,
	FlowersF,
	FlowersS,
	HBFCards,
	ScoringHand,
	Suits,
	Winds
} from 'handEnums';
import isEmpty from 'lodash.isempty';
import { User } from 'models';
import { isDev } from 'platform';
import { ControlsTextEng, ScreenTextChi, ScreenTextEng } from 'screenTexts';
import {
	countHashedCards,
	findLeft,
	findOpp,
	findRight,
	getCardName,
	getDefaultAmt,
	getHashed,
	getPlayerSeat,
	getTileHashKey,
	isBot,
	isHua,
	randomNum,
	revealTile,
	shuffle
} from 'utility';

export class Game {
	id: string;
	cO: string;
	pS: string; // player string
	es: string[];
	t: Date[];
	/**
	 * 0: created at
	 * 1: updated at
	 * 2: delay from
	 */
	f?: boolean[];
	/**
	 * 0: on, false when a game ends, true after first round of buhua. Flag for 咬到
	 * 1: pause, round has not started, i.e. first player has not thrown. set to true on discard
	 * 2: flag next round, trigger next round on 咬到 / kang
	 * 3: taken
	 * 4: thrown
	 * 5: draw, 15 tiles left
	 * 6: manual hu
	 * 7: taken by 抢杠
	 * 8: easy mode on (bot)
	 */
	n?: number[];
	/**
	 * 0: stage
	 * 1: previous round
	 * 2: dealer index
	 * 3: whose move, zero'th index
	 * 4: front tiles
	 * 5: back tiles
	 * 6: taken by
	 * 7: thrown by
	 * 8: min tai
	 * 9: max tai
	 * 10: bot timeout
	 * 11: increment by one on bu hua, set to 0 on discard
	 * 12: total number of rounds
	 */
	ps?: User[];
	ts?: IHiddenTile[];
	lTh?: IShownTile; // last thrown tile
	hu?: (string | number)[]; // which player, how many px, zimo, *description
	logs?: string[];
	sk?: string[]; // `${_p}${action}`[]
	prE?: IPreEnd;
	sHs?: ScoringHand[]; // EXCLUDING scoring hands
	pay?: PaymentType;
	dHTs?: number; // dealer hand tiles
	nDHTs?: number; // non -
	dTs?: number; // dealer tiles
	nDTs?: number; // non -

	constructor(
		id: string,
		cO?: string,
		pS?: string,
		es?: string[],
		t?: Date[],
		f?: boolean[],
		n?: number[],
		ps?: User[],
		ts?: IHiddenTile[],
		lTh?: IShownTile,
		hu?: (string | number)[],
		logs?: string[],
		sk?: string[],
		prE?: {},
		sHs = [],
		pay = PaymentType.SHOOTER
	) {
		this.id = id;
		this.cO = cO;
		this.pS = pS;
		this.es = es;
		this.t = t;
		this.f = f;
		this.n = n;
		this.ps = ps;
		this.ts = ts;
		this.lTh = lTh;
		this.hu = hu;
		this.logs = logs;
		this.sk = sk;
		this.prE = prE;
		this.sHs = sHs;
		this.pay = pay;
		// Constants
		this.dHTs = 38;
		this.nDHTs = 36;
		this.dTs = 14;
		this.nDTs = 13;
	}

	newLog(log: string) {
		if (log) {
			this.logs = [...this.logs, log];
			if (this.logs.length > 24) {
				this.logs = this.logs.slice(-10);
			}
		}
	}

	generateHiddenTiles(): IHiddenTile[] {
		let tiles: IHiddenTile[] = [];
		let tHK = this.id === LocalFlag ? 111 : getTileHashKey(this.id, this.n[0]);
		const oneToFour = [1, 2, 3, 4];
		const oneToNine = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		oneToFour.forEach(index => {
			Suits.forEach(suit => {
				oneToNine.forEach(number => {
					const tile: IHiddenTile = {
						i: getHashed(
							`${CardCategory.REGULAR}${SuitsIndex[suit]}${number}${suit}${index}`,
							tHK
						)
					};
					tiles.push(tile);
				});
			});
			Winds.forEach(c => {
				const tile: IHiddenTile = {
					i: getHashed(`${CardCategory.WINDS}${WindIndex[c]}${c}${index}`, tHK)
				};
				tiles.push(tile);
			});
			HBFCards.forEach(c => {
				const tile: IHiddenTile = {
					i: getHashed(`${CardCategory.HBF}${DaPaiIndex[c]}${c}${index}`, tHK)
				};
				tiles.push(tile);
			});
		});
		[...FlowersF, ...FlowersS].forEach(c => {
			const tile: IHiddenTile = {
				i: getHashed(
					`${CardCategory.FLOWER}${FlowerIndex[c]}${c}${randomNum(9)}`,
					tHK
				)
			};
			tiles.push(tile);
		});
		Animals.forEach(c => {
			let tile: IHiddenTile = {
				i: getHashed(
					`${CardCategory.ANIMAL}${AnimalIndex[c]}${c}${randomNum(9)}`,
					tHK
				)
			};
			tiles.push(tile);
		});
		return tiles;
	}

	// Pop/shift tile from deck and shortens front/back of deck if offsetUnused
	removeTileFromDeck(buHua = false, offsetUnused = true): IHiddenTile {
		let hiddenTile: IHiddenTile = null;
		if (buHua) {
			this.n[11] += 1;
			hiddenTile = this.ts.shift();
			if (offsetUnused) {
				const back = this.n[5] === -1 ? this.n[4] : this.n[5];
				if (this.ps[back].uTs === 1) {
					this.ps[back].uTs = 0;
					this.n[5] = findRight(back);
				} else {
					this.ps[back].uTs -= 1;
				}
			}
		}
		if (this.ps[this.n[5]]?.uTs < 8) {
			const back = this.n[5] === -1 ? this.n[4] : this.n[5];
			const toMove = this.ps[back]?.uTs;
			this.ps[back].uTs = 0;
			this.n[5] = findRight(back);
			this.ps[this.n[5]].uTs += toMove;
		}
		if (!buHua) {
			hiddenTile = this.ts.pop();
			if (offsetUnused) {
				const front = this.n[4];
				if (this.ps[front].uTs === 1) {
					this.ps[front].uTs = 0;
					this.n[4] = findLeft(front);
					if (this.n[4] === this.n[5]) {
						this.n[5] = -1;
					}
				} else {
					this.ps[front].uTs -= 1;
				}
			}
		}
		return hiddenTile;
	}

	getMatchingFlowersMsg(tile: IShownTile, _p: number) {
		switch (tile.s) {
			case Suit.ANIMAL:
				return (tile.c === Animal.CAT &&
					this.ps[_p].shownTilesContainCard(Animal.MOUSE)) ||
					(tile.c === Animal.MOUSE &&
						this.ps[_p].shownTilesContainCard(Animal.CAT)) ||
					(tile.c === Animal.ROOSTER &&
						this.ps[_p].shownTilesContainCard(Animal.WORM)) ||
					(tile.c === Animal.WORM &&
						this.ps[_p].shownTilesContainCard(Animal.ROOSTER))
					? `${this.ps[_p].uN} got matching animals`
					: '';
			case Suit.FLOWER:
				const matchingFs = PlayerFlower[_p];
				return (tile.c === matchingFs[0] &&
					this.ps[_p].shownTilesContainCard(matchingFs[1])) ||
					(tile.c === matchingFs[1] &&
						this.ps[_p].shownTilesContainCard(matchingFs[0]))
					? `${this.ps[_p].uN} got both his/her flowers`
					: '';
			default:
				return '';
		}
	}

	// Refer to when this fn is called, if the tile is already in shown/hidden tiles
	getCompletedFsSetMsg(tile: IShownTile, _p: number) {
		const { sTs = [], uN = '' } = this.ps[_p];
		switch (tile.s) {
			case Suit.ANIMAL:
				return sTs.filter(t => Animals.includes(t.c)).length === 3
					? `${uN} collected all animals`
					: '';
			case Suit.FLOWER:
				if (sTs.filter(t => t.s === Suit.FLOWER).length === 7) {
					return `${uN} collected all 8 flowers`;
				} else if (FlowersS.includes(tile.c)) {
					return sTs.filter(t => FlowersS.includes(t.c)).length === 3
						? `${uN} collected a flower set`
						: '';
				} else {
					return sTs.filter(t => FlowersF.includes(t.c)).length === 3
						? `${uN} collected a flower set`
						: '';
				}
			default:
				return '';
		}
	}

	sendChips(from: number, to: number, amt: number) {
		if (amt > 0) {
			this.ps[from].bal = Math.round(this.ps[from].bal - amt);
			this.ps[to].bal = Math.round(this.ps[to].bal + amt);
			this.newLog(
				`${this.ps[from].uN} sent ${this.ps[to].uN} ${amt} ${
					ScreenTextEng._CHIP_
				}${amt > 1 ? 's' : ''}`
			);
		}
	}

	/**
	 * Validates if a shownTile is a flower
	 * Side effects: shownTile.v = true if player's flower
	 * @returns {tile, tile.c, announcement if player got matching flowers}
	 */
	validateFlower(
		tile: IShownTile,
		_p: number
	): { tile: IShownTile; hua: string; msg: string[] } {
		let matchingFlowersMsg = '';
		let completedFsSetMsg = '';
		if (!isHua(tile)) {
			return { tile, hua: '', msg: [] };
		} else if (
			tile.s === Suit.ANIMAL ||
			(tile.s === Suit.FLOWER &&
				PlayerFlower[getPlayerSeat(_p, this.n[2])].includes(tile.c))
		) {
			tile.v = true;
		}
		if (isHua(tile)) {
			// getting msgs requires tile.v
			matchingFlowersMsg = this.getMatchingFlowersMsg(tile, _p);
			completedFsSetMsg = this.getCompletedFsSetMsg(tile, _p);
		}
		return { tile, hua: tile.c, msg: [matchingFlowersMsg, completedFsSetMsg] };
	}

	/**
	 * @description Calls validateFlower:
	 * If new tile is a flower, -> player.sTs. Else, draw ? player.getNewTile(tile) : -> player.hTs
	 */
	handleNewTile(hT: IHiddenTile, _p: number, draw: boolean) {
		const { tile, hua, msg } = this.validateFlower(
			revealTile(hT, getTileHashKey(this.id, this.n[0])),
			_p
		);
		if (hua) {
			this.ps[_p].sTs = [...this.ps[_p].sTs, tile];
		} else {
			draw
				? this.ps[_p].getNewTile(hT)
				: (this.ps[_p].hTs = [...this.ps[_p].hTs, hT]);
		}
		return { hua, msg };
	}

	giveT(
		n: number,
		_p: number,
		buHua?: boolean,
		offsetUnused?: boolean,
		draw = false
	): { drewHua: boolean; tile: IHiddenTile } {
		let p = this.ps[_p];
		let tile: IHiddenTile;
		let drewHua: boolean = false;
		let log = `${p.uN} ${buHua ? `bu hua, ` : ``}received `;
		let fsAnn: string[] = [];
		let fR = '';
		let fsR = ' +';
		for (let i: number = 0; i < n; i++) {
			tile = this.removeTileFromDeck(buHua, offsetUnused);
			const { hua, msg } = this.handleNewTile(tile, _p, draw);
			fsAnn = [...fsAnn, ...msg.filter(m => m)];
			if (hua) {
				fR = CardName[hua];
				fsR += `${drewHua ? `,` : ``} ${fR}`;
				drewHua = true;
			}
		}
		if (n === 1 && drewHua) {
			log += fR;
		} else {
			log += `${n} tile${n === 1 ? `` : `s`}${drewHua ? fsR : ``}`;
		}
		this.newLog(log);
		fsAnn.forEach(a => this.newLog(a));
		if (fsAnn.find(m => m)) {
			this.f[2] = true;
			const amt = fsAnn.filter(m => m).length;
			[findRight(_p), findOpp(_p), findLeft(_p)].forEach(from =>
				this.sendChips(from, _p, amt * (this.f[0] ? 1 : 2))
			);
		}
		return { drewHua, tile };
	}

	distributeTiles() {
		let d = this.ps[this.n[2]];
		let lP = this.ps[findLeft(this.n[2])];
		let rP = this.ps[findRight(this.n[2])];
		let oP = this.ps[findOpp(this.n[2])];
		let dTs: number;
		let lTs: number;
		let rTs: number;
		let oTs: number;
		let initTs = this.dTs + 3 * this.nDTs;
		let rolled = d.rollDice();
		this.newLog(`${d.uN} rolled: ${rolled}`);

		// Set front and back, and how many unused tiles each dealer has
		switch (rolled % 4) {
			case 0: // deal from left
				this.newLog(`Distributing from ${this.ps[findLeft(this.n[2])].uN}`);
				this.n[5] = findLeft(this.n[2]);
				lTs = this.nDHTs - 2 * rolled;
				lP.uTs = 2 * rolled;
				oTs = initTs - lTs;
				if (oTs > this.dHTs) {
					oP.uTs = 0;
					rTs = oTs - this.dHTs;
					rP.uTs = this.nDHTs - rTs;
					this.n[4] = findRight(this.n[2]);
				} else {
					oP.uTs = this.dHTs - oTs;
					rP.uTs = this.nDHTs;
					this.n[4] = findOpp(this.n[2]);
				}
				d.uTs = this.dHTs;
				break;
			case 1: // deal from dealer
				this.newLog(`Distributing from ${this.ps[this.n[2]].uN}`);
				this.n[5] = this.n[2];
				dTs = this.dHTs - 2 * rolled;
				d.uTs = 2 * rolled;
				lTs = initTs - dTs;
				if (lTs > this.nDHTs) {
					lP.uTs = 0;
					oTs = lTs - this.nDHTs;
					oP.uTs = this.dHTs - oTs;
					this.n[4] = findOpp(this.n[2]);
				} else {
					lP.uTs = this.nDHTs - lTs;
					oP.uTs = this.dHTs;
					this.n[4] = findLeft(this.n[2]);
				}
				rP.uTs = this.nDHTs;
				break;
			case 2: // deal from right
				this.newLog(`Distributing from ${this.ps[findRight(this.n[2])].uN}`);
				this.n[5] = findRight(this.n[2]);
				rTs = this.nDHTs - 2 * rolled;
				rP.uTs = 2 * rolled;
				dTs = initTs - rTs;
				if (dTs > this.dHTs) {
					d.uTs = 0;
					lTs = dTs - this.dHTs;
					lP.uTs = this.nDHTs - lTs;
					this.n[4] = findLeft(this.n[2]);
				} else {
					d.uTs = this.dHTs - dTs;
					lP.uTs = this.nDHTs;
					this.n[4] = this.n[2];
				}
				oP.uTs = this.dHTs;
				break;
			case 3: // deal from opposite
				this.newLog(`Distributing from ${this.ps[findOpp(this.n[2])].uN}`);
				this.n[5] = findOpp(this.n[2]);
				oP.uTs = 2 * rolled;
				oTs = this.dHTs - 2 * rolled;
				rTs = initTs - oTs;
				if (rTs > this.nDHTs) {
					rP.uTs = 0;
					dTs = rTs - this.nDHTs;
					d.uTs = this.dHTs - dTs;
					this.n[4] = this.n[2];
				} else {
					rP.uTs = this.nDHTs - rTs;
					d.uTs = this.dHTs;
					this.n[4] = findRight(this.n[2]);
				}
				lP.uTs = this.nDHTs;
				break;
		}
		this.giveT(this.dTs, this.n[2], false, false);
		this.giveT(this.nDTs, findRight(this.n[2]), false, false);
		this.giveT(this.nDTs, findOpp(this.n[2]), false, false);
		this.giveT(this.nDTs, findLeft(this.n[2]), false, false);
		let r = 0;
		const sumAllHiddenTiles = this.ps
			.map(p => p.countAllHiddenTiles())
			.reduce((a, b) => a + b, 0);
		if (sumAllHiddenTiles === this.dTs + 3 * this.nDTs) {
			this.f[0] = true;
		} else {
			while (
				this.ps[this.n[2]].countAllHiddenTiles() < this.dTs ||
				this.ps[findRight(this.n[2])].countAllHiddenTiles() < this.nDTs ||
				this.ps[findOpp(this.n[2])].countAllHiddenTiles() < this.nDTs ||
				this.ps[findLeft(this.n[2])].countAllHiddenTiles() < this.nDTs
			) {
				if (r === 0) {
					this.f[0] = true;
				}
				this.buHua();
				r++;
			}
		}
		this.ps.forEach((player: User) => {
			player.setHiddenTiles();
			player.sortShownTiles();
		});
	}

	buHua() {
		if (this.ps[this.n[2]].countAllHiddenTiles() < this.dTs) {
			this.giveT(
				this.dTs - this.ps[this.n[2]].countAllHiddenTiles(),
				this.n[2],
				true,
				true
			);
		}
		let others: number[] = [
			findRight(this.n[2]),
			findOpp(this.n[2]),
			findLeft(this.n[2])
		];
		others.forEach((n: number) => {
			let initNum = this.ps[n].countAllHiddenTiles();
			if (initNum < this.nDTs) {
				this.giveT(this.nDTs - initNum, n, true, true);
			}
		});
	}

	nextPlayerMove() {
		this.n[3] = findRight(this.n[3]);
		this.f[3] = false;
		this.f[4] = false;
		// this.newLog(`${this.ps[this.n[3]].uN}'s turn`);
	}

	currentWind(): Wind {
		if (this.n[0] <= 4) {
			return Wind.E;
		} else if (this.n[0] <= 8) {
			return Wind.S;
		} else if (this.n[0] <= 12) {
			return Wind.W;
		} else if (this.n[0] <= 16) {
			return Wind.N;
		} else {
			return Wind.E;
		}
	}

	async prepForNewRound(newGame = false) {
		this.n[1] = newGame ? -1 : this.n[0];
		if (!newGame && this.f[2]) {
			this.n[0] += 1;
			this.n[2] = (this.n[0] + 3) % 4;
		}
		if (isDev && this.ps.find(p => p.uN === TestUser._LASTROUND)) {
			this.n[0] = 16;
			this.n[2] = 3;
		}
		this.ps.forEach(player => {
			player.prepForNewRound();
		});
		this.ts = [];
		this.t[1] = new Date();
		this.t[2] = null;
		this.f[0] = false;
		this.f[2] = false;
		this.f[3] = true;
		this.f[4] = false;
		this.f[5] = false;
		this.n[3] = this.n[2];
		this.n[4] = 0;
		this.n[5] = 0;
		this.n[7] = 0;
		this.n[6] = this.n[2];
		this.n[12] += 1; // add to count of rounds
		this.lTh = {};
		this.hu = [];
		this.logs = [];
		this.sk = [];
		this.prE = {};
		this.newLog(
			`Starting round ${this.n[0]} ${
				this.n[1] === this.n[0] ? ControlsTextEng.CHAIN : ``
			}`
		);
	}

	initRound() {
		let hiddenTiles = this.generateHiddenTiles();
		let shuffledTiles = shuffle(hiddenTiles);
		for (let i = 0; i < shuffledTiles.length; i++) {
			shuffledTiles[i].r = i;
		}
		this.f[1] = true;
		this.ts = shuffledTiles;
		this.distributeTiles();
		// this._19TilesLeft()
		// this.huaShangHua()
		// this.kangShangHua()
	}

	declareHu(huVals: any[]) {
		isDev && console.info('declareHu called with: ' + JSON.stringify(huVals));
		if (huVals.length > 2) {
			this.f[2] = Number(huVals[0]) !== this.n[2];
			this.hu = huVals;
			let huLog: string = `${this.ps[huVals[0]].uN} hu with ${huVals[1]}${
				ScreenTextChi.TAI
			}`;
			if (huVals[2] === 1) {
				huLog += ` ${ScreenTextEng.SELF_DRAWN}`;
			} else if (this.n[7] && this.ps[this.n[7]].uN !== this.ps[huVals[0]].uN) {
				huLog += `, last tile thrown by ${this.ps[this.n[7]].uN}`;
			}
			this.newLog(huLog);
			const w = Number(this.hu[0]);
			[findRight(w), findOpp(w), findLeft(w)].forEach(_p => {
				if (isBot(this.ps[_p].id)) {
					this.ps[_p].sT = true;
					this.sendChips(
						_p,
						w,
						getDefaultAmt(this.hu, this.pay, _p, this.n[7])
					);
				}
			});
		}
	}

	endRound() {
		this.prE = {
			fN: this.f[2],
			st: this.n[0],
			pr: this.n[1],
			_d: this.n[2]
		};
		if (this.n[0] === 16 && this.f[2]) {
			this.f[0] = false;
			this.n[2] = 9;
			this.newLog('Game ended');
		}
	}

	undoEndRound() {
		this.f[2] = this.prE.fN;
		this.n[0] = this.prE.st;
		this.n[1] = this.prE.pr;
		this.n[2] = this.prE._d;
		this.prE = {};
		this.logs = this.logs.filter(
			l =>
				!l.includes('hu with') &&
				!l.includes('Game ended') &&
				!l.includes('Round ended')
		);
	}

	tileThrown(tile: IShownTile, player: number) {
		this.lTh = tile;
		this.f[4] = true;
		this.n[7] = player;
		this.n[11] = 0;
		this.sk = [];
		this.newLog(`${this.ps[player].uN} discarded ${getCardName(tile.c)}`);
	}

	/* ----------------------------------- Util ----------------------------------- */
	repr(): any[] {
		let res: any[];
		if (this.n[0] <= 4) {
			res = [CardName[Wind.E], this.n[0]];
		} else if (this.n[0] <= 8) {
			res = [CardName[Wind.S], ((this.n[0] - 1) % 4) + 1];
		} else if (this.n[0] <= 12) {
			res = [CardName[Wind.W], ((this.n[0] - 1) % 8) + 1];
		} else if (this.n[0] <= 16) {
			res = [CardName[Wind.N], ((this.n[0] - 1) % 12) + 1];
		}
		// if (this.n[0] === this.n[1]) {
		// 	res.push([ControlsTextEng.CHAIN]);
		// }
		return res;
	}

	shownTsRef(): number[] {
		return this.ps.map(p => [...p.sTs.map(t => t.r), ...p.dTs.map(t => t.r)]).flat();
	}

	psOpenRef(): string {
		let r = '';
		this.ps.forEach(p => {
			r += p.cfH ? '1' : '0';
		});
		return r;
	}

	/**
	 * @description iterate twice through players after thB to find
	 * 1) players who can hu
	 * 2) players who can pong
	 * @effect sk = [`<A can hu first>hu`, `<B can hu next>hu`, `<A can hu pong>pong`, `<C can pong next>pong`]
	 */
	handleDelay() {
		if (!isEmpty(this.lTh)) {
			isDev && console.info('-> Game.handleDelay()');
			this.sk = [];
			const tHK = getTileHashKey(this.id, this.n[0]);
			const hashCard = getHashed(this.lTh.c, tHK);
			const next = [findRight(this.n[7]), findOpp(this.n[7]), findLeft(this.n[7])];
			// First loop, to find hu
			for (let _n = 0; _n < 3; _n++) {
				const _p = next[_n];
				if (_p !== this.n[7]) {
					if (!isEmpty(this.ps[_p])) {
						const { HH } = getHands(
							this,
							_p,
							this.id === LocalFlag ? 111 : tHK
						);
						if (!isEmpty(HH)) {
							const huExec = `${_p}${Exec.HU}`;
							if (!this.sk.find(s => s === huExec)) {
								this.sk.push(huExec);
							}
							this.t[2] = new Date();
						}
					}
				}
			}
			// Second loop, to find pong/kang
			for (let _n = 0; _n < 3; _n++) {
				const n = next[_n];
				const c = countHashedCards(
					hashCard,
					this.ps[n]?.hTs?.map(t => t.i)
				);
				const pongExec = `${n}${MeldType.PONG}`;
				const kangExec = `${n}${MeldType.KANG}`;
				if (c > 1 && !this.sk.find(s => s === pongExec || s === kangExec)) {
					if (c === 3) {
						this.sk.push(kangExec);
					}
					this.sk.push(pongExec);
					this.t[2] = new Date();
				}
			}
		}
	}

	handleKangPayment(_p: number, toKang: IShownTile[]) {
		const _from = [findRight(_p), findOpp(_p), findLeft(_p)];
		if (toKang.length === 1) {
			// non-hidden kang
			_from.forEach(from => this.sendChips(from, _p, 1));
		} else if (toKang.length === 4) {
			// hidden kang by taking from thrown
			if (!!toKang.find(t => t.r === this.lTh.r)) {
				if (this.pay === PaymentType.SHOOTER) {
					this.sendChips(this.n[7], _p, 3);
				}
				if (this.pay === PaymentType.HALF_SHOOTER) {
					_from.forEach(from =>
						this.sendChips(from, _p, from === this.n[7] ? 2 : 1)
					);
				}
			} else {
				// hidden kang by self draw
				_from.forEach(from => this.sendChips(from, _p, 2));
			}
		}
	}

	/* ------------------------------ Dev ------------------------------*/

	// _19TilesLeft() {
	// 	this.ts = this.ts.slice(0, 19);
	// }

	// huaShangHua() {
	// 	this.ps[0].hTs = [
	// 		...[1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9].map((n, index) =>
	// 			getSuitedHashTileMock(
	// 				getTileHashKey(this.id, this.n[0]),
	// 				Suit.TONG,
	// 				n,
	// 				index
	// 			)
	// 		),
	// 		...[1, 9].map((n, index) =>
	// 			getSuitedHashTileMock(
	// 				getTileHashKey(this.id, this.n[0]),
	// 				Suit.SUO,
	// 				n,
	// 				index
	// 			)
	// 		)
	// 	];
	// 	this.ts = this.ts.slice(0, 25);
	// 	this.ts[21] = getAnimalHashTileMock(111, Animal.ROOSTER);
	// 	this.ts[1] = getSuitedHashTileMock(
	// 		getTileHashKey(this.id, this.n[0]),
	// 		Suit.SUO,
	// 		1
	// 	);
	// 	this.ts[0] = getAnimalHashTileMock(111, Animal.CAT);
	// }

	// kangShangHua() {
	// 	this.ps[0].hTs = [
	// 		...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, index) =>
	// 			getSuitedHashTileMock(
	// 				getTileHashKey(this.id, this.n[0]),
	// 				Suit.TONG,
	// 				n,
	// 				index
	// 			)
	// 		),
	// 		...[1, 9].map((n, index) =>
	// 			getSuitedHashTileMock(
	// 				getTileHashKey(this.id, this.n[0]),
	// 				Suit.SUO,
	// 				n,
	// 				index
	// 			)
	// 		)
	// 	];
	// 	this.ps[0].sTs = [DaPai.RED, DaPai.RED, DaPai.RED].map((p, index) =>
	// 		getHBFMock(p, index)
	// 	);
	// 	this.ps[0].ms = [`${MeldType.PONG}-${DaPai.RED}`];
	// 	this.ts = this.ts.slice(0, 25);
	// 	this.ts[21] = getHBFMock(DaPai.RED, 9);
	// 	this.ts[1] = getSuitedHashTileMock(
	// 		getTileHashKey(this.id, this.n[0]),
	// 		Suit.SUO,
	// 		1
	// 	);
	// 	this.ts[0] = getAnimalHashTileMock(111, Animal.CAT);
	// }
}
