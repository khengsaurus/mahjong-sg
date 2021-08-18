import CasinoIcon from '@material-ui/icons/Casino';
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import getTileSrc from '../../images';
import { AppContext } from '../../util/hooks/AppContext';
import { generateNumberArray } from '../../util/utilFns';
import './playerComponentsSmall.scss';
import './playerComponentsMedium.scss';
import './playerComponentsLarge.scss';

const BottomPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrownTile } = props;
	const { tilesSize } = useContext(AppContext);
	const unusedTiles: number[] = useMemo(() => generateNumberArray(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? 'front' : hasBack ? 'back' : '';

	return (
		<div className={`row-section-${tilesSize} flex-dir-column-r`}>
			{/* Hidden tiles */}
			{player.showTiles ? (
				<div className="htss bottom">
					{player.hiddenTiles.map((tile: Tile) => {
						return <img key={`${tile.id}-hidden`} className="hts" src={getTileSrc(tile.card)} alt="tile" />;
					})}
					{!_.isEmpty(player.lastTakenTile) && (
						<img
							key={`${player.lastTakenTile.id}-hidden`}
							className="hts last margin-left"
							src={getTileSrc(player.lastTakenTile.card)}
							alt="tile"
						/>
					)}
				</div>
			) : (
				<div className="htsh">
					{player.allHiddenTiles().map((tile: Tile) => {
						return <div key={`${tile.id}-hidden`} className="hth" />;
					})}
				</div>
			)}

			{/* Shown tiles */}
			<div className="htss bottom">
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
				{player.shownTiles.map((tile: Tile) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<img
							key={`${tile.id}-shown`}
							className={
								tile.isValidFlower ? (tile.suit === '动物' ? 'hts flower animal' : 'hts flower') : 'hts'
							}
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					) : null;
				})}
				{player.shownTiles.map((tile: Tile) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<img key={`${tile.id}-shown`} className="hts" src={getTileSrc(tile.card)} alt="tile" />
					) : null;
				})}
				{/* Extra */}
				{/* {player.hiddenTiles.map((tile: Tile) => {
					return <img key={`${tile.id}-shown`} className="hts" src={getTileSrc(tile.card)} alt="tile" />;
				})} */}
			</div>

			{/* Unused tiles */}
			<div className={`htsh unused bottom ${frontBackTag}`}>
				{unusedTiles.map(i => {
					return <div key={`bottom-unused-tile${i}`} className="hth" />;
				})}
			</div>

			{/* Discarded tiles */}
			<div className="dts bottom">
				{/* Extra */}
				{/* {player.hiddenTiles.map((tile: Tile) => {
					return <img key={`bottom-dt-${tile.id}`} className="dt" src={getTileSrc(tile.card)} alt="tile" />;
				})} */}
				{player.discardedTiles.map((tile: Tile) => {
					let className = `dt${!_.isEmpty(lastThrownTile) && tile.id === lastThrownTile.id ? ` last` : ``}`;
					return (
						<img
							key={`${tile.id}-discarded`}
							className={className}
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					);
				})}
			</div>
		</div>
	);
};

export default React.memo(BottomPlayer);
