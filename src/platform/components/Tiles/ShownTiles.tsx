import CasinoIcon from '@material-ui/icons/Casino';
import React, { MutableRefObject } from 'react';
import { Segments, Sizes, Suits } from 'shared/enums';
import ShownTile from './ShownTile';

interface IShownTiles {
	className: string;
	nonFlowers: IShownTile[];
	flowers: IShownTile[];
	flowerIds: string[];
	nonFlowerIds: string[];
	segment: Segments;
	dealer: boolean;
	tilesSize: Sizes;
	lastThrownId?: string;
}

function compare(prev: IShownTiles, next: IShownTiles) {
	return (
		prev.dealer === next.dealer &&
		prev.segment === next.segment &&
		prev.tilesSize === next.tilesSize &&
		JSON.stringify(prev.flowerIds) === JSON.stringify(next.flowerIds) &&
		JSON.stringify(prev.nonFlowerIds) === JSON.stringify(next.nonFlowerIds) &&
		(!!prev.nonFlowerIds.find(tileId => {
			return tileId === prev.lastThrownId;
		})
			? prev.lastThrownId === next.lastThrownId
			: !next.nonFlowerIds.find(tileId => {
					return tileId === next.lastThrownId;
			  }))
	);
}

const ShownTiles = React.forwardRef<MutableRefObject<any>, IShownTiles>(
	(props: IShownTiles, ref?: MutableRefObject<any>) => {
		const { className, nonFlowers, flowers, segment, dealer, tilesSize, lastThrownId } = props;
		return (
			<div id={segment + '-shown'} className={className} ref={ref}>
				{nonFlowers.map(tile => (
					<ShownTile
						key={tile.id}
						tileID={tile.id}
						tileCard={tile.c}
						segment={segment}
						lastID={lastThrownId}
					/>
				))}
				{flowers.map(tile => (
					<ShownTile
						key={tile.id}
						tileID={tile.id}
						tileCard={tile.c}
						segment={segment}
						classSuffix={tile.v ? (tile.s === Suits.ANIMAL ? 'flower animal' : 'hts flower') : ''}
					/>
				))}
				{dealer && <CasinoIcon color="primary" fontSize={tilesSize} />}
			</div>
		);
	}
);

export default React.memo(ShownTiles, compare);
