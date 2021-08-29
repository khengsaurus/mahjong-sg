import CasinoIcon from '@material-ui/icons/Casino';
import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
import { generateNumberArray } from '../../util/utilFns';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';

const TopPlayer = (props: PlayerComponentProps) => {
	const { tilesSize, player, dealer, hasFront, hasBack, lastThrown } = props;
	const unusedTiles: number[] = useMemo(() => generateNumberArray(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? 'front' : hasBack ? 'back' : '';

	return (
		<div className={`row-section-${tilesSize}`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
				<div className="htss row-r">
					{player.hiddenTiles.map((tile: TileI) => {
						return <ShownTile key={tile.uuid} tile={tile} segment="top" />;
					})}
					{!isEmpty(player.lastTakenTile) && (
						<ShownTile
							key={player.lastTakenTile.uuid}
							tile={player.lastTakenTile}
							segment="top"
							imgClassSuffix="margin-right"
							highlight
						/>
					)}
				</div>
			) : (
				<div className="htsh">
					{player.allHiddenTiles().map((tile: TileI) => {
						return <div key={tile.uuid} className="hth" />;
					})}
				</div>
			)}

			{/*------------------------------ Shown tiles ------------------------------*/}
			<div className="htss">
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<ShownTile key={tile.uuid} tile={tile} segment="top" last={lastThrown} />
					) : null;
				})}
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<ShownTile
							key={tile.uuid}
							tile={tile}
							segment="top"
							imgClassSuffix={
								tile.isValidFlower ? (tile.suit === '动物' ? 'flower animal' : 'hts flower') : ''
							}
						/>
					) : null;
				})}
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<div className={`htsh unused ${frontBackTag}`}>
				{unusedTiles.map(i => {
					return <div key={`top-unused-tile${i}`} className="hth" />;
				})}
			</div>

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="htss row-r">
				{player.hiddenTiles.map((tile: TileI) => {
					return <ShownTile key={tile.uuid} tile={tile} segment="top" last={lastThrown} />;
				})}
				{player.discardedTiles.map((tile: TileI) => {
					return <ShownTile key={tile.uuid} tile={tile} segment="top" last={lastThrown} />;
				})}
			</div>
		</div>
	);
};

export default React.memo(TopPlayer);
