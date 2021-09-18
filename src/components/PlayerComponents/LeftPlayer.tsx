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

const LeftPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, tilesSize } = props;
	let frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;
	const sumHiddenTiles = player.countAllHiddenTiles();
	// console.log('Rendering left');

	const { flowers, nonFlowers } = useMemo(() => {
		return sortShownTiles(player.shownTiles);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player.shownTiles.length]);

	const rotatedNonFlowers = useMemo(() => {
		return rotateShownTiles(nonFlowers);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nonFlowers.length]);

	const renderShownHiddenHand = useMemo(() => {
		return (
			<div className="vtss left">
				{player.hiddenTiles.map(tile => {
					return (
						<ShownTile key={tile.uuid} tileUUID={tile.uuid} tileCard={tile.card} segment={Segments.left} />
					);
				})}
				{!isEmpty(player.lastTakenTile) && (
					<ShownTile
						key={player.lastTakenTile.uuid}
						tileUUID={player.lastTakenTile.uuid}
						tileCard={player.lastTakenTile.card}
						segment={Segments.left}
						classSuffix="margin-bottom"
						highlight
					/>
				)}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sumHiddenTiles]);

	const renderHiddenHand = useMemo(() => {
		return <HiddenHand tiles={sumHiddenTiles} segment={Segments.left} />;
	}, [sumHiddenTiles]);

	const renderShownTiles = useMemo(() => {
		return (
			<div className="vtss left">
				{rotatedNonFlowers.map(tile => {
					return (
						<ShownTile
							key={tile.uuid}
							tileUUID={tile.uuid}
							tileCard={tile.card}
							segment={Segments.left}
							lastUUID={lastThrown?.uuid}
						/>
					);
				})}
				{flowers.map(tile => {
					return (
						<ShownTile
							key={tile.uuid}
							tileUUID={tile.uuid}
							tileCard={tile.card}
							segment={Segments.left}
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
		return <UnusedTiles tiles={player.unusedTiles} segment={Segments.left} tag={frontBackTag} />;
	}, [player?.unusedTiles, frontBackTag]);

	// NOTE: Will re-render whenever lastThrown changes, even if is/was not thrown by player
	const renderDiscardedTiles = useMemo(() => {
		return (
			<div className="vtss left">
				{player.discardedTiles.map(tile => {
					return (
						<ShownTile
							key={tile.uuid}
							tileUUID={tile.uuid}
							tileCard={tile.card}
							segment={Segments.left}
							lastUUID={lastThrown?.uuid}
						/>
					);
				})}
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player?.discardedTiles?.length, lastThrown?.id]);

	return (
		<div className={`column-section-${tilesSize || Sizes.medium}`}>
			{player.showTiles ? renderShownHiddenHand : renderHiddenHand}
			{renderShownTiles}
			{renderUnusedTiles}
			{renderDiscardedTiles}
		</div>
	);
};

export default LeftPlayer;
