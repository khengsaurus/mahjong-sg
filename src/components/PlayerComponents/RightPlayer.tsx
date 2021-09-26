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

const RightPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, tilesSize } = props;
	const frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;
	// console.log('Rendering right');

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
			<div className="vtss shown">
				<ShownTiles
					nonFlowers={rotatedNonFlowers}
					// nonFlowers={player.hiddenTiles}
					flowers={flowers}
					flowerIds={flowerIds}
					nonFlowerIds={nonFlowerIds}
					// nonFlowerIds={player.hiddenTiles.map(tile => tile.id)}
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
