import CasinoIcon from '@material-ui/icons/Casino';
import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
import { generateNumberArray } from '../../util/utilFns';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';

const LeftPlayer = (props: PlayerComponentProps) => {
	const { tilesSize, player, dealer, hasFront, hasBack, lastThrown } = props;
	const unusedTiles: number[] = useMemo(() => generateNumberArray(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? 'front' : hasBack ? 'back' : '';

	return (
		<div className={`column-section-${tilesSize}`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
				<div className="vtss left">
					{player.hiddenTiles.map((tile: TileI) => {
						return <ShownTile key={tile.id} tile={tile} segment="left" />;
					})}
					{!isEmpty(player.lastTakenTile) && (
						<ShownTile
							key={player.lastTakenTile.id}
							tile={player.lastTakenTile}
							segment="left"
							imgClassSuffix="margin-top"
							highlight
						/>
					)}
				</div>
			) : (
				<div className="vtsh">
					{player.allHiddenTiles().map((tile: TileI) => {
						return <div key={`${tile.id}-hidden`} className="vth" />;
					})}
				</div>
			)}

			{/*------------------------------ Shown tiles ------------------------------*/}
			<div className="vtss left">
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<ShownTile key={tile.id} tile={tile} segment="left" last={lastThrown} />
					) : null;
				})}
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<ShownTile
							key={tile.id}
							tile={tile}
							segment="left"
							imgClassSuffix={
								tile.isValidFlower ? (tile.suit === '动物' ? 'flower animal' : 'hts flower') : ''
							}
						/>
					) : null;
				})}
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<div className={`vtsh unused ${frontBackTag}`}>
				{unusedTiles.map(i => {
					return <div key={`left-unused-tile${i}`} className="vth" />;
				})}
			</div>

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="vtss left">
				{player.discardedTiles.map((tile: TileI) => {
					return <ShownTile key={tile.id} tile={tile} segment="left" last={lastThrown} />;
				})}
			</div>
		</div>
	);
};

export default React.memo(LeftPlayer);
