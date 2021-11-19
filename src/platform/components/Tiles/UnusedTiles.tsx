import { HiddenTile } from 'platform/style/StyledComponents';
import { memo, useMemo } from 'react';
import { FrontBackTag, Segments } from 'shared/enums';
import { generateNumberArray } from 'shared/util';

interface IUnusedTiles {
	tiles: number;
	segment: Segments;
	tag?: FrontBackTag;
}

const UnusedTiles = ({ tiles, segment, tag }: IUnusedTiles) => {
	const tilesArray = useMemo(() => generateNumberArray(tiles), [tiles]);

	return segment === Segments.TOP || segment === Segments.BOTTOM ? (
		<div className={`htsh unused ${segment === Segments.BOTTOM ? `bottom ` : ``}${tag || ``}`}>
			{tilesArray.map(i => (
				<HiddenTile key={`${segment}-unused-${i}`} className="hth" />
			))}
		</div>
	) : (
		<div className={`vtsh unused ${segment === Segments.RIGHT ? `right ` : ``}${tag || ``}`}>
			{tilesArray.map(i => (
				<HiddenTile key={`${segment}-unused-${i}`} className="vth" />
			))}
		</div>
	);
};

export default memo(UnusedTiles);
