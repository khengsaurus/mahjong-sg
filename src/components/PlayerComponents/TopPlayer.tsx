import CasinoIcon from '@material-ui/icons/Casino';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useMemo } from 'react';
import { FrontBackTag, IPlayerComponentProps, Segments, Sizes } from '../../global/enums';
import { rotateShownTiles, sortShownTiles } from '../../util/utilFns';
import HiddenHand from './HiddenTiles/HiddenHand';
import UnusedTiles from './HiddenTiles/UnusedTiles';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';

const TopPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, tilesSize } = props;
	const frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;
	const sumHiddenTiles = player.countAllHiddenTiles();
	const sumShownTiles = player.shownTiles.length;
	const sumDiscardedTiles = player.discardedTiles.length;
	// console.log('Rendering top');

	const { flowers, nonFlowers } = useMemo(() => {
		return sortShownTiles(player.shownTiles);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player.shownTiles.length]);

	const rotatedNonFlowers = useMemo(() => {
		return rotateShownTiles(nonFlowers);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nonFlowers.length]);

	const renderHiddenHand = useCallback(() => {
		return player.showTiles ? (
			<div className="htss top">
				{player.hiddenTiles.map((tile: ITile) => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segments.top} last={lastThrown} />;
				})}
				{!isEmpty(player.lastTakenTile) && (
					<ShownTile
						key={player.lastTakenTile.uuid}
						tile={player.lastTakenTile}
						segment={Segments.top}
						highlight
						classSuffix="margin-right"
					/>
				)}
			</div>
		) : (
			<HiddenHand tiles={sumHiddenTiles} segment={Segments.top} />
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sumHiddenTiles, player.showTiles]);

	const renderShownTiles = useCallback(() => {
		return (
			<div className="htss top">
				{nonFlowers.length > 0 &&
					rotatedNonFlowers.map(tile => {
						return <ShownTile key={tile.uuid} tile={tile} segment={Segments.top} last={lastThrown} />;
					})}
				{flowers.map(tile => {
					return (
						<ShownTile
							key={tile.uuid}
							tile={tile}
							segment={Segments.top}
							classSuffix={
								tile.isValidFlower ? (tile.suit === '动物' ? 'flower animal' : 'hts flower') : ''
							}
						/>
					);
				})}
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sumShownTiles]);

	const renderUnusedTiles = useCallback(() => {
		return <UnusedTiles tiles={player.unusedTiles} segment={Segments.top} tag={frontBackTag} />;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player.unusedTiles]);

	const renderDiscardedTiles = useCallback(() => {
		return (
			<div className="htss top">
				{player.discardedTiles.map((tile: ITile) => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segments.top} last={lastThrown} />;
				})}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sumDiscardedTiles, lastThrown]);

	return (
		<div className={`row-section-${tilesSize || Sizes.medium}`}>
			{renderHiddenHand()}
			{renderShownTiles()}
			{renderUnusedTiles()}
			{renderDiscardedTiles()}
		</div>
	);
};

export default TopPlayer;
