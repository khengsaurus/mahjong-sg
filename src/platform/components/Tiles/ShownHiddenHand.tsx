import { Highlight } from '@mui/icons-material';
import { isEmpty } from 'lodash';
import React, { forwardRef, memo, MutableRefObject } from 'react';
import Column from 'react-column-flex-wrap';
import { Segment } from 'shared/enums';
import { revealTile } from 'shared/util';
import ShownTile from './ShownTile';

interface IShownHHP {
	className?: string;
	hTs?: IHiddenTile[];
	lTa?: IShownTile | IHiddenTile;
	tHK?: number;
	segment?: Segment;
	lastSuffix?: string;
	dependencies?: any[];
}

function compare(prev: IShownHHP, next: IShownHHP) {
	return (
		prev.tHK === next.tHK &&
		prev.lTa?.r === next.lTa?.r &&
		prev.segment === next.segment &&
		prev.className === next.className &&
		prev.lastSuffix === next.lastSuffix &&
		JSON.stringify(prev.dependencies) === JSON.stringify(next.dependencies) &&
		JSON.stringify(prev.hTs.map(t => t.r)) === JSON.stringify(next.hTs.map(t => t.r))
	);
}

function renderTiles(
	hTs: IHiddenTile[],
	revLTT: IShownTile,
	lTa: IHiddenTile | IShownTile,
	segment: Segment,
	lastSuffix: string,
	highlight,
	tHK: number
) {
	return (
		<>
			{hTs.map((tile: IHiddenTile) => {
				const revT = revealTile(tile, tHK);
				return <ShownTile key={revT.i} tileRef={tile.r} tileCard={revT.c} segment={segment} />;
			})}
			{revLTT && (
				<ShownTile
					key={revLTT.i}
					tileRef={lTa.r}
					tileCard={revLTT.c}
					segment={segment}
					classSuffix={lastSuffix}
					highlight={highlight}
				/>
			)}
		</>
	);
}

const ShownHiddenHand = forwardRef<MutableRefObject<any>, IShownHHP>(
	(props: IShownHHP, ref?: MutableRefObject<any>) => {
		const { className, hTs, lTa, tHK, segment, lastSuffix, dependencies } = props;
		const revLTT: IShownTile = !isEmpty(lTa) ? (!Number(lTa?.x) ? revealTile(lTa, tHK) : lTa) : null;

		return segment === Segment.LEFT || segment === Segment.RIGHT ? (
			<Column className={className} constantHeight constantWidth dependencies={dependencies} ref={ref}>
				{renderTiles(hTs, revLTT, lTa, segment, lastSuffix, Highlight, tHK)}
			</Column>
		) : (
			<div className={className} ref={ref}>
				{renderTiles(hTs, revLTT, lTa, segment, lastSuffix, Highlight, tHK)}
			</div>
		);
	}
);

export default memo(ShownHiddenHand, compare);
