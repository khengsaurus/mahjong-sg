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
	const allHiddenTiles = player?.allHiddenTiles() || [];
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;

	const { flowers, nonFlowers, nonFlowerIds, flowerIds, hiddenCards } = useTiles({
		shownTiles: player?.shownTiles,
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
		// addHalfTile: !isEmpty(player.lastTakenTile)
	});

	const shownHiddenHand = useMemo(() => {
		return (
			<div className="vtss left" ref={shownHiddenHandRef}>
				{player.hiddenTiles.map(tile => {
					return <ShownTile key={tile.id} tileID={tile.id} tileCard={tile.card} segment={Segments.LEFT} />;
				})}
				{!isEmpty(player.lastTakenTile) && (
					<ShownTile
						key={player.lastTakenTile.id}
						tileID={player.lastTakenTile.id}
						tileCard={player.lastTakenTile.card}
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
					// nonFlowers={[...player.hiddenTiles, ...nonFlowers]}
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

	const unusedTiles = useMemo(() => {
		return <UnusedTiles tiles={player.unusedTiles} segment={Segments.LEFT} tag={frontBackTag} />;
	}, [player?.unusedTiles, frontBackTag]);

	const renderDiscardedTiles = () => {
		return (
			<DiscardedTiles
				className="vtss left discarded"
				tiles={player.discardedTiles}
				// tiles={[...player.hiddenTiles, ...player.discardedTiles]}
				segment={Segments.LEFT}
				lastThrownId={lastThrown?.id}
			/>
		);
	};

	return (
		<div className={`column-section-${tilesSize || Sizes.MEDIUM}`}>
			{player?.showTiles ? shownHiddenHand : hiddenHand}
			{player?.shownTiles?.length > 0 && renderShownTiles()}
			{player?.unusedTiles > 0 && unusedTiles}
			{player?.discardedTiles?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default LeftPlayer;
