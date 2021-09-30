import React, { useMemo } from 'react';
import { Segments } from '../../global/enums';
import { HiddenTile } from '../../global/StyledComponents';
import { generateNumberArray } from '../../util/utilFns';

interface Props {
	tiles: number;
	segment: Segments;
}

const HiddenHand = ({ tiles, segment }: Props) => {
	const tilesArray = useMemo(() => {
		return generateNumberArray(tiles);
	}, [tiles]);

	return segment === Segments.TOP ? (
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

export default React.memo(HiddenHand);
