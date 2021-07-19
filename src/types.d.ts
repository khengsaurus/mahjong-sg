interface SimpleUser {
	username: string;
	id: string;
}

interface alert {
	status: Color;
	msg: string;
}

type OneToFour = 1 | 2 | 3 | 4;
type OneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Wind = '东' | '南' | '西' | '北';
type Suit = '万' | '筒' | '索';
type Dragon = '红中' | '白般' | '发财';
type Stage = `${Wind} ${OneToFour}`;

interface Tile {
	card: string;
	suit: string;
	number?: number;
	id: string;
	index: number;
	show: boolean;
	isValidFlower?: boolean;
	// canBeTaken?: boolean;
}

interface PlayerComponentProps {
	player: User;
	hasFront?: boolean;
	hasBack?: boolean;
}
