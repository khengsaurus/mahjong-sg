import React, { useMemo } from 'react';
import { FrontBackTag, Segments } from 'shared/enums';
import { generateNumberArray } from 'shared/util';
import { HiddenTile } from 'web/style/StyledComponents';

interface Props {
	tiles: number;
	segment: Segments;
	tag?: FrontBackTag;
}

const UnusedTiles = ({ tiles, segment, tag }: Props) => {
	const tilesArray = useMemo(() => {
		return generateNumberArray(tiles);
	}, [tiles]);

	return segment === Segments.TOP || segment === Segments.BOTTOM ? (
		<div className={`htsh unused ${segment === Segments.BOTTOM ? `bottom ` : ``}${tag || ``}`}>
			{tilesArray.map(i => {
				return <HiddenTile key={`${segment}-unused-${i}`} className="hth" />;
			})}
		</div>
	) : (
		<div className={`vtsh unused ${segment === Segments.RIGHT ? `right ` : ``}${tag || ``}`}>
			{tilesArray.map(i => {
				return <HiddenTile key={`${segment}-unused-${i}`} className="vth" />;
			})}
		</div>
	);
};

export default React.memo(UnusedTiles);
