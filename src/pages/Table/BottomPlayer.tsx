import React from 'react';
import { User } from '../../components/Models/User';
import getTileSrc from '../../images/tiles/index';
import './table.scss';

interface Player {
	player: User;
}

const BottomPlayer = (props: Player) => {
	console.log('Rendering bottom player component');
	const { player } = props;
	return (
		<div className="row-section bottom">
			<div className="horizontal-tiles-hidden">
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return <div key={`bottom-hidden-tile${index}`} className="horizontal-tile-hidden" />;
				})}
			</div>
			<div className="horizontal-tiles-shown bottom">
				{player.shownTiles.map((tile: Tile, index: number) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<img
							key={`bottom-shown-tile-${index}`}
							className={
								tile.isValidFlower ? 'horizontal-tile-shown animate-flower' : 'horizontal-tile-shown'
							}
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					) : null;
				})}
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<img
							key={`bottom-shown-tile-${index}`}
							className="horizontal-tile-shown"
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					) : null;
				})}
			</div>
			<div className="discarded bottom">
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return (
						<img
							key={`bottom-discarded-tile-${index}`}
							className="discarded-tile"
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
