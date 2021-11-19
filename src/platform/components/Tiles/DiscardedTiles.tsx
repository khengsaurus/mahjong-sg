import { memo } from 'react';
import { Segments } from 'shared/enums';
import ShownTile from './ShownTile';

interface IDiscardedTiles {
	tiles: IShownTile[];
	segment: Segments;
	className: string;
	lastThrownId?: string;
}

function compare(prev: IDiscardedTiles, next: IDiscardedTiles) {
	return (
		prev.segment === next.segment &&
		prev.className === next.className &&
		JSON.stringify(prev.tiles) === JSON.stringify(next.tiles) &&
		(!!prev.tiles.find(tile => tile.id === prev.lastThrownId)
			? !!next.lastThrownId && prev.lastThrownId === next.lastThrownId
			: true)
	);
}

const DiscardedTiles = ({ className, tiles, segment, lastThrownId }: IDiscardedTiles) => {
	return (
		<div className={className}>
			{tiles.map(tile => (
				<ShownTile key={tile.id} tileID={tile.id} tileCard={tile.c} segment={segment} lastID={lastThrownId} />
			))}
		</div>
	);
};

export default memo(DiscardedTiles, compare);
