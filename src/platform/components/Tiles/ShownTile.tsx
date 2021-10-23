import { memo } from 'react';
import { Segments } from 'shared/enums';
import getTileSrc from 'shared/images';

interface ShownTileProps {
	tileID: string;
	tileCard: string;
	segment: Segments;
	lastID?: string;
	highlight?: boolean;
	classSuffix?: string;
}

function getClass(segment: Segments) {
	switch (segment) {
		case Segments.TOP:
			return 'hts';
		case Segments.BOTTOM:
			return 'hts';
		case Segments.LEFT:
			return 'vts';
		case Segments.RIGHT:
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
