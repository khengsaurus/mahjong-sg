import { TileBack } from 'platform/style/StyledComponents';
import { memo } from 'react';
import { Segment, Size, _HiddenTileWidth } from 'shared/enums';

interface HiddenHandProps {
	tiles: number;
	segment: Segment;
	tileSize?: Size;
	highlight?: string;
}

const HiddenHand = ({ tiles, segment, tileSize = Size.MEDIUM, highlight = '' }: HiddenHandProps) => {
	return segment === Segment.TOP ? (
		<div className="htsh" style={{ borderColor: highlight || null }}>
			<TileBack className="horizontal-hidden" style={{ width: tiles * _HiddenTileWidth[tileSize] }} />
		</div>
	) : (
		<div className="vtsh" style={{ borderColor: highlight || null }}>
			<TileBack className="vertical-hidden" style={{ height: tiles * _HiddenTileWidth[tileSize] }} />
		</div>
	);
};

export default memo(HiddenHand);
