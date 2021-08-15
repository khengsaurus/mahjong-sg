import CasinoIcon from '@material-ui/icons/Casino';
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import getTileSrc from '../../images';
import { AppContext } from '../../util/hooks/AppContext';
import { generateNumberArray } from '../../util/utilFns';
import './playerComponents.scss';
import './playerComponentsLarge.scss';

const TopPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrownTile } = props;
	const { tilesSize } = useContext(AppContext);
	const unusedTiles: number[] = useMemo(() => generateNumberArray(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? ' front' : hasBack ? ' back' : '';

	// TODO: last thrown styling for show-hu tiles, last-thrown & magnify
	return (
		<div className={`row-section-${tilesSize}`}>
			{/* Hidden tiles */}
			{player.showTiles ? (
				<div className="horizontal-tiles-shown">
					{player.hiddenTiles.map((tile: Tile) => {
						console.log(tile.id);
						return (
							<img
								key={`${tile.id}-hidden`}
								className="horizontal-tile-shown"
								src={getTileSrc(tile.card)}
								alt="tile"
							/>
						);
					})}
				</div>
			) : (
				<div className="horizontal-tiles-hidden">
					{player.hiddenTiles.map((tile: Tile) => {
						return <div key={`${tile.id}-hidden`} className="horizontal-tile-hidden" />;
					})}
				</div>
			)}

			{/* Shown tiles */}
			<div className="horizontal-tiles-shown">
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
				{player.shownTiles.map((tile: Tile) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<img
							key={`${tile.id}-shown`}
							className={
								tile.isValidFlower
									? tile.suit === '动物'
										? 'horizontal-tile-shown animate-flower animal'
										: 'horizontal-tile-shown animate-flower'
									: 'horizontal-tile-shown'
							}
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					) : null;
				})}
				{player.shownTiles.map((tile: Tile) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<img
							key={`${tile.id}-shown`}
							className="horizontal-tile-shown"
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					) : null;
				})}
			</div>

			{/* Unused tiles */}
			<div className={`horizontal-tiles-hidden unused ${frontBackTag}`}>
				{unusedTiles.map(i => {
					return <div key={`top-unused-tile${i}`} className="horizontal-tile-hidden" />;
				})}
			</div>

			{/* Discarded tiles */}
			<div className="discarded">
				{player.discardedTiles.map((tile: Tile) => {
					let className = `discarded-tile${
						!_.isEmpty(lastThrownTile) && tile.id === lastThrownTile.id ? ` last-thrown` : ``
					}`;
					return (
						<img
							key={`${tile.id}-discarded`}
							className={className}
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					);
				})}
				{/* {player.hiddenTiles.map((tile: Tile) => {
					return (
						<img
							key={`${tile.id}-discarded`}
							className="discarded-tile"
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					);
				})}
				{player.hiddenTiles.map((tile: Tile) => {
					return (
						<img
							key={`${tile.id}-discarded`}
							className="discarded-tile"
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					);
				})} */}
			</div>
		</div>
	);
};

export default React.memo(TopPlayer);
