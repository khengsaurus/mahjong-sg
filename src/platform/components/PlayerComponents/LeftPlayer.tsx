import isEmpty from 'lodash.isempty';
import { DiscardedTiles, HiddenHand, ShownTile, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import { useDynamicWidth } from 'platform/hooks';
import { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FrontBackTag, Segment, Size } from 'shared/enums';
import { useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { IPlayerComponentProps } from 'shared/typesPlus';
import { revealTile } from 'shared/util';
import './playerComponents.scss';

const LeftPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];
	const {
		sizes: { tileSize = Size.MEDIUM },
		tHK
	} = useSelector((state: IStore) => state);
	const { flowers, nonFlowers, nonFlowerRefs, flowerRefs, hiddenTileIds } = useTiles({
		sTs,
		ms,
		allHiddenTiles
	});

	const shownTilesRef = useRef(null);
	const shownHiddenHandRef = useRef(null);
	useDynamicWidth({
		ref: shownTilesRef,
		tiles: nonFlowers.length + flowers.length,
		tileSize: tileSize,
		dealer
	});

	useDynamicWidth({
		ref: shownHiddenHandRef,
		tiles: player.allHiddenTiles().length,
		tileSize: tileSize
		// addHalfTile: !isEmpty(lTa)
	});

	const shownHiddenHand = useMemo(() => {
		const revLTT: IShownTile = !isEmpty(lTa) ? (!Number(lTa?.x) ? revealTile(lTa, tHK) : lTa) : null;
		return (
			<div className="vtss left" ref={shownHiddenHandRef}>
				{hTs.map(tile => {
					const revT = revealTile(tile, tHK);
					return <ShownTile key={revT.i} tileRef={tile.r} tileCard={revT.c} segment={Segment.LEFT} />;
				})}
				{revLTT && (
					<ShownTile
						key={revLTT.i}
						tileRef={lTa.r}
						tileCard={revLTT.c}
						segment={Segment.LEFT}
						classSuffix="margin-bottom"
						highlight
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenTileIds, tHK]);

	const renderShownTiles = () => (
		<ShownTiles
			className="vtss left"
			nonFlowers={nonFlowers}
			// nonFlowers={[...hTs, ...nonFlowers]}
			flowers={flowers}
			flowerRefs={flowerRefs}
			nonFlowerRefs={nonFlowerRefs}
			segment={Segment.LEFT}
			dealer={dealer}
			tileSize={tileSize}
			lastThrownRef={lastThrown?.r}
			ref={shownTilesRef}
		/>
	);

	const renderDiscardedTiles = () => (
		<DiscardedTiles
			className="vtss left discarded"
			tiles={dTs}
			// tiles={[...hTs, ...dTs]}
			segment={Segment.LEFT}
			lastThrownRef={lastThrown?.r}
		/>
	);

	return (
		<div className={`column-section-${tileSize || Size.MEDIUM}`}>
			{sT ? shownHiddenHand : <HiddenHand tiles={allHiddenTiles.length} segment={Segment.LEFT} />}
			{/* {shownHiddenHand} */}
			{sTs?.length > 0 && renderShownTiles()}
			{uTs > 0 && <UnusedTiles tiles={uTs} segment={Segment.LEFT} tag={frontBackTag} />}
			{dTs?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default LeftPlayer;
