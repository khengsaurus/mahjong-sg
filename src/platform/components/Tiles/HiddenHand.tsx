import { TileBack } from 'platform/style/StyledComponents';
import { memo } from 'react';
import { Segment, Size, _HiddenTileWidth } from 'shared/enums';

interface HiddenHandProps {
	tiles: number;
	segment: Segment;
	tileSize?: Size;
}

const HiddenHand = ({ tiles, segment, tileSize = Size.MEDIUM }: HiddenHandProps) => {
	return segment === Segment.TOP ? (
		<div className="htsh">
			<TileBack className="horizontal-hidden" style={{ width: tiles * _HiddenTileWidth[tileSize] }} />
		</div>
	) : (
		<div className="vtsh">
			<TileBack className="vertical-hidden" style={{ height: tiles * _HiddenTileWidth[tileSize] }} />
		</div>
	);
};

export default memo(HiddenHand);
