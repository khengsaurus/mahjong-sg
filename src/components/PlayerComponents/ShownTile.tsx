import React from 'react';
import { Segments } from '../../global/enums';
import getTileSrc from '../../images';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';

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

export default React.memo(ShownTile);
