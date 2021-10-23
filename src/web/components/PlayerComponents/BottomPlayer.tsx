import isEmpty from 'lodash.isempty';
import React, { useCallback, useContext, useMemo } from 'react';
import { FrontBackTag, Segments, Sizes } from 'shared/enums';
import { AppContext } from 'shared/hooks/AppContext';
import useTiles from 'shared/hooks/useTiles';
import { revealTile } from 'shared/util';
import { DiscardedTiles, HandTile, ShownTile, ShownTiles, UnusedTiles } from 'web/components/Tiles';
import './playerComponents.scss';

const BottomPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, melds, dTs, lTaken, uTs, sT } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];

	const { tilesSize, handSize, selectedTiles, setSelectedTiles, tileHashKey } = useContext(AppContext);
	const selectedTilesIds = selectedTiles.map(tile => {
		return tile.id;
	});
	const { flowers, nonFlowers, nonFlowerIds, flowerIds, hiddenCards } = useTiles({
		sTs,
		allHiddenTiles,
		melds,
		toRotate: false
	});

	const selectTile = useCallback(
		(tile: IShownTile) => {
			if (!selectedTiles.map(tile => tile.ref).includes(tile.ref) && selectedTiles.length < 4) {
				setSelectedTiles([...selectedTiles, tile]);
			} else {
				setSelectedTiles(selectedTiles.filter(selectedTile => selectedTile.ref !== tile.ref));
			}
		},
		[selectedTiles, setSelectedTiles]
	);

	const shownHiddenHand = useMemo(() => {
		let revLTT: IShownTile = !isEmpty(lTaken) ? (lTaken.ix === 0 ? revealTile(lTaken, tileHashKey) : lTaken) : null;
		return (
			<div className="htss">
				{hTs.map((tile: IHiddenTile) => {
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
						classSuffix="margin-left"
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenCards]);

	const hiddenHand = useCallback(() => {
		let selectedTilesRef = selectedTiles.map(tile => tile.ref);
		let revLTT = !isEmpty(lTaken) ? revealTile(lTaken, tileHashKey) : null;
		return (
			<div className={`self-hidden-tiles-${handSize || Sizes.MEDIUM}`}>
				{hTs.map((tile: IHiddenTile) => {
					let revealedTile = revealTile(tile, tileHashKey);
					return (
						<HandTile
							key={revealedTile.id}
							card={revealedTile.card}
							selected={selectedTilesRef.includes(revealedTile.ref)}
							last={false}
							callback={() => selectTile(revealedTile)}
						/>
					);
				})}
				{revLTT && (
					<HandTile
						key={revLTT.id}
						card={revLTT.card}
						selected={selectedTilesRef.includes(revLTT.ref)}
						last={true}
						callback={() => selectTile(revLTT)}
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectTile, handSize, hiddenCards, sT, selectedTilesIds]);

	const renderShownTiles = () => {
		return (
			<div id="bottom-shown" className="htss">
				<ShownTiles
					nonFlowers={nonFlowers}
					// nonFlowers={[...hTs, ...nonFlowers]}
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
		return <UnusedTiles tiles={uTs} segment={Segments.BOTTOM} tag={frontBackTag} />;
	}, [uTs, frontBackTag]);

	const renderDiscardedTiles = () => {
		return (
			<DiscardedTiles
				className="htss discarded"
				tiles={dTs}
				// tiles={[...hTs, ...dTs]}
				segment={Segments.BOTTOM}
				lastThrownId={lastThrown?.id}
			/>
		);
	};

	return (
		<div className={`row-section-${tilesSize || Sizes.MEDIUM} bottom`}>
			{player.sT ? shownHiddenHand : hiddenHand()}
			{sTs?.length > 0 && renderShownTiles()}
			{uTs > 0 && renderUnusedTiles}
			{dTs?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default BottomPlayer;
