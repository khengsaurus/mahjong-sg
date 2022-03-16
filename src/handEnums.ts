import { Animal, DaPai, Flower, Suit, Wind } from 'enums';

export const Suits: string[] = [Suit.WAN, Suit.TONG, Suit.SUO];
export const HBFCards: string[] = [DaPai.RED, DaPai.WHITE, DaPai.GREEN];
export const Winds: string[] = [Wind.E, Wind.S, Wind.W, Wind.N];
export const Animals: string[] = [Animal.CAT, Animal.MOUSE, Animal.ROOSTER, Animal.WORM];
export const FlowersS: string[] = [Flower.SC, Flower.SX, Flower.SQ, Flower.SD];
export const FlowersF: string[] = [Flower.FM, Flower.FL, Flower.FJ, Flower.FZ];

export enum HandPoint {
	MIN = 1,
	MAX = 5,
	_18 = 5,
	G_4 = 5,
	G_3 = 5,
	_13 = 5,
	GREEN = 5,
	NINE = 5,
	SEVEN = 5,
	HONOR = 5,
	SUITED = 4,
	L_4 = 2,
	L_3 = 3,
	MOON = 1,
	CFS = 1,
	CONCEALED = 1,
	PONG = 2,
	H_SUITED = 2,
	TERMS = 5,
	MIXED_HONOURS_TERMS = 2,
	CHI_1 = 1,
	CHI_4 = 4,
	TIAN = 5,
	DI = 5,
	REN = 5,
	HUA_SHANG = 1,
	HUA_SHANG_HUA = 5,
	QIANG_KANG = 1
}

export enum ScoringHand {
	FLOWERS = 'FLOWERS',
	ANIMALS = 'ANIMALS',
	TIAN = 'TIAN',
	DI = 'DI',
	REN = 'REN',
	_18 = '_18',
	G_4 = 'G_4',
	G_3 = 'G_3',
	_13 = '_13',
	GREEN = 'GREEN',
	NINE = 'NINE',
	SEVEN = 'SEVEN',
	HONOR = 'HONOR',
	SUITED = 'SUITED',
	L_4 = 'L_4',
	L_3 = 'L_3',
	MOON = 'MOON',
	CFS = 'CFS',
	CONCEALED = 'CONCEALED',
	PONG = 'PONG',
	H_SUITED = 'H_SUITED',
	TERMS = 'TERMS',
	MIXED_HONOURS_TERMS = 'MIXED_HONOURS_TERMS',
	CHI_1 = 'CHI_1',
	CHI_4 = 'CHI_4',
	CHI = 'CHI',
	MELDED = 'MELDED',
	FS = 'FS',
	HUA_SHANG = 'HUA_SHANG',
	HUA_SHANG_HUA = 'HUA_SHANG_HUA',
	QIANG_KANG = 'QIANG_KANG'
}

export enum HandDescEng {
	_13 = 'Thirteen Wonders',
	_18 = '18 Arahats',
	ANIMALS = 'All Animals',
	CONCEALED = 'Concealed Hand',
	CFS = 'Complete Flower Set',
	CHI_1 = 'Small Ping Hu',
	CHI_4 = 'Ping Hu',
	DI = 'Earthly Hand',
	FS = 'Flower Tile',
	FLOWERS = 'All Flowers',
	G_3 = 'Three Great Scholars',
	G_4 = 'Four Great Blessings',
	GREEN = 'Pure Green Hand',
	H_SUITED = 'Half Suited',
	HONOR = 'Honor Tiles',
	L_3 = 'Three Lesser Scholars',
	L_4 = 'Four Lesser Blessings',
	MELDED = 'Melded',
	MOON = 'Won on the last tile',
	NINE = 'Nine Gates',
	PONG = 'All Pong',
	REN = 'Humanly Hand',
	SEVEN = 'Seven Pairs',
	SUITED = 'Suited',
	TIAN = 'Heavenly Hand',
	TERMS = 'Teminals',
	MIXED_HONOURS_TERMS = 'Mixed Honours/Terminals',
	HUA_SHANG = 'Win On Replacement Tile',
	HUA_SHANG_HUA = 'Win On 2nd Replacement Tile',
	QIANG_KANG = 'Robbing the Kang'
}

