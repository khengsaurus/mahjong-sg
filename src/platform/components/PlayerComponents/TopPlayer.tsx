import isEmpty from 'lodash.isempty';
import { DiscardedTiles, HiddenHand, ShownTile, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AppFlag, FrontBackTag, Segment, Size } from 'shared/enums';
import { useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { IPlayerComponentProps } from 'shared/typesPlus';
import { revealTile } from 'shared/util';
import './playerComponents.scss';

const TopPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];
	const {
		sizes: { tileSize = Size.MEDIUM },
		tHK
	} = useSelector((state: IStore) => state);
	const { flowers, nonFlowers, nonFlowerRefs, flowerRefs, hiddenTileIds } = useTiles({
		sTs,
		ms,
		allHiddenTiles
	});

	const shownHiddenHand = useMemo(() => {
		const revLTT: IShownTile = !isEmpty(lTa) ? (!Number(lTa?.x) ? revealTile(lTa, tHK) : lTa) : null;
		return (
			<div className="htss top">
				{hTs.map((tile: IHiddenTile) => {
					const revT = revealTile(tile, tHK);
					return <ShownTile key={revT.i} tileRef={tile.r} tileCard={revT.c} segment={Segment.TOP} />;
				})}
				{revLTT && (
					<ShownTile
						key={revLTT.i}
						tileRef={lTa.r}
						tileCard={revLTT.c}
						segment={Segment.TOP}
						highlight
						classSuffix="margin-right"
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tHK, hiddenTileIds]);

	const renderShownTiles = () => (
		<ShownTiles
			className="htss top"
			nonFlowers={nonFlowers}
			// nonFlowers={[...hTs, ...nonFlowers]}
			flowers={flowers}
			flowerRefs={flowerRefs}
			nonFlowerRefs={nonFlowerRefs}
			segment={Segment.TOP}
			dealer={dealer}
			tileSize={tileSize}
			lastThrownRef={lastThrown?.r}
		/>
	);

	const renderDiscardedTiles = () => (
		<DiscardedTiles
			className="htss top discarded"
			tiles={dTs}
			// tiles={[...hTs, ...dTs]}
			segment={Segment.TOP}
			lastThrownRef={lastThrown?.r}
		/>
	);

	return (
		<div className={`row-section-${tileSize || Size.MEDIUM}`}>
			{/* {shownHiddenHand} */}
			{process.env.REACT_APP_FLAG.startsWith(AppFlag.DEV_BOT) ? (
				shownHiddenHand
			) : sT ? (
				shownHiddenHand
			) : (
				<HiddenHand tiles={allHiddenTiles.length} segment={Segment.TOP} />
			)}
			{sTs?.length > 0 && renderShownTiles()}
			{uTs > 0 && <UnusedTiles tiles={uTs} segment={Segment.TOP} tag={frontBackTag} />}
			{dTs?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default TopPlayer;
