import React, { useCallback, useMemo } from 'react';
import '../playerComponentsSmall.scss';
import '../playerComponentsMedium.scss';
import '../playerComponentsLarge.scss';
import { Segments } from '../../../global/enums';
import { HiddenTile } from '../../../global/StyledComponents';
import { generateNumberArray } from '../../../util/utilFns';

interface Props {
	tiles: number;
	segment: Segments;
}

function compare(prev: Props, next: Props) {
	return prev.tiles === next.tiles && prev.segment === next.segment;
}

const HiddenHand = ({ tiles, segment }: Props) => {
	const tilesArray = useMemo(() => {
		return generateNumberArray(tiles);
	}, [tiles]);

	return segment === Segments.top ? (
		<div className="htsh">
			{tilesArray.map(ITilendex => {
				return <HiddenTile key={`${segment}-hidden-${ITilendex}`} className="hth" />;
			})}
		</div>
	) : (
		<div className="vtsh">
			{tilesArray.map(ITilendex => {
				return <HiddenTile key={`${segment}-hidden-${ITilendex}`} className="vth" />;
			})}
		</div>
	);
};

export default React.memo(HiddenHand, compare);
