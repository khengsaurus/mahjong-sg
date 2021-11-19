import { memo } from 'react';
import { HiddenTile } from 'platform/style/StyledComponents';
import { useMemo } from 'react';
import { Segments } from 'shared/enums';
import { generateNumberArray } from 'shared/util';

interface IHiddenHand {
	tiles: number;
	segment: Segments;
}

const HiddenHand = ({ tiles, segment }: IHiddenHand) => {
	const tilesArray = useMemo(() => generateNumberArray(tiles), [tiles]);

	return segment === Segments.TOP ? (
		<div className="htsh">
			{tilesArray.map(ITilendex => (
				<HiddenTile key={`${segment}-hidden-${ITilendex}`} className="hth" />
			))}
		</div>
	) : (
		<div className="vtsh">
			{tilesArray.map(ITilendex => (
				<HiddenTile key={`${segment}-hidden-${ITilendex}`} className="vth" />
			))}
		</div>
	);
};

export default memo(HiddenHand);
