import _1S from './tiles/1s.svg';
import _1T from './tiles/1t.svg';
import _1W from './tiles/1w.svg';
import _2S from './tiles/2s.svg';
import _2T from './tiles/2t.svg';
import _2W from './tiles/2w.svg';
import _3S from './tiles/3s.svg';
import _3T from './tiles/3t.svg';
import _3W from './tiles/3w.svg';
import _4S from './tiles/4s.svg';
import _4T from './tiles/4t.svg';
import _4W from './tiles/4w.svg';
import _5S from './tiles/5s.svg';
import _5T from './tiles/5t.svg';
import _5W from './tiles/5w.svg';
import _6S from './tiles/6s.svg';
import _6T from './tiles/6t.svg';
import _6W from './tiles/6w.svg';
import _7S from './tiles/7s.svg';
import _7T from './tiles/7t.svg';
import _7W from './tiles/7w.svg';
import _8S from './tiles/8s.svg';
import _8T from './tiles/8t.svg';
import _8W from './tiles/8w.svg';
import _9S from './tiles/9s.svg';
import _9T from './tiles/9t.svg';
import _9W from './tiles/9w.svg';
import cat from './tiles/cat.svg';
import db from './tiles/db.svg';
import df from './tiles/df.svg';
import dh from './tiles/dh.svg';
import flowerJ from './tiles/flowerJ.svg';
import flowerL from './tiles/flowerL.svg';
import flowerM from './tiles/flowerM.svg';
import flowerZ from './tiles/flowerZ.svg';
import mouse from './tiles/mouse.svg';
import na from './tiles/na.svg';
import rooster from './tiles/rooster.svg';
import seasonChun from './tiles/seasonChun.svg';
import seasonDong from './tiles/seasonDong.svg';
import seasonQiu from './tiles/seasonQiu.svg';
import seasonXia from './tiles/seasonXia.svg';
import we from './tiles/we.svg';
import wn from './tiles/wn.svg';
import worm from './tiles/worm.svg';
import ws from './tiles/ws.svg';
import ww from './tiles/ww.svg';

export default function getTileSrc(card: string) {
	switch (card) {
		case '1W':
			return _1W;
		case '2W':
			return _2W;
		case '3W':
			return _3W;
		case '4W':
			return _4W;
		case '5W':
			return _5W;
		case '6W':
			return _6W;
		case '7W':
			return _7W;
		case '8W':
			return _8W;
		case '9W':
			return _9W;
		case '1S':
			return _1S;
		case '2S':
			return _2S;
		case '3S':
			return _3S;
		case '4S':
			return _4S;
		case '5S':
			return _5S;
		case '6S':
			return _6S;
		case '7S':
			return _7S;
		case '8S':
			return _8S;
		case '9S':
			return _9S;
		case '1T':
			return _1T;
		case '2T':
			return _2T;
		case '3T':
			return _3T;
		case '4T':
			return _4T;
		case '5T':
			return _5T;
		case '6T':
			return _6T;
		case '7T':
			return _7T;
		case '8T':
			return _8T;
		case '9T':
			return _9T;
		case 'al':
			return mouse;
		case 'am':
			return cat;
		case 'ag':
			return rooster;
		case 'ac':
			return worm;
		case 'sc':
			return seasonChun;
		case 'sx':
			return seasonXia;
		case 'sq':
			return seasonQiu;
		case 'sd':
			return seasonDong;
		case 'fm':
			return flowerM;
		case 'fl':
			return flowerL;
		case 'fj':
			return flowerJ;
		case 'fz':
			return flowerZ;
		case 'we':
			return we;
		case 'ws':
			return ws;
		case 'ww':
			return ww;
		case 'wn':
			return wn;
		case 'dh':
			return dh;
		case 'db':
			return db;
		case 'df':
			return df;
		default:
			return na;
	}
}

export {
	_1S,
	_1T,
	_1W,
	_2S,
	_2T,
	_2W,
	_3S,
	_3T,
	_3W,
	_4S,
	_4T,
	_4W,
	_5S,
	_5T,
	_5W,
	_6S,
	_6T,
	_6W,
	_7S,
	_7T,
	_7W,
	_8S,
	_8T,
	_8W,
	_9S,
	_9T,
	_9W,
	cat,
	db,
	df,
	dh,
	flowerJ,
	flowerL,
	flowerM,
	flowerZ,
	mouse,
	na,
	rooster,
	seasonChun,
	seasonDong,
	seasonQiu,
	seasonXia,
	we,
	wn,
	worm,
	ws,
	ww
};
