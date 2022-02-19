import { isEmpty } from 'lodash';
import React, { forwardRef, memo, MutableRefObject } from 'react';
import { Segment } from 'shared/enums';
import { revealTile } from 'shared/util';
import ShownTile from './ShownTile';

interface ShownHHProps {
	className?: string;
	hTs?: IHiddenTile[];
	lTa?: IShownTile | IHiddenTile;
	tHK?: number;
	segment?: Segment;
	lastSuffix?: string;
}

function compare(prev: ShownHHProps, next: ShownHHProps) {
	return (
		prev.tHK === next.tHK &&
		prev.lTa?.r === next.lTa?.r &&
		prev.segment === next.segment &&
		prev.className === next.className &&
		prev.lastSuffix === next.lastSuffix &&
		JSON.stringify(prev.hTs.map(t => t.r)) === JSON.stringify(next.hTs.map(t => t.r))
	);
}

const ShownHiddenHand = forwardRef<MutableRefObject<any>, ShownHHProps>(
	(props: ShownHHProps, ref?: MutableRefObject<any>) => {
		const { className, hTs, lTa, tHK, segment, lastSuffix } = props;
		const revLTT: IShownTile = !isEmpty(lTa) ? (!Number(lTa?.x) ? revealTile(lTa, tHK) : lTa) : null;
		return (
			<div className={className} ref={ref}>
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
						highlight
					/>
				)}
			</div>
		);
	}
);

export default memo(ShownHiddenHand, compare);
