import isEmpty from 'lodash.isempty';
import React, { useCallback, useContext, useMemo } from 'react';
import { FrontBackTag, IPlayerComponentProps, Segments, Sizes } from '../../global/enums';
import { AppContext } from '../../util/hooks/AppContext';
import useTiles from '../../util/hooks/useTiles';
import { revealTile } from '../../util/utilFns';
import DiscardedTiles from '../Tiles/DiscardedTiles';
import { HandTile } from '../Tiles/HandTile';
import ShownTile from '../Tiles/ShownTile';
import ShownTiles from '../Tiles/ShownTiles';
import UnusedTiles from '../Tiles/UnusedTiles';
import './playerComponents.scss';

const BottomPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastT } = props;
	const { hiddenTiles, shownTiles, melds, discardedTiles, lastTakenTile, unusedTiles, showTiles } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];

	const { tilesSize, handSize, selectedTiles, setSelectedTiles, tileHashKey } = useContext(AppContext);
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
		(tile: IHiddenTile) => {
			if (!selectedTiles.map(tile => tile.ref).includes(tile.ref) && selectedTiles.length < 4) {
				setSelectedTiles([...selectedTiles, tile]);
			} else {
				setSelectedTiles(selectedTiles.filter(selectedTile => selectedTile.ref !== tile.ref));
			}
		},
		[selectedTiles, setSelectedTiles]
	);

	const shownHiddenHand = useMemo(() => {
		let revLTT = !isEmpty(lastTakenTile) ? revealTile(lastTakenTile, tileHashKey) : null;
		return (
			<div className="htss">
				{hiddenTiles.map((tile: IHiddenTile) => {
					let revT = revealTile(tile, tileHashKey);
					return <ShownTile key={revT.id} tileID={revT.id} tileCard={revT.card} segment={Segments.BOTTOM} />;
				})}
				{revLTT && (
					<ShownTile
						key={revLTT.id}
						tileID={revLTT.id}
						tileCard={revLTT.card}
						segment={Segments.BOTTOM}
						highlight
						// classSuffix="margin-left"
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenCards]);

	const hiddenHand = useCallback(() => {
		let revLTT = !isEmpty(lastTakenTile) ? revealTile(lastTakenTile, tileHashKey) : null;
		return (
			<div className={`self-hidden-tiles-${handSize || Sizes.MEDIUM}`}>
				{hiddenTiles.map((tile: IHiddenTile) => {
					let revealedTile = revealTile(tile, tileHashKey);
					return (
						<HandTile
							key={revealedTile.id}
							card={revealedTile.card}
							selected={selectedTiles.includes(revealedTile)}
							last={false}
							callback={() => selectTile(revealedTile)}
						/>
					);
				})}
				{revLTT && (
					<HandTile
						key={revLTT.id}
						card={revLTT.card}
						selected={selectedTiles.includes(revLTT)}
						last={true}
						callback={() => selectTile(revLTT)}
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
					lastThrownId={lastT?.id}
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
				lastThrownId={lastT?.id}
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
