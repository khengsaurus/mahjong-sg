import CasinoIcon from '@material-ui/icons/Casino';
import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
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
	// console.log('Rendering right');

	const { flowers, nonFlowers } = useMemo(() => {
		return sortShownTiles(player.shownTiles);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player?.shownTiles?.length]);

	const rotatedNonFlowers = useMemo(() => {
		return rotateShownTiles(nonFlowers);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nonFlowers?.length]);

	const renderShownHiddenHand = useMemo(() => {
		return (
			<div className="vtss col-r">
				{player.hiddenTiles.map((tile: ITile) => {
					return (
						<ShownTile key={tile.uuid} tileUUID={tile.uuid} tileCard={tile.card} segment={Segments.right} />
					);
				})}
				{!isEmpty(player.lastTakenTile) && (
					<ShownTile
						key={player.lastTakenTile.uuid}
						tileUUID={player.lastTakenTile.uuid}
						tileCard={player.lastTakenTile.card}
						segment={Segments.right}
						highlight
						classSuffix="margin-bottom"
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sumHiddenTiles]);

	const renderHiddenHand = useMemo(() => {
		return <HiddenHand tiles={sumHiddenTiles} segment={Segments.right} />;
	}, [sumHiddenTiles]);

	const renderShownTiles = useMemo(() => {
		return (
			<div className="vtss">
				{rotatedNonFlowers.map(tile => {
					return (
						<ShownTile
							key={tile.uuid}
							tileUUID={tile.uuid}
							tileCard={tile.card}
							segment={Segments.right}
							lastUUID={lastThrown?.uuid}
						/>
					);
				})}
				{flowers.map((tile: ITile) => {
					return (
						<ShownTile
							key={tile.uuid}
							tileUUID={tile.uuid}
							tileCard={tile.card}
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
	}, [flowers?.length, nonFlowers?.length]);

	const renderUnusedTiles = useMemo(() => {
		return <UnusedTiles tiles={player.unusedTiles} segment={Segments.right} tag={frontBackTag} />;
	}, [player?.unusedTiles, frontBackTag]);

	// NOTE: Will re-render whenever lastThrown changes, even if is/was not thrown by player
	const renderDiscardedTiles = useMemo(() => {
		return (
			<div className="vtss discarded right">
				{player.discardedTiles.map((tile: ITile) => {
					return (
						<ShownTile
							key={tile.uuid}
							tileUUID={tile.uuid}
							tileCard={tile.card}
							segment={Segments.right}
							lastUUID={lastThrown?.uuid}
						/>
					);
				})}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player?.discardedTiles?.length, lastThrown?.id]);

	return (
		<div className={`column-section-${tilesSize || Sizes.medium} right`}>
			{player.showTiles ? renderShownHiddenHand : renderHiddenHand}
			{renderShownTiles}
			{renderUnusedTiles}
			{renderDiscardedTiles}
		</div>
	);
};

export default RightPlayer;
