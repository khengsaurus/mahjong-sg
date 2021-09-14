import isEmpty from 'lodash.isempty';
import { Segments } from '../../global/enums';
import getTileSrc from '../../images';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';

interface ShownTileProps {
	tile: ITile;
	segment: Segments;
	last?: ITile;
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
					className={`${divClass} ${highlight || (!isEmpty(last) && last.id === tile.id) ? `last` : ``} ${
						classSuffix || ``
					}`}
					src={getTileSrc(tile.card)}
					alt="tile"
				/>
			);
		case 'vts':
			return (
				<div className={`${divClass} ${classSuffix || ``}`}>
					<img
						className={`${bgClass} ${highlight || (!isEmpty(last) && last.id === tile.id) ? `last` : ``} ${
							classSuffix || ``
						}`}
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
