import { HiddenTile } from 'platform/style/StyledComponents';
import { memo, useMemo } from 'react';
import { FrontBackTag, Segment } from 'shared/enums';
import { generateNumbers } from 'shared/util';

interface IUnusedTiles {
	tiles: number;
	segment: Segment;
	tag?: FrontBackTag;
}

const UnusedTiles = ({ tiles, segment, tag }: IUnusedTiles) => {
	const tilesArray = useMemo(() => generateNumbers(1, tiles), [tiles]);

	return segment === Segment.TOP || segment === Segment.BOTTOM ? (
		<div
			className={`htsh unused ${segment === Segment.BOTTOM ? `bottom` : ``} ${tag || ``} ${
				tiles === 0 ? `hidden` : ``
			}
			`}
		>
			{tilesArray.map(i => (
				<HiddenTile key={`${segment}-unused-${i}`} className="hth" />
			))}
		</div>
	) : (
		<div
			className={`vtsh unused ${segment === Segment.RIGHT ? `right` : ``} ${tag || ``} ${
				tiles === 0 ? `hidden` : ``
			}
			`}
		>
			{tiles > 0 && tilesArray.map(i => <HiddenTile key={`${segment}-unused-${i}`} className="vth" />)}
		</div>
	);
};

export default memo(UnusedTiles);
