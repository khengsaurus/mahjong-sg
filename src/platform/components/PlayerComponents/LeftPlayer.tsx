import isEmpty from 'lodash.isempty';
import { DiscardedTiles, HiddenHand, ShownTile, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import { useDynamicWidth } from 'platform/hooks';
import { useContext, useMemo, useRef } from 'react';
import { FrontBackTag, Segments, Sizes } from 'shared/enums';
import { AppContext, useTiles } from 'shared/hooks';
import { revealTile } from 'shared/util';
import './playerComponents.scss';

const LeftPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];

	const { tilesSize, tileHashKey } = useContext(AppContext);
	const { flowers, nonFlowers, nonFlowerIds, flowerIds, hiddenCards } = useTiles({
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
		let revLTT: IShownTile = !isEmpty(lTa) ? (lTa.ix === 0 ? revealTile(lTa, tileHashKey) : lTa) : null;
		return (
			<div className="vtss left" ref={shownHiddenHandRef}>
				{hTs.map(tile => {
					let revT = revealTile(tile, tileHashKey);
					return <ShownTile key={revT.id} tileID={revT.id} tileCard={revT.c} segment={Segments.LEFT} />;
				})}
				{revLTT && (
					<ShownTile
						key={revLTT.id}
						tileID={revLTT.id}
						tileCard={revLTT.c}
						segment={Segments.LEFT}
						classSuffix="margin-bottom"
						highlight
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenCards]);

	const renderShownTiles = () => (
		<ShownTiles
			className="vtss left"
			nonFlowers={nonFlowers}
			// nonFlowers={[...hTs, ...nonFlowers]}
			flowers={flowers}
			flowerIds={flowerIds}
			nonFlowerIds={nonFlowerIds}
			segment={Segments.LEFT}
			dealer={dealer}
			tilesSize={tilesSize}
			lastThrownId={lastThrown?.id}
			ref={shownTilesRef}
		/>
	);

	const renderDiscardedTiles = () => (
		<DiscardedTiles
			className="vtss left discarded"
			tiles={dTs}
			// tiles={[...hTs, ...dTs]}
			segment={Segments.LEFT}
			lastThrownId={lastThrown?.id}
		/>
	);

	return (
		<div className={`column-section-${tilesSize || Sizes.MEDIUM}`}>
			{sT ? shownHiddenHand : <HiddenHand tiles={allHiddenTiles.length} segment={Segments.LEFT} />}
			{sTs?.length > 0 && renderShownTiles()}
			{uTs > 0 && <UnusedTiles tiles={uTs} segment={Segments.LEFT} tag={frontBackTag} />}
			{dTs?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default LeftPlayer;
