import React, { forwardRef, memo, MutableRefObject } from 'react';
import ColumnFlexWrap from 'react-column-flex-wrap';
import { Segment, Size, Suit } from 'shared/enums';
import ShownTile from './ShownTile';

interface IShownTilesP {
	sT: boolean;
	className: string;
	lastThrownId?: string;
	tileSize: Size;
	segment: Segment;
	flowers: IShownTile[];
	nonFlowers: IShownTile[];
	dependencies?: any[];
}

function compare(prev: IShownTilesP, next: IShownTilesP) {
	return (
		prev.segment === next.segment &&
		prev.tileSize === next.tileSize &&
		prev.sT === next.sT &&
		JSON.stringify(prev.flowers) === JSON.stringify(next.flowers) &&
		JSON.stringify(prev.nonFlowers) === JSON.stringify(next.nonFlowers) &&
		JSON.stringify(prev.dependencies) === JSON.stringify(next.dependencies) &&
		(!!prev.nonFlowers.find(tile => tile.i === prev.lastThrownId)
			? prev.lastThrownId === next.lastThrownId
			: !next.nonFlowers.find(tile => tile.i === next.lastThrownId))
	);
}

function renderTiles(nonFlowers: IShownTile[], flowers: IShownTile[], segment: Segment, lastThrownId: string) {
	return (
		<>
			{nonFlowers.map(tile => (
				<ShownTile
					key={tile?.i}
					tileRef={tile?.r}
					tileCard={tile?.c}
					segment={segment}
					highlight={tile?.i === lastThrownId}
				/>
			))}
			{flowers.map(tile => (
				<ShownTile
					key={tile?.i}
					tileRef={tile?.r}
					tileCard={tile?.c}
					segment={segment}
					classSuffix={tile?.v ? (tile?.s === Suit.ANIMAL ? 'flower animal' : 'hts flower') : ''}
				/>
			))}
		</>
	);
}

const ShownTiles = forwardRef<MutableRefObject<any>, IShownTilesP>(
	(props: IShownTilesP, ref?: MutableRefObject<any>) => {
		const { className, nonFlowers, flowers, segment, lastThrownId, dependencies } = props;

		return segment === Segment.LEFT || segment === Segment.RIGHT ? (
			<ColumnFlexWrap
				id={segment + '-shown'}
				className={className}
				constantHeight
				constantWidth
				dependencies={dependencies}
				ref={ref}
			>
				{renderTiles(nonFlowers, flowers, segment, lastThrownId)}
			</ColumnFlexWrap>
		) : (
			<div id={segment + '-shown'} className={className} ref={ref}>
				{renderTiles(nonFlowers, flowers, segment, lastThrownId)}
			</div>
		);
	}
);

export default memo(ShownTiles, compare);
