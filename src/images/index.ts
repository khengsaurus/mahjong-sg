import _1万 from './tiles/1万.svg';
import _1筒 from './tiles/1筒.svg';
import _1索 from './tiles/1索.svg';
import _2万 from './tiles/2万.svg';
import _2筒 from './tiles/2筒.svg';
import _2索 from './tiles/2索.svg';
import _3万 from './tiles/3万.svg';
import _3筒 from './tiles/3筒.svg';
import _3索 from './tiles/3索.svg';
import _4万 from './tiles/4万.svg';
import _4筒 from './tiles/4筒.svg';
import _4索 from './tiles/4索.svg';
import _5万 from './tiles/5万.svg';
import _5筒 from './tiles/5筒.svg';
import _5索 from './tiles/5索.svg';
import _6万 from './tiles/6万.svg';
import _6筒 from './tiles/6筒.svg';
import _6索 from './tiles/6索.svg';
import _7万 from './tiles/7万.svg';
import _7筒 from './tiles/7筒.svg';
import _7索 from './tiles/7索.svg';
import _8万 from './tiles/8万.svg';
import _8筒 from './tiles/8筒.svg';
import _8索 from './tiles/8索.svg';
import _9万 from './tiles/9万.svg';
import _9筒 from './tiles/9筒.svg';
import _9索 from './tiles/9索.svg';
import _blue1 from './tiles/blue1.svg';
import _blue2 from './tiles/blue2.svg';
import _blue3 from './tiles/blue3.svg';
import _blue4 from './tiles/blue4.svg';
import _cat from './tiles/cat.svg';
import _rooster from './tiles/rooster.svg';
import _mouse from './tiles/mouse.svg';
import _red1 from './tiles/red1.svg';
import _red2 from './tiles/red2.svg';
import _red3 from './tiles/red3.svg';
import _red4 from './tiles/red4.svg';
import _worm from './tiles/worm.svg';
import _東 from './tiles/東.svg';
import _北 from './tiles/北.svg';
import _南 from './tiles/南.svg';
import _发财 from './tiles/发财.svg';
import _无 from './tiles/无.svg';
import _白板 from './tiles/白板.svg';
import _红中 from './tiles/红中.svg';
import _西 from './tiles/西.svg';
// import dice from './symbols/dice.svg';

export default function getTileSrc(card: string): string {
	switch (card) {
		case '1万':
			return _1万;
		case '2万':
			return _2万;
		case '3万':
			return _3万;
		case '4万':
			return _4万;
		case '5万':
			return _5万;
		case '6万':
			return _6万;
		case '7万':
			return _7万;
		case '8万':
			return _8万;
		case '9万':
			return _9万;
		case '1索':
			return _1索;
		case '2索':
			return _2索;
		case '3索':
			return _3索;
		case '4索':
			return _4索;
		case '5索':
			return _5索;
		case '6索':
			return _6索;
		case '7索':
			return _7索;
		case '8索':
			return _8索;
		case '9索':
			return _9索;
		case '1筒':
			return _1筒;
		case '2筒':
			return _2筒;
		case '3筒':
			return _3筒;
		case '4筒':
			return _4筒;
		case '5筒':
			return _5筒;
		case '6筒':
			return _6筒;
		case '7筒':
			return _7筒;
		case '8筒':
			return _8筒;
		case '9筒':
			return _9筒;

		case 'mouse':
			return _mouse;
		case 'cat':
			return _cat;
		case 'rooster':
			return _rooster;
		case 'worm':
			return _worm;
		case 'red1':
			return _red1;
		case 'red2':
			return _red2;
		case 'red3':
			return _red3;
		case 'red4':
			return _red4;
		case 'blue1':
			return _blue1;
		case 'blue2':
			return _blue2;
		case 'blue3':
			return _blue3;
		case 'blue4':
			return _blue4;
		case '東':
			return _東;
		case '南':
			return _南;
		case '西':
			return _西;
		case '北':
			return _北;
		case '红中':
			return _红中;
		case '白板':
			return _白板;
		case '发财':
			return _发财;
		default:
			return _无;
	}
}