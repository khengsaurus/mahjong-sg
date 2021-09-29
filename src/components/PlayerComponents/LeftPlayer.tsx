import isEmpty from 'lodash.isempty';
import React, { useMemo, useRef } from 'react';
import { FrontBackTag, IPlayerComponentProps, Segments, Sizes } from '../../global/enums';
import useTiles from '../../util/hooks/useTiles';
import { useDynamicShownTilesWidth } from '../../util/hooks/useWindowSize';
import DiscardedTiles from '../Tiles/DiscardedTiles';
import HiddenHand from '../Tiles/HiddenHand';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from '../Tiles/ShownTile';
import UnusedTiles from '../Tiles/UnusedTiles';
import ShownTiles from '../Tiles/ShownTiles';

const LeftPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, tilesSize } = props;
	const allHiddenTiles = player?.allHiddenTiles() || [];
	const frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;

	const { flowers, nonFlowers, nonFlowerIds, flowerIds, hiddenCards } = useTiles({
		shownTiles: player?.shownTiles,
		allHiddenTiles
	});
	const shownTilesRef = useRef(null);
	useDynamicShownTilesWidth({
		shownTilesRef,
		nonFlowersLength: nonFlowers.length,
		flowersLength: flowers.length,
		tilesSize: tilesSize,
		dealer
	});

	const shownHiddenHand = useMemo(() => {
		return (
			<div className="vtss left">
				{player.hiddenTiles.map(tile => {
					return <ShownTile key={tile.id} tileID={tile.id} tileCard={tile.card} segment={Segments.left} />;
				})}
				{!isEmpty(player.lastTakenTile) && (
					<ShownTile
						key={player.lastTakenTile.id}
						tileID={player.lastTakenTile.id}
						tileCard={player.lastTakenTile.card}
						segment={Segments.left}
						classSuffix="margin-bottom"
						highlight
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenCards]);

	const hiddenHand = useMemo(() => {
		return <HiddenHand tiles={allHiddenTiles.length} segment={Segments.left} />;
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
					segment={Segments.left}
					dealer={dealer}
					tilesSize={tilesSize}
					lastThrownId={lastThrown?.id}
				/>
			</div>
		);
	};

	const unusedTiles = useMemo(() => {
		return <UnusedTiles tiles={player.unusedTiles} segment={Segments.left} tag={frontBackTag} />;
	}, [player?.unusedTiles, frontBackTag]);

	const renderDiscardedTiles = () => {
		return (
			<DiscardedTiles
				className="vtss left discarded"
				tiles={player.discardedTiles}
				// tiles={[...player.hiddenTiles, ...player.discardedTiles]}
				segment={Segments.left}
				lastThrownId={lastThrown?.id}
			/>
		);
	};

	return (
		<div className={`column-section-${tilesSize || Sizes.medium}`}>
			{player?.showTiles ? shownHiddenHand : hiddenHand}
			{player?.shownTiles?.length > 0 && renderShownTiles()}
			{player?.unusedTiles > 0 && unusedTiles}
			{player?.discardedTiles?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default LeftPlayer;
