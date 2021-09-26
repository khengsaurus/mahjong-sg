import isEmpty from 'lodash.isempty';
import React, { useCallback, useContext, useMemo } from 'react';
import { FrontBackTag, IPlayerComponentProps, Segments, Sizes } from '../../global/enums';
import { AppContext } from '../../util/hooks/AppContext';
import { sortShownTiles } from '../../util/utilFns';
import DiscardedTiles from './DiscardedTiles';
import { HandTile } from './HandTile';
import UnusedTiles from './HiddenTiles/UnusedTiles';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';
import ShownTiles from './ShownTiles';

const BottomPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { tilesSize, handSize, selectedTiles, setSelectedTiles } = useContext(AppContext);
	const frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;

	// useMemo dependency -> flowers, nonFlowers, nonFlowerIds, flowerIds
	const shownCards = useMemo(() => {
		return player?.shownTiles?.map(tile => tile.id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player?.shownTiles?.length]);
	const { flowers, nonFlowers, nonFlowerIds, flowerIds } = useMemo(() => {
		return sortShownTiles(player.shownTiles);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shownCards]);

	// useMemo dependency -> hiddenCards
	const allHiddenTiles = player?.allHiddenTiles();
	const hiddenCards = useMemo(() => {
		return allHiddenTiles.map(tile => tile.uuid);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allHiddenTiles.length]);

	const selectedTilesIds = selectedTiles.map(tile => {
		return tile.id;
	});
	// console.log('Rendering bottom');

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
			<div className="htss shown">
				<ShownTiles
					nonFlowers={nonFlowers}
					// nonFlowers={player.hiddenTiles}
					flowers={flowers}
					flowerIds={flowerIds}
					nonFlowerIds={nonFlowerIds}
					// nonFlowerIds={player.hiddenTiles.map(tile => tile.id)}
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
			{renderShownTiles()}
			{unusedTiles}
			{renderDiscardedTiles()}
		</div>
	);
};

export default BottomPlayer;
