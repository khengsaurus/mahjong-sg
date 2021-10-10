import isEmpty from 'lodash.isempty';
import React, { useMemo, useRef } from 'react';
import { FrontBackTag, IPlayerComponentProps, Segments, Sizes } from '../../global/enums';
import useTiles from '../../util/hooks/useTiles';
import { useDynamicWidth } from '../../util/hooks/useWindowSize';
import DiscardedTiles from '../Tiles/DiscardedTiles';
import HiddenHand from '../Tiles/HiddenHand';
import ShownTile from '../Tiles/ShownTile';
import ShownTiles from '../Tiles/ShownTiles';
import UnusedTiles from '../Tiles/UnusedTiles';
import './playerComponents.scss';

const LeftPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, tilesSize } = props;
	const { hiddenTiles, shownTiles, melds, discardedTiles, lastTakenTile, unusedTiles, showTiles } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];

	const { flowers, nonFlowers, nonFlowerIds, flowerIds, hiddenCards } = useTiles({
		shownTiles,
		melds,
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
		// addHalfTile: !isEmpty(lastTakenTile)
	});

	const shownHiddenHand = useMemo(() => {
		return (
			<div className="vtss left" ref={shownHiddenHandRef}>
				{hiddenTiles.map(tile => {
					return <ShownTile key={tile.id} tileID={tile.id} tileCard={tile.card} segment={Segments.LEFT} />;
				})}
				{!isEmpty(lastTakenTile) && (
					<ShownTile
						key={lastTakenTile.id}
						tileID={lastTakenTile.id}
						tileCard={lastTakenTile.card}
						segment={Segments.LEFT}
						classSuffix="margin-bottom"
						highlight
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenCards]);

	const hiddenHand = useMemo(() => {
		return <HiddenHand tiles={allHiddenTiles.length} segment={Segments.LEFT} />;
	}, [allHiddenTiles.length]);

	const renderShownTiles = () => {
		return (
			<div ref={shownTilesRef} className="vtss left">
				<ShownTiles
					nonFlowers={nonFlowers}
					// nonFlowers={[...hiddenTiles, ...nonFlowers]}
					flowers={flowers}
					flowerIds={flowerIds}
					nonFlowerIds={nonFlowerIds}
					segment={Segments.LEFT}
					dealer={dealer}
					tilesSize={tilesSize}
					lastThrownId={lastThrown?.id}
				/>
			</div>
		);
	};

	const renderUnusedTiles = useMemo(() => {
		return <UnusedTiles tiles={unusedTiles} segment={Segments.LEFT} tag={frontBackTag} />;
	}, [unusedTiles, frontBackTag]);

	const renderDiscardedTiles = () => {
		return (
			<DiscardedTiles
				className="vtss left discarded"
				tiles={discardedTiles}
				// tiles={[...hiddenTiles, ...discardedTiles]}
				segment={Segments.LEFT}
				lastThrownId={lastThrown?.id}
			/>
		);
	};

	return (
		<div className={`column-section-${tilesSize || Sizes.MEDIUM}`}>
			{showTiles ? shownHiddenHand : hiddenHand}
			{shownTiles?.length > 0 && renderShownTiles()}
			{unusedTiles > 0 && renderUnusedTiles}
			{discardedTiles?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default LeftPlayer;
