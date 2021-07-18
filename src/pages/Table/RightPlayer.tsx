import React from 'react';
import { User } from '../../components/Models/User';
import getTileSrc from '../../images/tiles/index';
import './table.scss';

interface Player {
	player: User;
}

const RightPlayer = (props: Player) => {
	console.log('Rendering right player component');
	const { player } = props;
	return (
		<div className="column-section right">
			<div className="vertical-tiles-hidden">
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return <div key={`right-hidden-tile${index}`} className="vertical-tile-hidden" />;
				})}
			</div>
			<div className="vertical-tiles-shown">
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<div className="vertical-tile-shown" key={`right-shown-tile-${index}`}>
							<img className="vertical-tile-shown-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					) : null;
				})}
				{player.shownTiles.map((tile: Tile, index: number) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<div className="vertical-tile-shown" key={`self-shown-tile-${index}`}>
							<img
								className={
									tile.isValidFlower
										? 'vertical-tile-shown-bg animate-flower'
										: 'vertical-tile-shown-bg'
								}
								src={getTileSrc(tile.card)}
								alt="tile"
							/>
						</div>
					) : null;
				})}
			</div>
			<div className="discarded right">
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return (
						<div className="discarded-tile">
							<img
								key={`right-discarded-tile-${index}`}
								className="vertical-tile-shown-bg"
								src={getTileSrc(tile.card)}
								alt="tile"
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default React.memo(RightPlayer);