export enum HandDescChi {
	_13 = 'Thirteen Wonders',
	_18 = '18 Arahats',
	ANIMALS = 'All Animals',
	CONCEALED = 'Concealed Hand',
	CFS = 'Complete Flower Set',
	CHI_1 = 'Small Ping Hu',
	CHI_4 = 'Ping Hu',
	DI = 'Earthly Hand',
	FS = 'Flower Tile(s)',
	FLOWERS = 'All Flowers',
	G_3 = 'Three Great Scholars',
	G_4 = 'Four Great Blessings',
	GREEN = 'Pure Green Hand',
	H_SUITED = 'Half Suited',
	HONOR = 'Honor Tiles',
	L_3 = 'Three Lesser Scholars',
	L_4 = 'Four Lesser Blessings',
	MELDED = 'Melded',
	MOON = 'Winning on the last available tile',
	NINE = 'Nine Gates',
	PONG = 'All Pong',
	REN = 'Humanly Hand',
	SEVEN = 'Seven Pairs',
	SUITED = 'Suited',
	TIAN = 'Heavenly Hand',
	TERMS = 'Teminals',
	MIXED_HONOURS_TERMS = 'Mixed Honours/Terminals',
	HUA_SHANG = 'Win On Replacement Tile',
	HUA_SHANG_HUA = 'Win On 2nd Replacement Tile'
}

export const thirteen = [
	...HBFCards,
	...Winds,
	`1${Suit.WAN}`,
	`9${Suit.WAN}`,
	`1${Suit.SUO}`,
	`9${Suit.SUO}`,
	`1${Suit.TONG}`,
	`9${Suit.TONG}`
];

export const greenCards = [
	`2${Suit.SUO}`,
	`3${Suit.SUO}`,
	`4${Suit.SUO}`,
	`6${Suit.SUO}`,
	`8${Suit.SUO}`,
	`${DaPai.GREEN}`
];

export const greenMelds = [
	`p-2${Suit.SUO}`,
	`p-3${Suit.SUO}`,
	`p-4${Suit.SUO}`,
	`p-6${Suit.SUO}`,
	`p-8${Suit.SUO}`,
	`p-${DaPai.GREEN}`,
	`k-2${Suit.SUO}`,
	`k-3${Suit.SUO}`,
	`k-4${Suit.SUO}`,
	`k-6${Suit.SUO}`,
	`k-8${Suit.SUO}`,
	`k-${DaPai.GREEN}`,
	`c-3${Suit.SUO}`
];

export const skipChi = [
	ScoringHand.TIAN,
	ScoringHand.DI,
	ScoringHand.REN,
	ScoringHand._18,
	ScoringHand.G_4,
	ScoringHand.G_3,
	ScoringHand._13,
	ScoringHand.GREEN,
	ScoringHand.NINE,
	ScoringHand.SEVEN,
	ScoringHand.HONOR,
	ScoringHand.L_4,
	ScoringHand.L_3,
	ScoringHand.PONG,
	ScoringHand.TERMS,
	ScoringHand.MIXED_HONOURS_TERMS
];

export const skipWinds = [ScoringHand.G_4, ScoringHand.HONOR];

export const skipPong = [
	ScoringHand.TIAN,
	ScoringHand.DI,
	ScoringHand.REN,
	ScoringHand._18,
	ScoringHand.G_4,
	ScoringHand._13,
	ScoringHand.GREEN,
	ScoringHand.NINE,
	ScoringHand.SEVEN,
	ScoringHand.HONOR,
	ScoringHand.TERMS,
	ScoringHand.CHI_1,
	ScoringHand.CHI_4
];

export const skipSeven = [
	ScoringHand._18,
	ScoringHand.G_4,
	ScoringHand.G_3,
	ScoringHand._13,
	ScoringHand.L_4,
	ScoringHand.L_3,
	ScoringHand.PONG,
	ScoringHand.CHI_1,
	ScoringHand.CHI_4
];

export const skipGreaterThree = [
	ScoringHand.G_4,
	ScoringHand._13,
	ScoringHand.GREEN,
	ScoringHand.NINE,
	ScoringHand.SEVEN,
	ScoringHand.SUITED,
	ScoringHand.L_3,
	ScoringHand.L_4,
	ScoringHand.CHI_1,
	ScoringHand.CHI_4
];

