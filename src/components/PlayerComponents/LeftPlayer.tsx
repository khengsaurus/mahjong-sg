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
	console.log('Rendering left');

	const { flowers, nonFlowers } = useMemo(() => {
		return sortShownTiles(player.shownTiles);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player.shownTiles.length]);

	const rotatedNonFlowers = useMemo(() => {
		return rotateShownTiles(nonFlowers);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nonFlowers.length]);

	return (
		<div className={`column-section-${tilesSize || Sizes.medium}`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
				<div className="vtss left">
					{player.hiddenTiles.map(tile => {
						return <ShownTile key={tile.uuid} tile={tile} segment={Segments.left} />;
					})}
					{!isEmpty(player.lastTakenTile) && (
						<ShownTile
							key={player.lastTakenTile.uuid}
							tile={player.lastTakenTile}
							segment={Segments.left}
							classSuffix="margin-bottom"
							highlight
						/>
					)}
				</div>
			) : (
				<HiddenHand tiles={player.allHiddenTiles().length} segment={Segments.left} />
			)}

			{/*------------------------------ Shown tiles ------------------------------*/}
			<div className="vtss left">
				{rotatedNonFlowers.map(tile => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segments.left} last={lastThrown} />;
				})}
				{flowers.map(tile => {
					return (
						<ShownTile
							key={tile.uuid}
							tile={tile}
							segment={Segments.left}
							classSuffix={
								tile.isValidFlower ? (tile.suit === '动物' ? 'flower animal' : 'hts flower') : ''
							}
						/>
					);
				})}
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<UnusedTiles tiles={player.unusedTiles} segment={Segments.left} tag={frontBackTag} />

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="vtss left">
				{player.discardedTiles.map(tile => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segments.left} last={lastThrown} />;
				})}
			</div>
		</div>
	);
};

export default LeftPlayer;
