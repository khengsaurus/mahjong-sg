import CasinoIcon from '@material-ui/icons/Casino';
import React, { MutableRefObject } from 'react';
import { Segment, Size, Suit } from 'shared/enums';
import ShownTile from './ShownTile';

interface IShownTiles {
	className: string;
	nonFlowers: IShownTile[];
	flowers: IShownTile[];
	flowerRefs: number[];
	nonFlowerRefs: number[];
	segment: Segment;
	dealer: boolean;
	tilesSize: Size;
	lastThrownRef?: number;
}

function compare(prev: IShownTiles, next: IShownTiles) {
	return (
		prev.dealer === next.dealer &&
		prev.segment === next.segment &&
		prev.tilesSize === next.tilesSize &&
		JSON.stringify(prev.flowerRefs) === JSON.stringify(next.flowerRefs) &&
		JSON.stringify(prev.nonFlowerRefs) === JSON.stringify(next.nonFlowerRefs) &&
		(!!prev.nonFlowerRefs.find(tileRef => {
			return tileRef === prev.lastThrownRef;
		})
			? prev.lastThrownRef === next.lastThrownRef
			: !next.nonFlowerRefs.find(tileRef => {
					return tileRef === next.lastThrownRef;
			  }))
	);
}

const ShownTiles = React.forwardRef<MutableRefObject<any>, IShownTiles>(
	(props: IShownTiles, ref?: MutableRefObject<any>) => {
		const { className, nonFlowers, flowers, segment, dealer, tilesSize, lastThrownRef } = props;
		return (
			<div id={segment + '-shown'} className={className} ref={ref}>
				{nonFlowers.map(tile => (
					<ShownTile
						key={tile.i}
						tileRef={tile.r}
						tileCard={tile.c}
						segment={segment}
						lastRef={lastThrownRef}
					/>
				))}
				{flowers.map(tile => (
					<ShownTile
						key={tile.i}
						tileRef={tile.r}
						tileCard={tile.c}
						segment={segment}
						classSuffix={tile.v ? (tile.s === Suit.ANIMAL ? 'flower animal' : 'hts flower') : ''}
					/>
				))}
				{dealer && <CasinoIcon color="primary" fontSize={tilesSize} />}
			</div>
		);
	}
);

export default React.memo(ShownTiles, compare);
