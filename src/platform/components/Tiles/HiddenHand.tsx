import CasinoIcon from '@mui/icons-material/Casino';
import { Centered, TileBack } from 'platform/style/StyledComponents';
import { memo } from 'react';
import { Segment, Size, _HiddenTileWidth } from 'shared/enums';

interface IHiddenHandP {
	tiles: number;
	segment: Segment;
	tileSize?: Size;
	dealer?: boolean;
	highlight?: string;
}

const HiddenHand = ({ tiles, segment, tileSize = Size.MEDIUM, dealer = false, highlight = '' }: IHiddenHandP) => {
	return segment === Segment.TOP ? (
		<div className="htsh" style={{ borderColor: highlight || null }}>
			<Centered style={{ flexDirection: segment === Segment.TOP ? 'row-reverse' : 'row' }}>
				<TileBack className="horizontal-hidden" style={{ width: tiles * _HiddenTileWidth[tileSize] }} />
				{dealer && <CasinoIcon color="primary" fontSize={Size.SMALL} />}
			</Centered>
		</div>
	) : (
		<div className="vtsh" style={{ borderColor: highlight || null }}>
			<Centered style={{ flexDirection: segment === Segment.LEFT ? 'column' : 'column-reverse' }}>
				<TileBack className="vertical-hidden" style={{ height: tiles * _HiddenTileWidth[tileSize] }} />
				{dealer && <CasinoIcon color="primary" fontSize={Size.SMALL} />}
			</Centered>
		</div>
	);
};

export default memo(HiddenHand);
