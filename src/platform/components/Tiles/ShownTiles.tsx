import CasinoIcon from '@material-ui/icons/Casino';
import { memo } from 'react';
import { Segments, Sizes, Suits } from 'shared/enums';
import ShownTile from './ShownTile';

interface Props {
	nonFlowers: IShownTile[];
	flowers: IShownTile[];
	flowerIds: string[];
	nonFlowerIds: string[];
	segment: Segments;
	dealer: boolean;
	tilesSize: Sizes;
	lastThrownId?: string;
}

function compare(prev: Props, next: Props) {
	return (
		prev.flowerIds.length === next.flowerIds.length &&
		prev.nonFlowerIds.length === next.nonFlowerIds.length &&
		prev.segment === next.segment &&
		prev.dealer === next.dealer &&
		prev.tilesSize === next.tilesSize &&
		(!!prev.nonFlowerIds.find(tileId => {
			return tileId === prev.lastThrownId;
		})
			? prev.lastThrownId === next.lastThrownId
			: !next.nonFlowerIds.find(tileId => {
					return tileId === next.lastThrownId;
			  }))
	);
}

const ShownTiles = ({ nonFlowers, flowers, segment, dealer, tilesSize, lastThrownId }: Props) => {
	return (
		<>
			{nonFlowers.map(tile => {
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
			{flowers.map(tile => {
				return (
					<ShownTile
						key={tile.id}
						tileID={tile.id}
						tileCard={tile.c}
						segment={segment}
						classSuffix={tile.v ? (tile.s === Suits.ANIMAL ? 'flower animal' : 'hts flower') : ''}
					/>
				);
			})}
			{dealer && <CasinoIcon color="primary" fontSize={tilesSize} />}
		</>
	);
};

export default memo(ShownTiles, compare);
