import isEmpty from 'lodash.isempty';
import { DiscardedTiles, HiddenHand, ShownTile, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import { useContext, useMemo } from 'react';
import { FrontBackTag, Segment, Size } from 'shared/enums';
import { AppContext, useTiles } from 'shared/hooks';
import { revealTile } from 'shared/util';
import './playerComponents.scss';

const TopPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];
	const { tilesSize, tileHashKey } = useContext(AppContext);
	const { flowers, nonFlowers, nonFlowerIds, flowerIds, hiddenCards } = useTiles({
		sTs,
		ms,
		allHiddenTiles
	});

	const shownHiddenHand = useMemo(() => {
		let revLTT: IShownTile = !isEmpty(lTa) ? (lTa.ix === 0 ? revealTile(lTa, tileHashKey) : lTa) : null;
		return (
			<div className="htss top">
				{hTs.map((tile: IHiddenTile) => {
					let revT = revealTile(tile, tileHashKey);
					return <ShownTile key={revT.id} tileID={revT.id} tileCard={revT.c} segment={Segment.TOP} />;
				})}
				{revLTT && (
					<ShownTile
						key={revLTT.id}
						tileID={revLTT.id}
						tileCard={revLTT.c}
						segment={Segment.TOP}
						highlight
						classSuffix="margin-right"
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenCards]);

	const renderShownTiles = () => (
		<ShownTiles
			className="htss top"
			nonFlowers={nonFlowers}
			// nonFlowers={[...hTs, ...nonFlowers]}
			flowers={flowers}
			flowerIds={flowerIds}
			nonFlowerIds={nonFlowerIds}
			segment={Segment.TOP}
			dealer={dealer}
			tilesSize={tilesSize}
			lastThrownId={lastThrown?.id}
		/>
	);

	const renderDiscardedTiles = () => (
		<DiscardedTiles
			className="htss top discarded"
			tiles={dTs}
			// tiles={[...hTs, ...dTs]}
			segment={Segment.TOP}
			lastThrownId={lastThrown?.id}
		/>
	);

	return (
		<div className={`row-section-${tilesSize || Size.MEDIUM}`}>
			{sT ? shownHiddenHand : <HiddenHand tiles={allHiddenTiles.length} segment={Segment.TOP} />}
			{sTs?.length > 0 && renderShownTiles()}
			{uTs > 0 && <UnusedTiles tiles={uTs} segment={Segment.TOP} tag={frontBackTag} />}
			{dTs?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default TopPlayer;
