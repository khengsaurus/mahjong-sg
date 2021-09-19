import React from 'react';
import { Segments } from '../../global/enums';
import getTileSrc from '../../images';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';

interface ShownTileProps {
	tileUUID: string;
	tileCard: string;
	segment: Segments;
	lastUUID?: string;
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
	const { tileUUID, tileCard, segment, lastUUID = '', highlight, classSuffix } = props;
	let divClass = getClass(segment);
	let bgClass = `${getClass(segment)}-bg`;

	switch (divClass) {
		case 'hts':
			return (
				<img
					className={`${divClass} ${highlight || lastUUID === tileUUID ? `last` : ``} ${classSuffix || ``}`}
					src={getTileSrc(tileCard)}
					alt="tile"
				/>
			);
		case 'vts':
			return (
				<div className={`${divClass} ${classSuffix || ``}`}>
					<img
						className={`${bgClass} ${highlight || lastUUID === tileUUID ? `last` : ``} ${
							classSuffix || ``
						}`}
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
