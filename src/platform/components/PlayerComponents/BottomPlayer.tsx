import isEmpty from 'lodash.isempty';
import { DiscardedTiles, HandTile, ShownTile, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { FrontBackTag, Segment, Size } from 'shared/enums';
import { AppContext, useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { IPlayerComponentProps } from 'shared/typesPlus';
import { getCardFromHashId, revealTile, triggerHaptic } from 'shared/util';
import './playerComponents.scss';

const BottomPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];

	const { selectedTiles, setSelectedTiles } = useContext(AppContext);
	const {
		sizes: { tileSize, handSize },
		tHK
	} = useSelector((state: IStore) => state);
	const { flowers, nonFlowers, nonFlowerRefs, flowerRefs } = useTiles({
		sTs,
		allHiddenTiles,
		ms,
		toRotate: false
	});
	const selectedTilesRef = selectedTiles.map(tile => tile.r);

	const selectTile = useCallback(
		tile => {
			triggerHaptic();
			if (!selectedTiles.map(tile => tile.r).includes(tile.r) && selectedTiles.length < 4) {
				setSelectedTiles([...selectedTiles, tile]);
			} else {
				setSelectedTiles(selectedTiles.filter(selectedTile => selectedTile.r !== tile.r));
			}
		},
		[selectedTiles, setSelectedTiles]
	);

	const shownHiddenHand = useCallback(
		(hTs: IHiddenTile[], lTa: IShownTile | IHiddenTile) => {
			const revLTT: IShownTile = !isEmpty(lTa) ? (!Number(lTa?.x) ? revealTile(lTa, tHK) : lTa) : null;
			return (
				<div className="htss">
					{hTs.map((tile: IHiddenTile) => {
						const revC = getCardFromHashId(tile.i, tHK);
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
		},
		[tHK]
	);

	const hiddenHand = useCallback(
		(hTs: IHiddenTile[], lTa: IHiddenTile) => {
			const revLTT = !isEmpty(lTa) ? revealTile(lTa, tHK) : null;
			return (
				<div className={`self-hidden-tiles-${handSize || Size.MEDIUM}`}>
					{hTs.map((tile: IHiddenTile) => {
						const revealedTile = revealTile(tile, tHK);
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
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[JSON.stringify(selectedTilesRef), handSize, tHK]
	);

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
			tileSize={tileSize}
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
		<div className={`row-section-${tileSize || Size.MEDIUM} bottom`}>
			{sT ? shownHiddenHand(hTs, lTa) : hiddenHand(hTs, lTa)}
			{sTs?.length > 0 && renderShownTiles()}
			{uTs > 0 && <UnusedTiles tiles={uTs} segment={Segment.BOTTOM} tag={frontBackTag} />}
			{dTs?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default BottomPlayer;
