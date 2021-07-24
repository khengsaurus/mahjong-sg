interface Store {
	game: Game;
	gameCache: Game;
	player: User;
}

interface Group {
	name: string;
	users: User[];
}

interface alert {
	status: Color;
	msg: string;
}

interface Tile {
	card?: string;
	suit?: string;
	number?: number;
	id?: string;
	index?: number;
	show?: boolean;
	isValidFlower?: boolean;
}

interface PlayerComponentProps {
	player: User;
	hasFront?: boolean;
	hasBack?: boolean;
}

interface loginParams {
	username: string;
	password: string;
}

interface registerParams {
	username: string;
	password: string;
}
