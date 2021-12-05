import isEmpty from 'lodash.isempty';
import { DiscardedTiles, HiddenHand, ShownTile, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import { useDynamicWidth } from 'platform/hooks';
import { useContext, useMemo, useRef } from 'react';
import { FrontBackTag, Segment, Size } from 'shared/enums';
import { AppContext, useTiles } from 'shared/hooks';
import { IPlayerComponentProps } from 'shared/typesPlus';
import { revealTile } from 'shared/util';
import './playerComponents.scss';

const LeftPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];

	const { tilesSize, tileHashKey } = useContext(AppContext);
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
		tilesSize: tilesSize,
		dealer
	});

	useDynamicWidth({
		ref: shownHiddenHandRef,
		tiles: player.allHiddenTiles().length,
		tilesSize: tilesSize
		// addHalfTile: !isEmpty(lTa)
	});

	const shownHiddenHand = useMemo(() => {
		let revLTT: IShownTile = !isEmpty(lTa) ? (lTa.x === 0 ? revealTile(lTa, tileHashKey) : lTa) : null;
		return (
			<div className="vtss left" ref={shownHiddenHandRef}>
				{hTs.map(tile => {
					let revT = revealTile(tile, tileHashKey);
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
	}, [hiddenTileIds, tileHashKey]);

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
			tilesSize={tilesSize}
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
		<div className={`column-section-${tilesSize || Size.MEDIUM}`}>
			{sT ? shownHiddenHand : <HiddenHand tiles={allHiddenTiles.length} segment={Segment.LEFT} />}
			{sTs?.length > 0 && renderShownTiles()}
			{uTs > 0 && <UnusedTiles tiles={uTs} segment={Segment.LEFT} tag={frontBackTag} />}
			{dTs?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default LeftPlayer;
