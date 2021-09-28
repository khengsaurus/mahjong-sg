import isEmpty from 'lodash.isempty';
import React, { useEffect, useMemo, useRef } from 'react';
import {
	FrontBackTag,
	IPlayerComponentProps,
	Segments,
	ShownTileHeights,
	ShownTileWidths,
	Sizes
} from '../../global/enums';
import useTiles from '../../util/hooks/useTiles';
import { useWindowSize } from '../../util/hooks/useWindowSize';
import DiscardedTiles from './DiscardedTiles';
import HiddenHand from './HiddenTiles/HiddenHand';
import UnusedTiles from './HiddenTiles/UnusedTiles';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';
import ShownTiles from './ShownTiles';

const RightPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, tilesSize } = props;
	const allHiddenTiles = player?.allHiddenTiles() || [];
	const frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;
	const shownTilesRef = useRef(null);
	const { flowers, nonFlowers, nonFlowerIds, flowerIds, hiddenCards } = useTiles({
		shownTiles: player?.shownTiles,
		allHiddenTiles
	});
	const { height } = useWindowSize();
	useEffect(() => {
		let length = nonFlowers.length + flowers.length + Number(dealer);
		// let length = player.hiddenTiles.length + player.shownTiles.length + Number(dealer);
		let shownTilesHeight = shownTilesRef.current?.offsetHeight || 0;
		if (!!Number(length) && !!Number(shownTilesHeight) && shownTilesRef.current) {
			let reqHeight = length * ShownTileWidths[tilesSize];
			let cols = Math.ceil(reqHeight / shownTilesHeight);
			let toSet = `${cols * ShownTileHeights[tilesSize]}px`;
			shownTilesRef.current.style.width = toSet;
		}
	}, [height, nonFlowers.length, flowers.length, tilesSize, dealer]);

	const shownHiddenHand = useMemo(() => {
		return (
			<div className="vtss col-r">
				{player.hiddenTiles.map((tile: ITile) => {
					return <ShownTile key={tile.id} tileID={tile.id} tileCard={tile.card} segment={Segments.right} />;
				})}
				{!isEmpty(player.lastTakenTile) && (
					<ShownTile
						key={player.lastTakenTile.id}
						tileID={player.lastTakenTile.id}
						tileCard={player.lastTakenTile.card}
						segment={Segments.right}
						highlight
						classSuffix="margin-bottom"
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenCards]);

	const hiddenHand = useMemo(() => {
		return <HiddenHand tiles={allHiddenTiles.length} segment={Segments.right} />;
	}, [allHiddenTiles.length]);

	const renderShownTiles = () => {
		return (
			<div ref={shownTilesRef} id="right-shown" className="vtss">
				<ShownTiles
					nonFlowers={nonFlowers}
					// nonFlowers={[...player.hiddenTiles, ...nonFlowers]}
					flowers={flowers}
					flowerIds={flowerIds}
					nonFlowerIds={nonFlowerIds}
					segment={Segments.right}
					dealer={dealer}
					tilesSize={tilesSize}
					lastThrownId={lastThrown?.id}
				/>
			</div>
		);
	};

	const unusedTiles = useMemo(() => {
		return <UnusedTiles tiles={player.unusedTiles} segment={Segments.right} tag={frontBackTag} />;
	}, [player?.unusedTiles, frontBackTag]);

	const renderDiscardedTiles = () => {
		return (
			<DiscardedTiles
				className="vtss discarded"
				tiles={player.discardedTiles}
				// tiles={[...player.hiddenTiles, ...player.discardedTiles]}
				segment={Segments.right}
				lastThrownId={lastThrown?.id}
			/>
		);
	};

	return (
		<div className={`column-section-${tilesSize || Sizes.medium} right`}>
			{player.showTiles ? shownHiddenHand : hiddenHand}
			{renderShownTiles()}
			{unusedTiles}
			{renderDiscardedTiles()}
		</div>
	);
};

export default RightPlayer;
