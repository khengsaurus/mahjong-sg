import { memo } from 'react';
import { Segment } from 'shared/enums';
import ShownTile from './ShownTile';

interface IDiscardedTilesP {
	tiles: IShownTile[];
	segment: Segment;
	className: string;
}

function compare(prev: IDiscardedTilesP, next: IDiscardedTilesP) {
	return (
		prev.segment === next.segment &&
		prev.className === next.className &&
		JSON.stringify(prev.tiles.map(t => t.r)) === JSON.stringify(next.tiles.map(t => t.r))
	);
}

const DiscardedTiles = ({ className, tiles, segment }: IDiscardedTilesP) => {
	return (
		<div className={className}>
			{tiles.map(tile => (
				<ShownTile key={tile.i} tileRef={tile.r} tileCard={tile.c} segment={segment} />
			))}
		</div>
	);
};

export default memo(DiscardedTiles, compare);
