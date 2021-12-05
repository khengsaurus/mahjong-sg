import { memo } from 'react';
import { Segment } from 'shared/enums';
import ShownTile from './ShownTile';

interface IDiscardedTiles {
	tiles: IShownTile[];
	segment: Segment;
	className: string;
	lastThrownRef?: number;
}

function compare(prev: IDiscardedTiles, next: IDiscardedTiles) {
	return (
		prev.segment === next.segment &&
		prev.className === next.className &&
		JSON.stringify(prev.tiles) === JSON.stringify(next.tiles) &&
		(!!prev.tiles.find(tile => tile.r === prev.lastThrownRef)
			? !!next.lastThrownRef && prev.lastThrownRef === next.lastThrownRef
			: true)
	);
}

const DiscardedTiles = ({ className, tiles, segment, lastThrownRef }: IDiscardedTiles) => {
	return (
		<div className={className}>
			{tiles.map(tile => (
				<ShownTile key={tile.id} tileRef={tile.r} tileCard={tile.c} segment={segment} lastRef={lastThrownRef} />
			))}
		</div>
	);
};

export default memo(DiscardedTiles, compare);
