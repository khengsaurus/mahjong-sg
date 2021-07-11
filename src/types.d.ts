interface User {
	id: string;
	username: string;
	photoUrl: string;
	tiles?: Tile[];
	// contacts: Array<Contact>
	// addToContacts: (user:User) => {}
	// msgContact: (msg:String, contact:Contact) => {}
	// msgGroup: (msg:String, group:Group) => {}
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

type Tile = {
	// card: `${`${OneToNine}-${Suit}` | `${Dragon}` | `${Wind}`}-${OneToFour}`;
	card: string;
	show: boolean;
};

interface Game {
	id: string;
	// stage?: Stage;
	stage: number;
	ongoing: boolean;
	players?: User[];
	1?: User;
	2?: User;
	3?: User;
	4?: User;
	tiles?: Tile[];
}
