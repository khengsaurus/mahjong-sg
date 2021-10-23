import { isEmpty } from 'lodash';
import {
	AnimalIndex,
	Animals,
	CardCategories,
	DaPai,
	DaPaiIndex,
	FlowerIndex,
	Flowers,
	PlayerFlowers,
	Suits,
	SuitsIndex,
	WindIndex,
	Winds
} from 'shared/enums';
import { User } from 'shared/models2';
import {
	findLeft,
	findOpp,
	findRight,
	findTwo,
	getTileHashKey,
	hashTileString,
	isHua,
	randomNum,
	revealTile,
	shuffle
} from 'shared/util';
export class Game {
	id: string;
	cro: string;
	crA: Date;
	up: Date;
	dFr: Date;
	pS?: string;
	es?: string[];
	on?: boolean;
	st?: number;
	prev?: number;
	mid?: boolean;
	fN?: boolean;
	dealer?: number;
	wM?: number;
	ps?: User[];
	tiles?: IHiddenTile[];
	front?: number;
	back?: number;
	lastT?: IShownTile;
	tBy?: number;
	thrown?: boolean;
	taken?: boolean;
	takenB?: number;
	hu?: number[];
	draw?: boolean;
	logs?: ILog[];
	// Constants
	dHTs?: number;
	nDHTs?: number;
	dTs?: number;
	nDTs?: number;

	constructor(
		id: string,
		cro?: string,
		crA?: Date,
		pS?: string,
		es?: string[],
		on?: boolean,
		up?: Date,
		dFr?: Date,
		st?: number,
		prev?: number,
		dealer?: number,
		mid?: boolean,
		fN?: boolean,
		wM?: number,
		ps?: User[],
		tiles?: IHiddenTile[],
		front?: number,
		back?: number,
		lastT?: IShownTile,
		tBy?: number,
		thrown?: boolean,
		taken?: boolean,
		takenB?: number,
		hu?: number[],
		draw?: boolean,
		logs?: ILog[]
	) {
		this.id = id;
		this.cro = cro;
		this.crA = crA;
		this.pS = pS;
		this.es = es;
		this.on = on;
		this.up = up;
		this.dFr = dFr;
		this.st = st;
		this.prev = prev;
		this.dealer = dealer;
		this.mid = mid;
		this.fN = fN;
		this.wM = wM;
		this.ps = ps;
		this.tiles = tiles;
		this.front = front;
		this.back = back;
		this.lastT = lastT;
		this.tBy = tBy;
		this.thrown = thrown;
		this.taken = taken;
		this.takenB = takenB;
		this.hu = hu;
		this.draw = draw;
		this.logs = logs;
		// Constants
		this.dHTs = 38;
		this.nDHTs = 36;
		this.dTs = 14;
		this.nDTs = 13;
	}

	/*---------------------------------------- Actions ----------------------------------------*/
	findPlayerIndexByUsername(Username: string) {
		for (var n in [0, 1, 2, 3]) {
			if (this.ps[n].uN === Username) {
				return n;
			}
			return -1;
		}
	}

	// execute(event: IAction) {
	// 	const { uN, action, huStatus, tile, sentToUsername, amount } = event;
	// 	switch (action) {
	// 		case Actions.TAKE:
	// 			return;
	// 		case Actions.DRAW:
	// 			return;
	// 		case Actions.RETURN:
	// 			return;
	// 		case Actions.KANG:
	// 			return;
	// 		case Actions.THROW:
	// 			this.nextPlayerMove();
	// 			break;
	// 		case Actions.SHOW:
	// 			return;
	// 		case Actions.HIDE:
	// 			return;
	// 		case Actions.HU:
	// 			return;
	// 		case Actions.START:
	// 			return;
	// 		case Actions.END:
	// 			this.hu = huStatus;
	// 			this.endRound();
	// 			break;
	// 		default:
	// 			return;
	// 	}
	// }
	/*---------------------------------------- End actions ----------------------------------------*/

	newLog(log: string) {
		let newLog = { msg: log, timestamp: new Date() };
		this.logs = [...this.logs, newLog];
		if (this.logs.length >= 50) {
			this.logs = this.logs.slice(-15);
		}
	}

