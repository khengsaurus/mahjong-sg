import './playerComponentsSmall.scss';
import './playerComponentsMedium.scss';
import './playerComponentsLarge.scss';
import getTileSrc from '../../images';
import isEmpty from 'lodash.isempty';
import { Segments } from '../../Globals';

interface ShownTileProps {
	tile: TileI;
	segment: Segments;
	last?: TileI;
	highlight?: boolean;
	classSuffix?: string;
}

function getClass(segment: Segments) {
	switch (segment) {
		case Segments.top:
			return 'hts';
		case Segments.bottom:
			return 'hts';
		case Segments.left:
			return 'vts';
		case Segments.right:
			return 'vts';
		default:
			return '';
	}
}

const ShownTile = (props: ShownTileProps) => {
	const { tile, segment, last, highlight, classSuffix } = props;
	let divClass = getClass(segment);
	let bgClass = `${getClass(segment)}-bg`;

	switch (divClass) {
		case 'hts':
			return (
				<img
					className={`${divClass} ${
						highlight || (last && !isEmpty(last) && last.id === tile.id) ? `last` : ``
					} ${classSuffix || ``}`}
					src={getTileSrc(tile.card)}
					alt="tile"
				/>
			);
		case 'vts':
			return (
				<div className={`${divClass} ${classSuffix || ``}`}>
					<img
						className={`${bgClass} ${
							highlight || (last && !isEmpty(last) && last.id === tile.id) ? `last` : ``
						} ${classSuffix || ``}`}
						src={getTileSrc(tile.card)}
						alt="tile"
					/>
				</div>
			);
		default:
			return null;
	}
};

export default ShownTile;
