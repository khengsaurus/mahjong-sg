import React, { useMemo } from 'react';
import { Segments } from '../../../global/enums';
import { HiddenTile } from '../../../global/StyledComponents';
import { generateNumberArray } from '../../../util/utilFns';
import '../playerComponentsLarge.scss';
import '../playerComponentsMedium.scss';
import '../playerComponentsSmall.scss';

interface Props {
	tiles: number;
	segment: Segments;
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

export default React.memo(HiddenHand);