	generateHiddenTiles(): IHiddenTile[] {
		let tiles: IHiddenTile[] = [];
		let tileHashKey = getTileHashKey(this.id, this.st);
		const oneToFour = [1, 2, 3, 4];
		const oneToNine = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		const suits = [Suits.WAN, Suits.TONG, Suits.SUO];
		const winds = [Winds.E, Winds.S, Winds.W, Winds.N];
		const daPai = [DaPai.RED, DaPai.WHITE, DaPai.GREEN];
		const animals = [Animals.CAT, Animals.MOUSE, Animals.ROOSTER, Animals.WORM];
		const flowers = [
			Flowers.R1,
			Flowers.R2,
			Flowers.R3,
			Flowers.R4,
			Flowers.B1,
			Flowers.B2,
			Flowers.B3,
			Flowers.B4
		];
		oneToFour.forEach(index => {
			suits.forEach(suit => {
				oneToNine.forEach(number => {
					let tile: IHiddenTile = {
						id: hashTileString(
							`${CardCategories.REGULAR}${SuitsIndex[suit]}${number}${suit}${index}`,
							tileHashKey
						),
						ix: 0
					};
					tiles.push(tile);
				});
			});
			winds.forEach(pai => {
				let tile: IHiddenTile = {
					id: hashTileString(
						`${CardCategories.WINDS}${WindIndex[pai]}${pai}${index}${randomNum(9)}`,
						tileHashKey
					),
					ix: 0
				};
				tiles.push(tile);
			});
			daPai.forEach(pai => {
				let tile: IHiddenTile = {
					id: hashTileString(
						`${CardCategories.HBF}${DaPaiIndex[pai]}${pai}${index}${randomNum(9)}`,
						tileHashKey
					),
					ix: 0
				};
				tiles.push(tile);
			});
		});
		flowers.forEach(flower => {
			let tile: IHiddenTile = {
				id: hashTileString(
					`${CardCategories.FLOWER}${FlowerIndex[flower]}${flower}${randomNum(9)}`,
					tileHashKey
				),
				ix: 0
			};
			tiles.push(tile);
		});
		animals.forEach(animal => {
			let tile: IHiddenTile = {
				id: hashTileString(
					`${CardCategories.ANIMAL}${AnimalIndex[animal]}${animal}${randomNum(9)}${randomNum(9)}`,
					tileHashKey
				),
				ix: 0
			};
			tiles.push(tile);
		});
		this.newLog(`Generated ${tiles.length} tiles`);
		return tiles;
	}

	// Pop/shift tile from deck and shortens front/back of deck if offsetUnused
	removeTileFromDeck(buHua = false, offsetUnused = true): IHiddenTile {
		let hiddenTile: IHiddenTile;
		if (buHua) {
			hiddenTile = this.tiles.shift();
			if (offsetUnused) {
				if (this.ps[this.back].uTs === 1) {
					this.ps[this.back].uTs = 0;
					this.back = findRight(this.back);
				} else {
					this.ps[this.back].uTs -= 1;
				}
			}
		} else {
			hiddenTile = this.tiles.pop();
			if (offsetUnused) {
				if (this.ps[this.front].uTs === 1) {
					this.ps[this.front].uTs = 0;
					this.front = findLeft(this.front);
				} else {
					this.ps[this.front].uTs -= 1;
				}
			}
		}
		return hiddenTile;
	}

	getMatchingFlowersMsg(tile: IShownTile, playerIndex: number) {
		switch (tile.suit) {
			case Suits.ANIMAL:
				return (tile.card === Animals.CAT && this.ps[playerIndex].shownTilesContainCard(Animals.MOUSE)) ||
					(tile.card === Animals.MOUSE && this.ps[playerIndex].shownTilesContainCard(Animals.CAT)) ||
					(tile.card === Animals.ROOSTER && this.ps[playerIndex].shownTilesContainCard(Animals.WORM)) ||
					(tile.card === Animals.WORM && this.ps[playerIndex].shownTilesContainCard(Animals.ROOSTER))
					? `${this.ps[playerIndex].uN} drew matching animals`
					: '';
			case Suits.FLOWER:
				return this.ps[playerIndex].shownTilesContainCard(PlayerFlowers[playerIndex][0]) &&
					this.ps[playerIndex].shownTilesContainCard(PlayerFlowers[playerIndex][1])
					? `${this.ps[playerIndex].uN} drew both his/her flowers`
					: '';
			default:
				return '';
		}
	}

