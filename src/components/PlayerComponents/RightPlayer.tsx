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

const RightPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, tilesSize } = props;
	const frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;
	const sumHiddenTiles = player.countAllHiddenTiles();
	const sumShownTiles = player.shownTiles.length;
	const sumDiscardedTiles = player.discardedTiles.length;
	// console.log('Rendering right');

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
			<div className="vtss col-r">
				{player.hiddenTiles.map((tile: ITile) => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segments.right} last={lastThrown} />;
				})}
				{!isEmpty(player.lastTakenTile) && (
					<ShownTile
						key={player.lastTakenTile.uuid}
						tile={player.lastTakenTile}
						segment={Segments.right}
						highlight
						classSuffix="margin-bottom"
					/>
				)}
			</div>
		) : (
			<HiddenHand tiles={player.allHiddenTiles().length} segment={Segments.right} />
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sumHiddenTiles, player.showTiles]);

	const renderShownTiles = useCallback(() => {
		return (
			<div className="vtss">
				{rotatedNonFlowers.map(tile => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segments.right} last={lastThrown} />;
				})}
				{flowers.map((tile: ITile) => {
					return (
						<ShownTile
							key={tile.uuid}
							tile={tile}
							segment={Segments.right}
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
		return <UnusedTiles tiles={player.unusedTiles} segment={Segments.right} tag={frontBackTag} />;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player.unusedTiles]);

	const renderDiscardedTiles = useCallback(() => {
		return (
			<div className="vtss discarded right">
				{player.discardedTiles.map((tile: ITile) => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segments.right} last={lastThrown} />;
				})}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sumDiscardedTiles, lastThrown]);

	return (
		<div className={`column-section-${tilesSize || Sizes.medium} right`}>
			{renderHiddenHand()}
			{renderShownTiles()}
			{renderUnusedTiles()}
			{renderDiscardedTiles()}
		</div>
	);
};

export default RightPlayer;
