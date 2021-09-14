import React, { useMemo } from 'react';
import { FrontBackTag, Segments } from '../../../global/enums';
import { HiddenTile } from '../../../global/StyledComponents';
import { generateNumberArray } from '../../../util/utilFns';
import '../playerComponentsLarge.scss';
import '../playerComponentsMedium.scss';
import '../playerComponentsSmall.scss';

interface Props {
	tiles: number;
	segment: Segments;
	tag: FrontBackTag;
}

function compare(prev: Props, next: Props) {
	return prev.tiles === next.tiles && prev.segment === next.segment && prev.tag === next.tag;
}

const UnusedTiles = ({ tiles, segment, tag }: Props) => {
	const tilesArray = useMemo(() => {
		return generateNumberArray(tiles);
	}, [tiles]);

	return segment === Segments.top || segment === Segments.bottom ? (
		<div className={`htsh unused ${segment === Segments.bottom ? `bottom ` : ``}${tag}`}>
			{tilesArray.map(i => {
				return <HiddenTile key={`${segment}-unused-${i}`} className="hth" />;
			})}
		</div>
	) : (
		<div className={`vtsh unused ${segment === Segments.right ? `right ` : ``}${tag}`}>
			{tilesArray.map(i => {
				return <HiddenTile key={`${segment}-unused-${i}`} className="vth" />;
			})}
		</div>
	);
};

export default React.memo(UnusedTiles, compare);