	/**
	 * Validates if a shownTile is a flower
	 * Side effects: shownTile.v = true if player's flower
	 * @returns: {tile, tile.card, announcement if player drew matching flowers}
	 */
	validateFlower(tile: IShownTile, playerIndex: number): { tile: IShownTile; hua: string; msg: string } {
		let msg = '';
		if (!isHua(tile)) {
			return { tile, hua: '', msg };
		} else if (
			tile.suit === Suits.ANIMAL ||
			(tile.suit === Suits.FLOWER && PlayerFlowers[playerIndex].includes(tile.card))
		) {
			tile.v = true;
		}
		if (isHua(tile)) {
			msg = this.getMatchingFlowersMsg(tile, playerIndex);
			if (msg !== '') {
				this.fN = true;
			}
		}
		return { tile, hua: tile.card, msg };
	}

	/**
	 * Side effects: calls validateFlower
	 * If new tile is a flower, -> player.sTs
	 * Else, draw ? player.getNewTile(tile) : -> player.hTs
	 */
	handleNewTile(tile: IHiddenTile, playerIndex: number, draw: boolean) {
		let tileHashKey = getTileHashKey(this.id, this.st);
		let revealedTile = revealTile(tile, tileHashKey);
		const { tile: valTile, hua, msg } = this.validateFlower(revealedTile, playerIndex);
		if (hua !== '') {
			this.ps[playerIndex].sTs = [...this.ps[playerIndex].sTs, valTile];
		} else {
			draw
				? this.ps[playerIndex].getNewTile(tile)
				: (this.ps[playerIndex].hTs = [...this.ps[playerIndex].hTs, tile]);
		}
		return { hua, msg };
	}

	giveTiles(
		n: number,
		playerIndex: number,
		buHua?: boolean,
		offsetUnused?: boolean,
		draw = false
	): { drewHua: boolean; tile: IHiddenTile } {
		let player = this.ps[playerIndex];
		let hiddenTile: IHiddenTile;
		let receivedFlower: boolean = false;
		let log = `${player.uN} ${buHua ? `bu hua, ` : ``} received `;
		let announcements: string[] = [];
		let flowerReceived = '';
		let flowersReceived = ', including';
		player.hTs = player.hTs || [];
		for (let i: number = 0; i < n; i++) {
			hiddenTile = null;
			hiddenTile = this.removeTileFromDeck(buHua, offsetUnused);
			const { hua, msg } = this.handleNewTile(hiddenTile, playerIndex, draw);
			announcements = msg !== '' ? [...announcements, msg] : announcements;
			if (hua !== '') {
				flowerReceived = hua;
				flowersReceived += `${receivedFlower ? `,` : ``} ${hua}`;
				receivedFlower = true;
			}
		}
		if (n === 1 && receivedFlower) {
			log += flowerReceived;
		} else {
			log += `${n} tile${n === 1 ? `` : `s`}${receivedFlower ? flowersReceived : ``}`;
		}
		this.newLog(log);
		announcements.forEach(announce => announce !== '' && this.newLog(announce));
		return { drewHua: receivedFlower, tile: hiddenTile };
	}

