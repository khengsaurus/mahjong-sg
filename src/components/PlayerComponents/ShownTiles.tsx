import React from 'react';
import { Segments } from '../../global/enums';
import ShownTile from './ShownTile';

interface Props {
	nonFlowers: ITile[];
	flowers: ITile[];
	flowerIds: string[];
	nonFlowerIds: string[];
	segment: Segments;
	lastThrownId?: string;
}

function compare(prev: Props, next: Props) {
	return (
		prev.flowerIds.length === next.flowerIds.length &&
		prev.nonFlowerIds.length === next.nonFlowerIds.length &&
		prev.segment === next.segment &&
		(!!prev.nonFlowerIds.find(tileId => {
			return tileId === prev.lastThrownId;
		})
			? prev.lastThrownId === next.lastThrownId
			: !next.nonFlowerIds.find(tileId => {
					return tileId === next.lastThrownId;
			  }))
	);
}

const ShownTiles = ({ nonFlowers, flowers, segment, lastThrownId }: Props) => {
	return (
		<>
			{nonFlowers.map(tile => {
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
			{flowers.map(tile => {
				return (
					<ShownTile
						key={tile.id}
						tileID={tile.id}
						tileCard={tile.card}
						segment={segment}
						classSuffix={tile.isValidFlower ? (tile.suit === '动物' ? 'flower animal' : 'hts flower') : ''}
					/>
				);
			})}
		</>
	);
};

export default React.memo(ShownTiles, compare);
