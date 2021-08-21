import './playerComponentsSmall.scss';
import './playerComponentsMedium.scss';
import './playerComponentsLarge.scss';
import getTileSrc from '../../images';
import * as _ from 'lodash';

interface ShownTileProps {
	tile: TileI;
	segment: 'top' | 'right' | 'bottom' | 'left';
	last?: TileI;
	highlight?: boolean;
	classSuffix?: string;
}

function getClass(segment: string) {
	switch (segment) {
		case 'top':
			return 'hts';
		case 'bottom':
			return 'hts';
		case 'left':
			return 'vts';
		case 'right':
			return 'vts';
		default:
			return '';
	}
}

const ShownTile = (props: ShownTileProps) => {
	const { tile, segment, last, highlight, classSuffix } = props;
	let divClass = getClass(segment);

	switch (divClass) {
		case 'hts':
			return (
				<img
					key={`${tile.id}`}
					className={`${divClass} ${
						highlight || (last && !_.isEmpty(last) && last.id === tile.id) ? `last` : ``
					} ${classSuffix}`}
					src={getTileSrc(tile.card)}
					alt="tile"
				/>
			);
		case 'vts':
			return null;
		default:
			return null;
	}
};

export default ShownTile;