	//TODO: optimise
	distributeTiles() {
		this.newLog('Distributing tiles');
		let dealer = this.ps[this.dealer];
		let leftPlayer = this.ps[findLeft(this.dealer)];
		let rightPlayer = this.ps[findRight(this.dealer)];
		let oppPlayer = this.ps[findOpp(this.dealer)];
		let toBeDealtByDealer: number;
		let toBeDealtByLeft: number;
		let toBeDealtByRight: number;
		let toBeDealtByOpp: number;
		let initDealtTiles = this.dTs + 3 * this.nDTs;
		let rolled = dealer.rollDice();
		this.newLog(`${dealer.uN} rolled: ${rolled}`);

		// Set front and back, and how many unused tiles each dealer has
		switch (rolled % 4) {
			case 0: // deal from left
				this.newLog(`Dealing from ${this.ps[findLeft(this.dealer)].uN}`);
				this.back = findLeft(this.dealer);
				toBeDealtByLeft = this.nDHTs - 2 * rolled;
				leftPlayer.uTs = 2 * rolled;
				toBeDealtByOpp = initDealtTiles - toBeDealtByLeft;
				if (toBeDealtByOpp > this.dHTs) {
					oppPlayer.uTs = 0;
					toBeDealtByRight = toBeDealtByOpp - this.dHTs;
					rightPlayer.uTs = this.nDHTs - toBeDealtByRight;
					this.front = findRight(this.dealer);
				} else {
					oppPlayer.uTs = this.dHTs - toBeDealtByOpp;
					rightPlayer.uTs = this.nDHTs;
					this.front = findOpp(this.dealer);
				}
				dealer.uTs = this.dHTs;
				break;
			case 1: // deal from dealer
				this.newLog(`Dealing from ${this.ps[this.dealer].uN}`);
				this.back = this.dealer;
				toBeDealtByDealer = this.dHTs - 2 * rolled;
				dealer.uTs = 2 * rolled;
				toBeDealtByLeft = initDealtTiles - toBeDealtByDealer;
				if (toBeDealtByLeft > this.nDHTs) {
					leftPlayer.uTs = 0;
					toBeDealtByOpp = toBeDealtByLeft - this.nDHTs;
					oppPlayer.uTs = this.dHTs - toBeDealtByOpp;
					this.front = findOpp(this.dealer);
				} else {
					leftPlayer.uTs = this.nDHTs - toBeDealtByLeft;
					oppPlayer.uTs = this.dHTs;
					this.front = findLeft(this.dealer);
				}
				rightPlayer.uTs = this.nDHTs;
				break;
			case 2: // deal from right
				this.newLog(`Dealing from ${this.ps[findRight(this.dealer)].uN}`);
				this.back = findRight(this.dealer);
				toBeDealtByRight = this.nDHTs - 2 * rolled;
				rightPlayer.uTs = 2 * rolled;
				toBeDealtByDealer = initDealtTiles - toBeDealtByRight;
				if (toBeDealtByDealer > this.dHTs) {
					dealer.uTs = 0;
					toBeDealtByLeft = toBeDealtByDealer - this.dHTs;
					leftPlayer.uTs = this.nDHTs - toBeDealtByLeft;
					this.front = findLeft(this.dealer);
				} else {
					dealer.uTs = this.dHTs - toBeDealtByDealer;
					leftPlayer.uTs = this.nDHTs;
					this.front = this.dealer;
				}
				oppPlayer.uTs = this.dHTs;
				break;
			case 3: // deal from opposite
				this.newLog(`Dealing from ${this.ps[findOpp(this.dealer)].uN}`);
				this.back = findOpp(this.dealer);
				oppPlayer.uTs = 2 * rolled;
				toBeDealtByOpp = this.dHTs - 2 * rolled;
				toBeDealtByRight = initDealtTiles - toBeDealtByOpp;
				if (toBeDealtByRight > this.nDHTs) {
					rightPlayer.uTs = 0;
					toBeDealtByDealer = toBeDealtByRight - this.nDHTs;
					dealer.uTs = this.dHTs - toBeDealtByDealer;
					this.front = this.dealer;
				} else {
					rightPlayer.uTs = this.nDHTs - toBeDealtByRight;
					dealer.uTs = this.dHTs;
					this.front = findRight(this.dealer);
				}
				leftPlayer.uTs = this.nDHTs;
				break;
		}
		this.giveTiles(this.dTs, this.dealer, false, false);
		this.giveTiles(this.nDTs, findRight(this.dealer), false, false);
		this.giveTiles(this.nDTs, findOpp(this.dealer), false, false);
		this.giveTiles(this.nDTs, findLeft(this.dealer), false, false);
		while (
			this.ps[this.dealer].countAllHiddenTiles() < this.dTs ||
			this.ps[findRight(this.dealer)].countAllHiddenTiles() < this.nDTs ||
			this.ps[findOpp(this.dealer)].countAllHiddenTiles() < this.nDTs ||
			this.ps[findLeft(this.dealer)].countAllHiddenTiles() < this.nDTs
		) {
			this.buHua();
		}
		this.ps.forEach((player: User) => {
			player.setHiddenTiles();
			player.sortShownTiles();
		});
		this.taken = true;
		this.takenB = this.dealer;
		if (
			process.env.REACT_APP_DEV_FLAG === '1' &&
			!!this.ps.find(player => player.uN.toUpperCase() === 'TEST20TILESLEFT')
		) {
			this.tiles = this.tiles.slice(0, 20);
		}
	}

