import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
import { FrontBackTag, IPlayerComponentProps, Segments, Sizes } from '../../global/enums';
import { rotateShownTiles, sortShownTiles } from '../../util/utilFns';
import DiscardedTiles from './DiscardedTiles';
import HiddenHand from './HiddenTiles/HiddenHand';
import UnusedTiles from './HiddenTiles/UnusedTiles';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';
import ShownTiles from './ShownTiles';

const LeftPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, tilesSize } = props;
	let frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;
	// console.log('Rendering left');

	// useMemo dependency -> flowers, nonFlowers, nonFlowerIds, flowerIds
	const shownCards = useMemo(() => {
		return player?.shownTiles?.map(tile => tile.id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player?.shownTiles?.length]);
	const { flowers, nonFlowers, nonFlowerIds, flowerIds } = useMemo(() => {
		return sortShownTiles(player.shownTiles);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shownCards]);

	const rotatedNonFlowers = useMemo(() => {
		return rotateShownTiles(nonFlowers);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nonFlowerIds]);

	// useMemo dependency -> hiddenCards
	const allHiddenTiles = player?.allHiddenTiles();
	const hiddenCards = useMemo(() => {
		return allHiddenTiles.map(tile => tile.uuid);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allHiddenTiles.length]);

	const shownHiddenHand = useMemo(() => {
		return (
			<div className="vtss left">
				{player.hiddenTiles.map(tile => {
					return <ShownTile key={tile.id} tileID={tile.id} tileCard={tile.card} segment={Segments.left} />;
				})}
				{!isEmpty(player.lastTakenTile) && (
					<ShownTile
						key={player.lastTakenTile.id}
						tileID={player.lastTakenTile.id}
						tileCard={player.lastTakenTile.card}
						segment={Segments.left}
						classSuffix="margin-bottom"
						highlight
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenCards]);

	const hiddenHand = useMemo(() => {
		return <HiddenHand tiles={allHiddenTiles.length} segment={Segments.left} />;
	}, [allHiddenTiles.length]);

	const renderShownTiles = () => {
		return (
			<ShownTiles
				className="vtss left shown"
				nonFlowers={nonFlowers}
				// nonFlowers={player.hiddenTiles}
				flowers={flowers}
				flowerIds={flowerIds}
				nonFlowerIds={nonFlowerIds}
				// nonFlowerIds={player.hiddenTiles.map(tile => tile.id)}
				segment={Segments.left}
				dealer={dealer}
				tilesSize={tilesSize}
				lastThrownId={lastThrown?.id}
			/>
		);
	};

	const unusedTiles = useMemo(() => {
		return <UnusedTiles tiles={player.unusedTiles} segment={Segments.left} tag={frontBackTag} />;
	}, [player?.unusedTiles, frontBackTag]);

	const renderDiscardedTiles = () => {
		// {/* <DiscardedTiles className="vtss left discarded" tiles={player.discardedTiles} segment={Segments.left} lastThrownId={lastThrown?.id} /> */}
		return (
			<DiscardedTiles
				className="vtss left discarded"
				tiles={player.discardedTiles}
				// tiles={player.hiddenTiles}
				segment={Segments.left}
				lastThrownId={lastThrown?.id}
			/>
		);
	};

	return (
		<div className={`column-section-${tilesSize || Sizes.medium}`}>
			{player.showTiles ? shownHiddenHand : hiddenHand}
			{renderShownTiles()}
			{unusedTiles}
			{renderDiscardedTiles()}
		</div>
	);
};

export default LeftPlayer;
