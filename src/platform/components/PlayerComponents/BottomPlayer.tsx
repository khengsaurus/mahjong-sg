import isEmpty from 'lodash.isempty';
import { DiscardedTiles, HandTile, ShownTile, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import { useCallback, useContext, useMemo } from 'react';
import { FrontBackTag, Segment, Size } from 'shared/enums';
import { AppContext, useTiles } from 'shared/hooks';
import { IPlayerComponentProps } from 'shared/typesPlus';
import { getCardFromHashId, revealTile } from 'shared/util';
import './playerComponents.scss';

const BottomPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];
	const htsRefs = JSON.stringify(hTs.map(t => t.r));

	const { tilesSize, handSize, selectedTiles, setSelectedTiles, tileHashKey } = useContext(AppContext);
	const { flowers, nonFlowers, nonFlowerRefs, flowerRefs } = useTiles({
		sTs,
		allHiddenTiles,
		ms,
		toRotate: false
	});

	const selectTile = useCallback(
		tile => {
			if (!selectedTiles.map(tile => tile.r).includes(tile.r) && selectedTiles.length < 4) {
				setSelectedTiles([...selectedTiles, tile]);
			} else {
				setSelectedTiles(selectedTiles.filter(selectedTile => selectedTile.r !== tile.r));
			}
		},
		[selectedTiles, setSelectedTiles]
	);

	const shownHiddenHand = useMemo(() => {
		let revLTT: IShownTile = Number(lTa?.r) ? (lTa?.x === 0 ? revealTile(lTa, tileHashKey) : lTa) : null;
		return (
			<div className="htss">
				{hTs.map((tile: IHiddenTile) => {
					let revC = getCardFromHashId(tile.i, tileHashKey);
					return <ShownTile key={tile.i} tileRef={tile.r} tileCard={revC} segment={Segment.BOTTOM} />;
				})}
				{revLTT && (
					<ShownTile
						key={revLTT.i}
						tileRef={revLTT.r}
						tileCard={revLTT.c}
						segment={Segment.BOTTOM}
						highlight
						classSuffix="margin-left"
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lTa?.r, lTa?.x, tileHashKey, htsRefs]);

	const renderHiddenHand = () => {
		let selectedTilesRef = selectedTiles.map(tile => tile.r);
		let revLTT = !isEmpty(lTa) ? revealTile(lTa, tileHashKey) : null;
		return (
			<div className={`self-hidden-tiles-${handSize || Size.MEDIUM}`}>
				{hTs.map((tile: IHiddenTile) => {
					let revealedTile = revealTile(tile, tileHashKey);
					return (
						<HandTile
							key={revealedTile.i}
							card={revealedTile.c}
							selected={selectedTilesRef.includes(revealedTile.r)}
							last={false}
							callback={() => selectTile(revealedTile)}
						/>
					);
				})}
				{revLTT && (
					<HandTile
						key={revLTT.i}
						card={revLTT.c}
						selected={selectedTilesRef.includes(revLTT.r)}
						last={true}
						callback={() => selectTile(revLTT)}
					/>
				)}
			</div>
		);
	};

	const renderShownTiles = () => (
		<ShownTiles
			className="htss"
			nonFlowers={nonFlowers}
			// nonFlowers={[...hTs, ...nonFlowers]}
			flowers={flowers}
			flowerRefs={flowerRefs}
			nonFlowerRefs={nonFlowerRefs}
			segment={Segment.BOTTOM}
			dealer={dealer}
			tilesSize={tilesSize}
			lastThrownRef={lastThrown?.r}
		/>
	);

	const renderDiscardedTiles = () => (
		<DiscardedTiles
			className="htss discarded"
			tiles={dTs}
			// tiles={[...hTs, ...dTs]}
			segment={Segment.BOTTOM}
			lastThrownRef={lastThrown?.r}
		/>
	);

	return (
		<div className={`row-section-${tilesSize || Size.MEDIUM} bottom`}>
			{sT ? shownHiddenHand : renderHiddenHand()}
			{sTs?.length > 0 && renderShownTiles()}
			{uTs > 0 && <UnusedTiles tiles={uTs} segment={Segment.BOTTOM} tag={frontBackTag} />}
			{dTs?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default BottomPlayer;