	buHua() {
		if (this.ps[this.dealer].countAllHiddenTiles() < this.dTs) {
			this.giveTiles(this.dTs - this.ps[this.dealer].countAllHiddenTiles(), this.dealer, true, true);
		}
		let others: number[] = [findRight(this.dealer), findOpp(this.dealer), findLeft(this.dealer)];
		others.forEach((n: number) => {
			let initNum = this.ps[n].countAllHiddenTiles();
			if (initNum < this.nDTs) {
				this.giveTiles(this.nDTs - initNum, n, true, true);
			}
		});
	}

	handlePongDelay() {
		if (!isEmpty(this.lastT)) {
			let tileHashKey = getTileHashKey(this.id, this.st);
			let hashCard = hashTileString(this.lastT.card, tileHashKey);
			for (let n = 0; n < 4; n++) {
				if (n !== this.tBy && n !== findRight(this.tBy) && findTwo(hashCard, this.ps[n].hTs, 'id')) {
					this.dFr = new Date();
				}
			}
		}
	}

	nextPlayerMove() {
		this.wM = findRight(this.wM);
		this.taken = false;
		this.thrown = false;
		this.newLog(`${this.ps[this.wM].uN}'s turn`);
	}

	repr(): any[] {
		let res: any[];
		if (this.st <= 4) {
			res = ['東', this.st];
		} else if (this.st <= 8) {
			res = ['南', ((this.st - 1) % 4) + 1];
		} else if (this.st <= 12) {
			res = ['西', ((this.st - 1) % 8) + 1];
		} else if (this.st <= 16) {
			res = ['北', ((this.st - 1) % 12) + 1];
		}
		if (this.st === this.prev) {
			res.push(['连']);
		}
		return res;
	}

	prepForNewRound() {
		this.mid = true;
		this.wM = this.dealer;
		this.ps.forEach(player => {
			player.prepareForNewRound();
		});
		this.tiles = [];
		this.front = null;
		this.back = null;
		this.lastT = {};
		this.tBy = null;
		this.thrown = false;
		this.taken = true;
		this.takenB = this.dealer;
		this.hu = [];
		this.draw = false;
		this.logs = [];
		this.fN = false;
	}

	initRound() {
		if (this.fN) {
			this.st += 1;
		}
		if (this.st === 1) {
			if (
				process.env.REACT_APP_DEV_FLAG === '1' &&
				!!this.ps.find(player => player.uN.toUpperCase() === 'TEST2ROUNDSLEFT')
			) {
				this.st = 15;
				this.dealer = 2;
			} else {
				this.dealer = 0;
			}
		}
		this.newLog(`Starting round ${this.st}${this.prev === this.st ? ` 连` : ``}`);
		this.prepForNewRound();

		let hiddenTiles = this.generateHiddenTiles();
		let shuffledTiles = shuffle(hiddenTiles);
		for (let i = 0; i < shuffledTiles.length; i++) {
			shuffledTiles[i].ref = i;
		}
		this.tiles = shuffledTiles;
		this.distributeTiles();
		this.newLog(`${this.ps[this.dealer].uN}'s turn - to throw`);
	}

	/**
	 * => this.prev(st),
	 * if game is to continue => this.mid(false), this.st+=1, next this.dealer
	 */
	endRound() {
		if (this.hu.length === 3) {
			let huLog: string = `${this.ps[this.hu[0]].uN} hu with ${this.hu[1]}台`;
			if (this.hu[2] === 1) {
				huLog += ` 自摸`;
			} else if (this.tBy && this.ps[this.tBy].uN !== this.ps[this.hu[0]].uN) {
				huLog += `, last tile thrown by ${this.ps[this.tBy].uN}`;
			}
			this.newLog(huLog);
		}
		this.mid = false;
		this.prev = this.st;
		if (this.dealer === 3 && this.st === 16 && this.fN) {
			this.dealer = 10;
			this.newLog('Game ended');
			this.on = false;
		} else if (this.fN) {
			this.dealer = (this.dealer + 1) % 4;
			this.newLog('Round ended');
		}
	}

	tileThrown(tile: IShownTile, player: number) {
		this.lastT = tile;
		this.tBy = player;
		this.thrown = true;
		this.newLog(`${this.ps[player].uN} discarded ${tile.card}`);
	}
}
