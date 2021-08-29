import CasinoIcon from '@material-ui/icons/Casino';
import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
import { generateNumberArray } from '../../util/utilFns';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';

const RightPlayer = (props: PlayerComponentProps) => {
	const { tilesSize, player, dealer, hasFront, hasBack, lastThrown } = props;
	const unusedTiles: number[] = useMemo(() => generateNumberArray(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? 'front' : hasBack ? 'back' : '';

	return (
		<div className={`column-section-${tilesSize} right`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
				<div className="vtss col-r">
					{player.hiddenTiles.map((tile: TileI) => {
						return <ShownTile key={tile.uuid} tile={tile} segment="right" last={lastThrown} />;
					})}
					{!isEmpty(player.lastTakenTile) && (
						<ShownTile
							key={player.lastTakenTile.uuid}
							tile={player.lastTakenTile}
							segment="right"
							highlight
							divClassSuffix="margin-bottom"
						/>
					)}
				</div>
			) : (
				<div className="vtsh">
					{player.allHiddenTiles().map((tile: TileI) => {
						return <div key={tile.uuid} className="vth" />;
					})}
				</div>
			)}

			{/*------------------------------ Shown tiles ------------------------------*/}
			<div className="vtss right">
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<ShownTile
							key={tile.uuid}
							tile={tile}
							segment="right"
							imgClassSuffix={
								tile.isValidFlower ? (tile.suit === '动物' ? 'flower animal' : 'hts flower') : ''
							}
						/>
					) : null;
				})}
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<ShownTile key={tile.uuid} tile={tile} segment="right" last={lastThrown} />
					) : null;
				})}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<div className={`vtsh unused right ${frontBackTag}`}>
				{unusedTiles.map(i => {
					return <div key={`right-unused-tile${i}`} className="vth" />;
				})}
			</div>

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="vtss discarded right">
				{player.discardedTiles.map((tile: TileI) => {
					return <ShownTile key={tile.uuid} tile={tile} segment="right" last={lastThrown} />;
				})}
			</div>
		</div>
	);
};

export default React.memo(RightPlayer);
