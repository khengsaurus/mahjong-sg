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
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';

const BottomPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const allHiddenTiles = player?.allHiddenTiles() || [];
	const frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;

	const { tilesSize, handSize, selectedTiles, setSelectedTiles } = useContext(AppContext);
	const selectedTilesIds = selectedTiles.map(tile => {
		return tile.id;
	});
	const { flowers, nonFlowers, nonFlowerIds, flowerIds, hiddenCards } = useTiles({
		shownTiles: player?.shownTiles,
		allHiddenTiles,
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
				{player.hiddenTiles.map((tile: ITile) => {
					return <ShownTile key={tile.id} tileID={tile.id} tileCard={tile.card} segment={Segments.bottom} />;
				})}
				{!isEmpty(player.lastTakenTile) && (
					<ShownTile
						key={player.lastTakenTile.id}
						tileID={player.lastTakenTile.id}
						tileCard={player.lastTakenTile.card}
						segment={Segments.bottom}
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
			<div className={`self-hidden-tiles-${handSize || Sizes.medium}`}>
				{player.hiddenTiles.map((tile: ITile) => {
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
				{!isEmpty(player.lastTakenTile) && (
					<HandTile
						key={player.lastTakenTile.uuid}
						card={player.lastTakenTile.card}
						selected={selectedTiles.includes(player.lastTakenTile)}
						last={true}
						callback={() => selectTile(player.lastTakenTile)}
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectTile, handSize, hiddenCards, player.showTiles, selectedTilesIds]);

	const renderShownTiles = () => {
		return (
			<div id="bottom-shown" className="htss">
				<ShownTiles
					nonFlowers={nonFlowers}
					// nonFlowers={[...player.hiddenTiles, ...nonFlowers]}
					flowers={flowers}
					flowerIds={flowerIds}
					nonFlowerIds={nonFlowerIds}
					segment={Segments.bottom}
					dealer={dealer}
					tilesSize={tilesSize}
					lastThrownId={lastThrown?.id}
				/>
			</div>
		);
	};

	const unusedTiles = useMemo(() => {
		return <UnusedTiles tiles={player.unusedTiles} segment={Segments.bottom} tag={frontBackTag} />;
	}, [player?.unusedTiles, frontBackTag]);

	const renderDiscardedTiles = () => {
		return (
			<DiscardedTiles
				className="htss discarded"
				tiles={player.discardedTiles}
				// tiles={[...player.hiddenTiles, ...player.discardedTiles]}
				segment={Segments.bottom}
				lastThrownId={lastThrown?.id}
			/>
		);
	};

	return (
		<div className={`row-section-${tilesSize || Sizes.medium} bottom`}>
			{player.showTiles ? shownHiddenHand : hiddenHand()}
			{player?.shownTiles?.length > 0 && renderShownTiles()}
			{player?.unusedTiles > 0 && unusedTiles}
			{player?.discardedTiles?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default BottomPlayer;