export const skipLesserThree = [
	ScoringHand._18,
	ScoringHand.G_4,
	ScoringHand._13,
	ScoringHand.GREEN,
	ScoringHand.SUITED,
	ScoringHand.H_SUITED,
	ScoringHand.G_3,
	ScoringHand.NINE,
	ScoringHand.SEVEN,
	ScoringHand.L_4,
	ScoringHand.CHI_1,
	ScoringHand.CHI_4
];

export const skipLesserFour = [
	ScoringHand.G_4,
	ScoringHand.G_3,
	ScoringHand._13,
	ScoringHand.GREEN,
	ScoringHand.SUITED,
	ScoringHand.NINE,
	ScoringHand.SEVEN,
	ScoringHand.L_3,
	ScoringHand.CHI_1,
	ScoringHand.CHI_4
];

export const skipGreen = [
	ScoringHand.G_4,
	ScoringHand.G_3,
	ScoringHand._13,
	ScoringHand.SUITED,
	ScoringHand.L_4,
	ScoringHand.L_3,
	ScoringHand.TERMS,
	ScoringHand.MIXED_HONOURS_TERMS
];

export const skipThirteen = [
	ScoringHand._18,
	ScoringHand.G_4,
	ScoringHand.G_3,
	ScoringHand.GREEN,
	ScoringHand.NINE,
	ScoringHand.SEVEN,
	ScoringHand.HONOR,
	ScoringHand.SUITED,
	ScoringHand.L_4,
	ScoringHand.L_3,
	ScoringHand.TERMS,
	ScoringHand.MIXED_HONOURS_TERMS,
	ScoringHand.CHI_1,
	ScoringHand.CHI_4,
	ScoringHand.PONG
];

export const skipTerminals = [
	ScoringHand._13,
	ScoringHand.GREEN,
	ScoringHand.NINE,
	ScoringHand.HONOR,
	ScoringHand.MIXED_HONOURS_TERMS,
	ScoringHand.CHI_1,
	ScoringHand.CHI_4
];

export const skipMixedHonoursTerminals = [
	ScoringHand._13,
	ScoringHand.GREEN,
	ScoringHand.NINE,
	ScoringHand.HONOR,
	ScoringHand.TERMS,
	ScoringHand.CHI_1,
	ScoringHand.CHI_4
];

export const skipIsSuited = [
	ScoringHand._18,
	ScoringHand.G_4,
	ScoringHand.G_3,
	ScoringHand._13,
	ScoringHand.GREEN,
	ScoringHand.NINE,
	ScoringHand.HONOR,
	ScoringHand.L_4,
	ScoringHand.L_3,
	ScoringHand.TERMS,
	ScoringHand.SEVEN,
	ScoringHand.H_SUITED
];

export const skipHonor = [
	ScoringHand._13,
	ScoringHand.GREEN,
	ScoringHand.NINE,
	ScoringHand.SUITED,
	ScoringHand.H_SUITED,
	ScoringHand.TERMS,
	ScoringHand.MIXED_HONOURS_TERMS
];

export const skipHalfSuited = [
	ScoringHand._13,
	ScoringHand.GREEN,
	ScoringHand.NINE,
	ScoringHand.HONOR,
	ScoringHand.SEVEN,
	ScoringHand.SUITED
];

export const skipPongHBF = [ScoringHand.G_3, ScoringHand.L_3, ScoringHand.GREEN, ScoringHand.HONOR];

export const allScoringHands = [
	// in order of rarity (expensive but so the scoring looks nice)
	ScoringHand._18,
	ScoringHand._13,
	ScoringHand.G_4,
	ScoringHand.G_3,
	ScoringHand.GREEN,
	ScoringHand.TERMS,
	ScoringHand.MIXED_HONOURS_TERMS,
	ScoringHand.SEVEN,
	ScoringHand.HONOR,
	ScoringHand.SUITED,
	ScoringHand.L_4,
	ScoringHand.L_3,
	ScoringHand.H_SUITED,
	ScoringHand.PONG,
	ScoringHand.CHI,
	ScoringHand.CONCEALED,
	// ScoringHand.TIAN,
	// ScoringHand.DI,
	// ScoringHand.REN,
	// ScoringHand.NINE,

	// Always done:
	ScoringHand.ANIMALS,
	ScoringHand.FLOWERS
	// ScoringHand.CFS
];

export const canHuWithoutMelds = [ScoringHand._13, ScoringHand.G_3, ScoringHand.SEVEN];

export const skipConcealed = [ScoringHand._13, ScoringHand.SEVEN];
