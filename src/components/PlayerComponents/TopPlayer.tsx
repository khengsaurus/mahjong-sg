import CasinoIcon from '@material-ui/icons/Casino';
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

const TopPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, tilesSize } = props;
	const frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;
	// console.log('Rendering top');

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

	const renderShownHiddenHand = useMemo(() => {
		return (
			<div className="htss top">
				{player.hiddenTiles.map((tile: ITile) => {
					return <ShownTile key={tile.id} tileID={tile.id} tileCard={tile.card} segment={Segments.top} />;
				})}
				{!isEmpty(player.lastTakenTile) && (
					<ShownTile
						key={player.lastTakenTile.id}
						tileID={player.lastTakenTile.id}
						tileCard={player.lastTakenTile.card}
						segment={Segments.top}
						highlight
						classSuffix="margin-right"
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenCards]);

	const renderHiddenHand = useMemo(() => {
		return <HiddenHand tiles={allHiddenTiles.length} segment={Segments.top} />;
	}, [allHiddenTiles.length]);

	const renderShownTiles = () => {
		return (
			<div className="htss top">
				<ShownTiles
					nonFlowers={rotatedNonFlowers}
					flowers={flowers}
					flowerIds={flowerIds}
					nonFlowerIds={nonFlowerIds}
					segment={Segments.top}
					lastThrownId={lastThrown?.id}
				/>
				{dealer && <CasinoIcon color="disabled" fontSize={tilesSize} />}
			</div>
		);
	};

	const renderUnusedTiles = useMemo(() => {
		return <UnusedTiles tiles={player.unusedTiles} segment={Segments.top} tag={frontBackTag} />;
	}, [player?.unusedTiles, frontBackTag]);

	const renderDiscardedTiles = () => {
		return (
			<div className="vtss left">
				<DiscardedTiles tiles={player.discardedTiles} segment={Segments.top} lastThrownId={lastThrown?.id} />
			</div>
		);
	};

	return (
		<div className={`row-section-${tilesSize || Sizes.medium}`}>
			{player.showTiles ? renderShownHiddenHand : renderHiddenHand}
			{renderShownTiles()}
			{renderUnusedTiles}
			{renderDiscardedTiles()}
		</div>
	);
};

export default TopPlayer;
