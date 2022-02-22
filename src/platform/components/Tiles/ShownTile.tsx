import { memo } from 'react';
import { Segment } from 'shared/enums';
import getTileSrc from 'shared/images';

interface IShownTileP {
	tileRef: number;
	tileCard: string;
	segment: Segment;
	highlight?: boolean;
	classSuffix?: string;
}

function getClass(segment: Segment) {
	switch (segment) {
		case Segment.TOP:
			return 'hts';
		case Segment.BOTTOM:
			return 'hts';
		default:
			return 'vts';
	}
}

/**
 * @description Renders a ShownTile for IShownTile | IHiddenTile, hence tileCard needs to be unhashed and passed as a prop
 */
const ShownTile = (props: IShownTileP) => {
	const { tileRef, tileCard, segment, highlight, classSuffix } = props;
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
						draggable="false"
					/>
				</div>
			);
		default:
			return null;
	}
};

export default memo(ShownTile);
