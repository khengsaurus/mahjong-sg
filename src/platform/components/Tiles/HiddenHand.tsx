import { memo } from 'react';
import { HiddenTile } from 'platform/style/StyledComponents';
import { useMemo } from 'react';
import { Segment } from 'shared/enums';
import { generateNumbers } from 'shared/util';

interface HiddenHandProps {
	tiles: number;
	segment: Segment;
}

const HiddenHand = ({ tiles, segment }: HiddenHandProps) => {
	const tilesArray = useMemo(() => generateNumbers(1, tiles), [tiles]);

	return segment === Segment.TOP ? (
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
