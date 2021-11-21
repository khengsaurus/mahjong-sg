import { memo } from 'react';
import { Segment } from 'shared/enums';
import getTileSrc from 'shared/images';

interface ShownTileProps {
	tileID: string;
	tileCard: string;
	segment: Segment;
	lastID?: string;
	highlight?: boolean;
	classSuffix?: string;
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

const ShownTile = (props: ShownTileProps) => {
	const { tileID, tileCard, segment, lastID = '', highlight, classSuffix } = props;
	let divClass = getClass(segment);
	let bgClass = `${getClass(segment)}-bg`;

	switch (divClass) {
		case 'hts':
			return (
				<img
					className={`${divClass} ${highlight || lastID === tileID ? `last` : ``} ${classSuffix || ``}`}
					src={getTileSrc(tileCard)}
					alt="tile"
				/>
			);
		case 'vts':
			return (
				<div className={`${divClass} ${classSuffix || ``}`}>
					<img
						className={`${bgClass} ${highlight || lastID === tileID ? `last` : ``} ${classSuffix || ``}`}
						src={getTileSrc(tileCard)}
						alt="tile"
					/>
				</div>
			);
		default:
			return null;
	}
};

export default memo(ShownTile);
