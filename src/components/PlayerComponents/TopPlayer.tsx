import isEmpty from 'lodash.isempty';
import React, { useContext, useMemo } from 'react';
import { FrontBackTag, IPlayerComponentProps, Segments, Sizes } from '../../global/enums';
import { AppContext } from '../../util/hooks/AppContext';
import useTiles from '../../util/hooks/useTiles';
import { revealTile } from '../../util/utilFns';
import DiscardedTiles from '../Tiles/DiscardedTiles';
import HiddenHand from '../Tiles/HiddenHand';
import ShownTile from '../Tiles/ShownTile';
import ShownTiles from '../Tiles/ShownTiles';
import UnusedTiles from '../Tiles/UnusedTiles';
import './playerComponents.scss';

const TopPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, melds, dTs, lTaken, uTs, sT } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];

	const { tilesSize, tileHashKey } = useContext(AppContext);
	const { flowers, nonFlowers, nonFlowerIds, flowerIds, hiddenCards } = useTiles({
		sTs,
		melds,
		allHiddenTiles
	});

	const shownHiddenHand = useMemo(() => {
		let revLTT: IShownTile = !isEmpty(lTaken) ? (lTaken.ix === 0 ? revealTile(lTaken, tileHashKey) : lTaken) : null;
		return (
			<div className="htss top">
				{hTs.map((tile: IHiddenTile) => {
					let revT = revealTile(tile, tileHashKey);
					return <ShownTile key={revT.id} tileID={revT.id} tileCard={revT.card} segment={Segments.TOP} />;
				})}
				{revLTT && (
					<ShownTile
						key={revLTT.id}
						tileID={revLTT.id}
						tileCard={revLTT.card}
						segment={Segments.TOP}
						highlight
						classSuffix="margin-right"
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenCards]);

	const hiddenHand = useMemo(() => {
		return <HiddenHand tiles={allHiddenTiles.length} segment={Segments.TOP} />;
	}, [allHiddenTiles.length]);

	const renderShownTiles = () => {
		return (
			<div id="top-shown" className="htss top">
				<ShownTiles
					nonFlowers={nonFlowers}
					// nonFlowers={[...hTs, ...nonFlowers]}
					flowers={flowers}
					flowerIds={flowerIds}
					nonFlowerIds={nonFlowerIds}
					segment={Segments.TOP}
					dealer={dealer}
					tilesSize={tilesSize}
					lastThrownId={lastThrown?.id}
				/>
			</div>
		);
	};

	const renderUnusedTiles = useMemo(() => {
		return <UnusedTiles tiles={uTs} segment={Segments.TOP} tag={frontBackTag} />;
	}, [uTs, frontBackTag]);

	const renderDiscardedTiles = () => {
		return (
			<DiscardedTiles
				className="htss top discarded"
				tiles={dTs}
				// tiles={[...hTs, ...dTs]}
				segment={Segments.TOP}
				lastThrownId={lastThrown?.id}
			/>
		);
	};

	return (
		<div className={`row-section-${tilesSize || Sizes.MEDIUM}`}>
			{sT ? shownHiddenHand : hiddenHand}
			{sTs?.length > 0 && renderShownTiles()}
			{uTs > 0 && renderUnusedTiles}
			{dTs?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default TopPlayer;
