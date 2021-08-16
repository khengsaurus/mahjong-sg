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
		<div className={`row-section-${tilesSize} bottom`}>
			{/* Hidden tiles */}
			{player.showTiles ? (
				<div className="horizontal-tiles-shown bottom hu">
					{player.hiddenTiles.map((tile: Tile) => {
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
			<div className="horizontal-tiles-shown bottom">
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
				{/* {player.hiddenTiles.map((tile: Tile) => {
					return (
						<img
							key={`${tile.id}-shown`}
							className="horizontal-tile-shown"
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					);
				})} */}
			</div>

			{/* Unused tiles */}
			<div className={`horizontal-tiles-hidden unused bottom ${frontBackTag}`}>
				{unusedTiles.map(i => {
					return <div key={`bottom-unused-tile${i}`} className="horizontal-tile-hidden" />;
				})}
			</div>

			{/* Discarded tiles */}
			<div className="discarded bottom">
				{/* {player.hiddenTiles.map((tile: Tile) => {
					return (
						<img
							key={`bottom-discarded-tile-${tile.id}`}
							className="discarded-tile"
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					);
				})} */}
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
			</div>
		</div>
	);
};

export default React.memo(BottomPlayer);
