import CasinoIcon from '@material-ui/icons/Casino';
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../util/hooks/AppContext';
import { generateNumberArray } from '../../util/utilFns';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';

const BottomPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { tilesSize } = useContext(AppContext);
	const unusedTiles: number[] = useMemo(() => generateNumberArray(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? 'front' : hasBack ? 'back' : '';

	return (
		<div className={`row-section-${tilesSize} bottom`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
				<div className="htss row-r bottom">
					{player.hiddenTiles.map((tile: TileI) => {
						return <ShownTile key={tile.id} tile={tile} segment="bottom" />;
					})}
					{!_.isEmpty(player.lastTakenTile) && (
						<ShownTile
							key={player.lastTakenTile.id}
							tile={player.lastTakenTile}
							segment="bottom"
							highlight
							classSuffix="margin-right"
						/>
					)}
				</div>
			) : (
				<div className="htsh">
					{player.allHiddenTiles().map((tile: TileI) => {
						return <div key={`${tile.id}-hidden`} className="hth" />;
					})}
				</div>
			)}

			{/*------------------------------ Shown tiles ------------------------------*/}
			<div className="htss bottom">
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<ShownTile
							key={tile.id}
							tile={tile}
							segment="bottom"
							classSuffix={
								tile.isValidFlower ? (tile.suit === '动物' ? 'flower animal' : 'hts flower') : ''
							}
						/>
					) : null;
				})}
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<ShownTile key={tile.id} tile={tile} segment="bottom" last={lastThrown} />
					) : null;
				})}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<div className={`htsh unused bottom ${frontBackTag}`}>
				{unusedTiles.map(i => {
					return <div key={`bottom-unused-tile${i}`} className="hth" />;
				})}
			</div>

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="htss row-r bottom">
				{player.discardedTiles.map((tile: TileI) => {
					return <ShownTile key={tile.id} tile={tile} segment="bottom" last={lastThrown} />;
				})}
			</div>
		</div>
	);
};

export default React.memo(BottomPlayer);
