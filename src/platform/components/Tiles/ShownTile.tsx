import { memo } from 'react';
import { Segment } from 'shared/enums';
import getTileSrc from 'shared/images';

interface ShownTileProps {
	tileRef: number;
	tileCard: string;
	segment: Segment;
	highlight?: boolean;
	classSuffix?: string;
	onClick?: (p: any) => void;
}

function getClass(segment: Segment) {
	switch (segment) {
		case Segment.TOP:
			return 'hts';
		case Segment.BOTTOM:
			return 'hts';
		case Segment.LEFT:
			return 'vts';
		case Segment.RIGHT:
			return 'vts';
		default:
			return '';
	}
}

/**
 * @description Renders a ShownTile for IShownTile | IHiddenTile, hence tileCard needs to be unhashed and passed as a prop
 */
const ShownTile = (props: ShownTileProps) => {
	const { tileRef, tileCard, segment, highlight, classSuffix, onClick } = props;
	let divClass = getClass(segment);
	let bgClass = `${getClass(segment)}-bg`;

	switch (divClass) {
		case 'hts':
			return (
				<img
					id={`shown-tile-${tileRef}`}
					className={`${divClass} ${highlight ? `last` : ``} ${classSuffix || ``}`}
					src={getTileSrc(tileCard)}
					alt="tile"
					onClick={onClick}
					draggable="false"
				/>
			);
		case 'vts':
			return (
				<div className={`${divClass} ${classSuffix || ``}`}>
					<img
						id={`shown-tile-${tileRef}`}
						className={`${bgClass} ${highlight ? `last` : ``} ${classSuffix || ``}`}
						src={getTileSrc(tileCard)}
						alt="tile"
						onClick={onClick}
						draggable="false"
					/>
				</div>
			);
		default:
			return null;
	}
};

export default memo(ShownTile);
