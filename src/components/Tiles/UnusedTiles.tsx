import { TileBack } from 'style/StyledComponents';
import { memo } from 'react';
import { FrontBackTag, Segment, Size, _HiddenTileWidth } from 'enums';

interface IUnusedTilesP {
	tiles: number;
	segment: Segment;
	tag?: FrontBackTag;
	tileSize?: Size;
}

const UnusedTiles = ({ tiles, segment, tag, tileSize = Size.MEDIUM }: IUnusedTilesP) => {
	const bottomStackLength = Math.ceil(tiles / 2);
	const topStackLength = Math.floor(tiles / 2);
	const bottomStack = bottomStackLength * _HiddenTileWidth[tileSize];
	const topStack = topStackLength * _HiddenTileWidth[tileSize];

	return segment === Segment.TOP || segment === Segment.BOTTOM ? (
		<div className={`htsh unused ${segment === Segment.BOTTOM ? `bottom` : `top`} ${tag || ``}`}>
			{bottomStackLength > 0 && <TileBack className="horizontal-hidden" style={{ width: bottomStack }} />}
			{topStackLength > 0 && (
				<TileBack
					className="horizontal-hidden"
					style={{
						width: topStack,
						borderTop: segment === Segment.TOP ? '0' : null,
						borderBottom: segment === Segment.BOTTOM ? '0' : null
					}}
				/>
			)}
		</div>
	) : (
		<div className={`vtsh unused ${segment === Segment.RIGHT ? `right` : `left`} ${tag || ``}`}>
			{bottomStackLength > 0 && <TileBack className="vertical-hidden" style={{ height: bottomStack }} />}
			{topStackLength > 0 && (
				<TileBack
					className="vertical-hidden"
					style={{
						height: topStack,
						borderLeft: segment === Segment.LEFT ? '0' : null,
						borderRight: segment === Segment.RIGHT ? '0' : null
					}}
				/>
			)}
		</div>
	);
};

export default memo(UnusedTiles);
