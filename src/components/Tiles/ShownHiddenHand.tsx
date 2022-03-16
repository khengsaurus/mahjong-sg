import CasinoIcon from '@mui/icons-material/Casino';
import { Highlight } from '@mui/icons-material';
import { isEmpty } from 'lodash';
import React, { forwardRef, memo, MutableRefObject } from 'react';
import ColumnFlexWrap from 'react-column-flex-wrap';
import { Segment, Size } from 'enums';
import { revealTile } from 'utility';
import ShownTile from './ShownTile';

interface IShownHHP {
	className?: string;
	hTs?: IHiddenTile[];
	lTa?: IShownTile | IHiddenTile;
	tHK?: number;
	dealer?: boolean;
	segment?: Segment;
	lastSuffix?: string;
	dependencies?: any[];
}

function compare(prev: IShownHHP, next: IShownHHP) {
	return (
		prev.tHK === next.tHK &&
		prev.lTa?.r === next.lTa?.r &&
		prev.segment === next.segment &&
		prev.dealer === next.dealer &&
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
	dealer: boolean,
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
			{dealer && <CasinoIcon color="primary" fontSize={Size.SMALL} />}
		</>
	);
}

const ShownHiddenHand = forwardRef<MutableRefObject<any>, IShownHHP>(
	(props: IShownHHP, ref?: MutableRefObject<any>) => {
		const { className, hTs, lTa, dealer, tHK, segment, lastSuffix, dependencies } = props;
		const revLTT: IShownTile = !isEmpty(lTa) ? (!Number(lTa?.x) ? revealTile(lTa, tHK) : lTa) : null;

		return segment === Segment.LEFT || segment === Segment.RIGHT ? (
			<ColumnFlexWrap className={className} constantHeight constantWidth dependencies={dependencies} ref={ref}>
				{renderTiles(hTs, revLTT, lTa, dealer, segment, lastSuffix, Highlight, tHK)}
			</ColumnFlexWrap>
		) : (
			<div className={className} ref={ref}>
				{renderTiles(hTs, revLTT, lTa, dealer, segment, lastSuffix, Highlight, tHK)}
			</div>
		);
	}
);

export default memo(ShownHiddenHand, compare);
