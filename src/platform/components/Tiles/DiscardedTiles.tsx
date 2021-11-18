import { memo } from 'react';
import { Segments } from 'shared/enums';
import ShownTile from './ShownTile';

interface Props {
	className: string;
	tiles: IShownTile[];
	segment: Segments;
	lastThrownId?: string;
}

function compare(prev: Props, next: Props) {
	return (
		prev.className === next.className &&
		prev.tiles.length === next.tiles.length &&
		prev.segment === next.segment &&
		(!!prev.tiles.find(tile => {
			return tile.id === prev.lastThrownId;
		})
			? !!next.lastThrownId && prev.lastThrownId === next.lastThrownId
			: true)
	);
}

const DiscardedTiles = ({ className, tiles, segment, lastThrownId }: Props) => {
	return (
		<div className={className}>
			{tiles.map(tile => {
				return (
					<ShownTile
						key={tile.id}
						tileID={tile.id}
						tileCard={tile.c}
						segment={segment}
						lastID={lastThrownId}
					/>
				);
			})}
		</div>
	);
};

export default memo(DiscardedTiles, compare);
