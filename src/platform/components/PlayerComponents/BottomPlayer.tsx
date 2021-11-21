import isEmpty from 'lodash.isempty';
import { DiscardedTiles, HandTile, ShownTile, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import { useCallback, useContext, useMemo } from 'react';
import { FrontBackTag, Segment, Size } from 'shared/enums';
import { AppContext, useTiles } from 'shared/hooks';
import { revealTile } from 'shared/util';
import './playerComponents.scss';

const BottomPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];

	const { tilesSize, handSize, selectedTiles, setSelectedTiles, tileHashKey } = useContext(AppContext);
	const selectedTilesIds = selectedTiles.map(tile => tile.id);
	const { flowers, nonFlowers, nonFlowerIds, flowerIds, hiddenCards } = useTiles({
		sTs,
		allHiddenTiles,
		ms,
		toRotate: false
	});

	const selectTile = useCallback(
		(tile: IShownTile) => {
			if (!selectedTiles.map(tile => tile.r).includes(tile.r) && selectedTiles.length < 4) {
				setSelectedTiles([...selectedTiles, tile]);
			} else {
				setSelectedTiles(selectedTiles.filter(selectedTile => selectedTile.r !== tile.r));
			}
		},
		[selectedTiles, setSelectedTiles]
	);

	const shownHiddenHand = useMemo(() => {
		let revLTT: IShownTile = !isEmpty(lTa) ? (lTa.ix === 0 ? revealTile(lTa, tileHashKey) : lTa) : null;
		return (
			<div className="htss">
				{hTs.map((tile: IHiddenTile) => {
					let revT = revealTile(tile, tileHashKey);
					return <ShownTile key={revT.id} tileID={revT.id} tileCard={revT.c} segment={Segment.BOTTOM} />;
				})}
				{revLTT && (
					<ShownTile
						key={revLTT.id}
						tileID={revLTT.id}
						tileCard={revLTT.c}
						segment={Segment.BOTTOM}
						highlight
						classSuffix="margin-left"
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenCards]);

	const hiddenHand = useCallback(() => {
		let selectedTilesRef = selectedTiles.map(tile => tile.r);
		let revLTT = !isEmpty(lTa) ? revealTile(lTa, tileHashKey) : null;
		return (
			<div className={`self-hidden-tiles-${handSize || Size.MEDIUM}`}>
				{hTs.map((tile: IHiddenTile) => {
					let revealedTile = revealTile(tile, tileHashKey);
					return (
						<HandTile
							key={revealedTile.id}
							card={revealedTile.c}
							selected={selectedTilesRef.includes(revealedTile.r)}
							last={false}
							callback={() => selectTile(revealedTile)}
						/>
					);
				})}
				{revLTT && (
					<HandTile
						key={revLTT.id}
						card={revLTT.c}
						selected={selectedTilesRef.includes(revLTT.r)}
						last={true}
						callback={() => selectTile(revLTT)}
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectTile, handSize, hiddenCards, sT, selectedTilesIds]);

	const renderShownTiles = () => (
		<ShownTiles
			className="htss"
			nonFlowers={nonFlowers}
			// nonFlowers={[...hTs, ...nonFlowers]}
			flowers={flowers}
			flowerIds={flowerIds}
			nonFlowerIds={nonFlowerIds}
			segment={Segment.BOTTOM}
			dealer={dealer}
			tilesSize={tilesSize}
			lastThrownId={lastThrown?.id}
		/>
	);

	const renderDiscardedTiles = () => (
		<DiscardedTiles
			className="htss discarded"
			tiles={dTs}
			// tiles={[...hTs, ...dTs]}
			segment={Segment.BOTTOM}
			lastThrownId={lastThrown?.id}
		/>
	);

	return (
		<div className={`row-section-${tilesSize || Size.MEDIUM} bottom`}>
			{player.sT ? shownHiddenHand : hiddenHand()}
			{sTs?.length > 0 && renderShownTiles()}
			{uTs > 0 && <UnusedTiles tiles={uTs} segment={Segment.BOTTOM} tag={frontBackTag} />}
			{dTs?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default BottomPlayer;
