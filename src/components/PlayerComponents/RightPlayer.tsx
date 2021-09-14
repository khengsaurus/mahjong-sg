import CasinoIcon from '@material-ui/icons/Casino';
import isEmpty from 'lodash.isempty';
import React from 'react';
import { FrontBackTag, IPlayerComponentProps, Segments, Sizes } from '../../global/enums';
import { comparePlayerProps } from '../../util/utilFns';
import HiddenHand from './HiddenTiles/HiddenHand';
import UnusedTiles from './HiddenTiles/UnusedTiles';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';

const RightPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, tilesSize } = props;
	let frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;
	console.log('Rendering right');

	return (
		<div className={`column-section-${tilesSize || Sizes.medium} right`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
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
			)}

			{/*------------------------------ Shown tiles ------------------------------*/}
			<div className="vtss">
				{player.shownTiles.map((tile: ITile) => {
					if (tile.suit === '花' || tile.suit === '动物') {
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
					} else {
						return <ShownTile key={tile.uuid} tile={tile} segment={Segments.right} last={lastThrown} />;
					}
				})}
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<UnusedTiles tiles={player.unusedTiles} segment={Segments.right} tag={frontBackTag} />

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="vtss discarded right">
				{player.discardedTiles.map((tile: ITile) => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segments.right} last={lastThrown} />;
				})}
			</div>
		</div>
	);
};

export default React.memo(RightPlayer, comparePlayerProps);
