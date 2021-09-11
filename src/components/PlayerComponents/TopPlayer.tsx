import CasinoIcon from '@material-ui/icons/Casino';
import isEmpty from 'lodash.isempty';
import React from 'react';
import { FrontBackTag, PlayerComponentProps, Segments, Sizes } from '../../global/enums';
import { comparePlayerProps } from '../../util/utilFns';
import HiddenHand from './HiddenTiles/HiddenHand';
import UnusedTiles from './HiddenTiles/UnusedTiles';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';

const TopPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, tilesSize } = props;
	let frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;
	console.log('Rendering top');

	return (
		<div className={`row-section-${tilesSize || Sizes.medium}`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
				<div className="htss top">
					{player.hiddenTiles.map((tile: TileI) => {
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
				<HiddenHand tiles={player.allHiddenTiles().length} segment={Segments.top} />
			)}

			{/*------------------------------ Shown tiles ------------------------------*/}
			<div className="htss top">
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<ShownTile key={tile.uuid} tile={tile} segment={Segments.top} last={lastThrown} />
					) : null;
				})}
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<ShownTile
							key={tile.uuid}
							tile={tile}
							segment={Segments.top}
							classSuffix={
								tile.isValidFlower ? (tile.suit === '动物' ? 'flower animal' : 'hts flower') : ''
							}
						/>
					) : null;
				})}
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<UnusedTiles tiles={player.unusedTiles} segment={Segments.top} tag={frontBackTag} />

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="htss top">
				{player.discardedTiles.map((tile: TileI) => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segments.top} last={lastThrown} />;
				})}
			</div>
		</div>
	);
};

export default React.memo(TopPlayer, comparePlayerProps);
