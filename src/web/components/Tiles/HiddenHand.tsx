import React, { useMemo } from 'react';
import { Segments } from 'shared/enums';
import { generateNumberArray } from 'shared/util/utilFns';
import { HiddenTile } from 'web/style/StyledComponents';

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
