import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
import { FrontBackTag, IPlayerComponentProps, Segments, Sizes } from '../../global/enums';
import useTiles from '../../util/hooks/useTiles';
import DiscardedTiles from '../Tiles/DiscardedTiles';
import HiddenHand from '../Tiles/HiddenHand';
import ShownTile from '../Tiles/ShownTile';
import ShownTiles from '../Tiles/ShownTiles';
import UnusedTiles from '../Tiles/UnusedTiles';
import './playerComponents.scss';

const TopPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, tilesSize } = props;
	const { hiddenTiles, shownTiles, melds, discardedTiles, lastTakenTile, unusedTiles, showTiles } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];

	const { flowers, nonFlowers, nonFlowerIds, flowerIds, hiddenCards } = useTiles({
		shownTiles,
		melds,
		allHiddenTiles
	});

	const shownHiddenHand = useMemo(() => {
		return (
			<div className="htss top">
				{hiddenTiles.map((tile: ITile) => {
					return <ShownTile key={tile.id} tileID={tile.id} tileCard={tile.card} segment={Segments.TOP} />;
				})}
				{!isEmpty(lastTakenTile) && (
					<ShownTile
						key={lastTakenTile.id}
						tileID={lastTakenTile.id}
						tileCard={lastTakenTile.card}
						segment={Segments.TOP}
						highlight
						// classSuffix="margin-right"
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenCards]);

	const hiddenHand = useMemo(() => {
		return <HiddenHand tiles={allHiddenTiles.length} segment={Segments.TOP} />;
	}, [allHiddenTiles.length]);

	const renderShownTiles = () => {
		return (
			<div id="top-shown" className="htss top">
				<ShownTiles
					nonFlowers={nonFlowers}
					// nonFlowers={[...hiddenTiles, ...nonFlowers]}
					flowers={flowers}
					flowerIds={flowerIds}
					nonFlowerIds={nonFlowerIds}
					segment={Segments.TOP}
					dealer={dealer}
					tilesSize={tilesSize}
					lastThrownId={lastThrown?.id}
				/>
			</div>
		);
	};

	const renderUnusedTiles = useMemo(() => {
		return <UnusedTiles tiles={unusedTiles} segment={Segments.TOP} tag={frontBackTag} />;
	}, [unusedTiles, frontBackTag]);

	const renderDiscardedTiles = () => {
		return (
			<DiscardedTiles
				className="htss top discarded"
				tiles={discardedTiles}
				// tiles={[...hiddenTiles, ...discardedTiles]}
				segment={Segments.TOP}
				lastThrownId={lastThrown?.id}
			/>
		);
	};

	return (
		<div className={`row-section-${tilesSize || Sizes.MEDIUM}`}>
			{showTiles ? shownHiddenHand : hiddenHand}
			{shownTiles?.length > 0 && renderShownTiles()}
			{unusedTiles > 0 && renderUnusedTiles}
			{discardedTiles?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default TopPlayer;
