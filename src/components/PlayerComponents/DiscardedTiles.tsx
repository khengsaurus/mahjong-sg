import React from 'react';
import { Segments } from '../../global/enums';
import ShownTile from './ShownTile';

interface Props {
	tiles: ITile[];
	segment: Segments;
	lastThrownId?: string;
}

function compare(prev: Props, next: Props) {
	return (
		prev.tiles.length === next.tiles.length &&
		prev.segment === next.segment &&
		(!!prev.tiles.find(tile => {
			return tile.id === prev.lastThrownId;
		})
			? !!next.lastThrownId && prev.lastThrownId === next.lastThrownId
			: true)
	);
}

const DiscardedTiles = ({ tiles, segment, lastThrownId }: Props) => {
	return (
		<>
			{tiles.map(tile => {
				return (
					<ShownTile
						key={tile.id}
						tileID={tile.id}
						tileCard={tile.card}
						segment={segment}
						lastID={lastThrownId}
					/>
				);
			})}
		</>
	);
};

export default React.memo(DiscardedTiles, compare);
