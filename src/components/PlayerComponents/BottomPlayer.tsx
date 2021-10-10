import isEmpty from 'lodash.isempty';
import React, { useCallback, useContext, useMemo } from 'react';
import { FrontBackTag, IPlayerComponentProps, Segments, Sizes } from '../../global/enums';
import { AppContext } from '../../util/hooks/AppContext';
import useTiles from '../../util/hooks/useTiles';
import DiscardedTiles from '../Tiles/DiscardedTiles';
import { HandTile } from '../Tiles/HandTile';
import ShownTile from '../Tiles/ShownTile';
import ShownTiles from '../Tiles/ShownTiles';
import UnusedTiles from '../Tiles/UnusedTiles';
import './playerComponents.scss';

const BottomPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hiddenTiles, shownTiles, melds, discardedTiles, lastTakenTile, unusedTiles, showTiles } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];

	const { tilesSize, handSize, selectedTiles, setSelectedTiles } = useContext(AppContext);
	const selectedTilesIds = selectedTiles.map(tile => {
		return tile.id;
	});
	const { flowers, nonFlowers, nonFlowerIds, flowerIds, hiddenCards } = useTiles({
		shownTiles,
		allHiddenTiles,
		melds,
		toRotate: false
	});

	const selectTile = useCallback(
		(tile: ITile) => {
			if (!selectedTiles.includes(tile) && selectedTiles.length < 4) {
				setSelectedTiles([...selectedTiles, tile]);
			} else {
				setSelectedTiles(selectedTiles.filter(selectedTile => selectedTile.id !== tile.id));
			}
		},
		[selectedTiles, setSelectedTiles]
	);

	const shownHiddenHand = useMemo(() => {
		return (
			<div className="htss">
				{hiddenTiles.map((tile: ITile) => {
					return <ShownTile key={tile.id} tileID={tile.id} tileCard={tile.card} segment={Segments.BOTTOM} />;
				})}
				{!isEmpty(lastTakenTile) && (
					<ShownTile
						key={lastTakenTile.id}
						tileID={lastTakenTile.id}
						tileCard={lastTakenTile.card}
						segment={Segments.BOTTOM}
						highlight
						classSuffix="margin-left"
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenCards]);

	const hiddenHand = useCallback(() => {
		return (
			<div className={`self-hidden-tiles-${handSize || Sizes.MEDIUM}`}>
				{hiddenTiles.map((tile: ITile) => {
					return (
						<HandTile
							key={tile.uuid}
							card={tile.card}
							selected={selectedTiles.includes(tile)}
							last={false}
							callback={() => selectTile(tile)}
						/>
					);
				})}
				{!isEmpty(lastTakenTile) && (
					<HandTile
						key={lastTakenTile.uuid}
						card={lastTakenTile.card}
						selected={selectedTiles.includes(lastTakenTile)}
						last={true}
						callback={() => selectTile(lastTakenTile)}
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectTile, handSize, hiddenCards, showTiles, selectedTilesIds]);

	const renderShownTiles = () => {
		return (
			<div id="bottom-shown" className="htss">
				<ShownTiles
					nonFlowers={nonFlowers}
					// nonFlowers={[...hiddenTiles, ...nonFlowers]}
					flowers={flowers}
					flowerIds={flowerIds}
					nonFlowerIds={nonFlowerIds}
					segment={Segments.BOTTOM}
					dealer={dealer}
					tilesSize={tilesSize}
					lastThrownId={lastThrown?.id}
				/>
			</div>
		);
	};

	const renderUnusedTiles = useMemo(() => {
		return <UnusedTiles tiles={unusedTiles} segment={Segments.BOTTOM} tag={frontBackTag} />;
	}, [unusedTiles, frontBackTag]);

	const renderDiscardedTiles = () => {
		return (
			<DiscardedTiles
				className="htss discarded"
				tiles={discardedTiles}
				// tiles={[...hiddenTiles, ...discardedTiles]}
				segment={Segments.BOTTOM}
				lastThrownId={lastThrown?.id}
			/>
		);
	};

	return (
		<div className={`row-section-${tilesSize || Sizes.MEDIUM} bottom`}>
			{player.showTiles ? shownHiddenHand : hiddenHand()}
			{shownTiles?.length > 0 && renderShownTiles()}
			{unusedTiles > 0 && renderUnusedTiles}
			{discardedTiles?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default BottomPlayer;
