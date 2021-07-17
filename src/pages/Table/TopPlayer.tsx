import { User } from '../../components/Models/User';
import getTileSrc from '../../images/tiles/index';
import './table.scss';

interface Player {
	player: User;
}

const TopPlayer = (props: Player) => {
	const { player } = props;
	return (
		<div className="row-section">
			<div className="horizontal-tiles-hidden">
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return <div key={`top-hidden-tile${index}`} className="horizontal-tile-hidden" />;
				})}
			</div>
			<div className="horizontal-tiles-shown">
				{player.shownTiles.map((tile: Tile, index: number) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<img
							key={`top-shown-tile-${index}`}
							className="horizontal-tile-shown"
							src={getTileSrc(tile.card)}
							style={{
								background: tile.isValidFlower ? '#9ba6bd' : null,
								borderRadius: tile.isValidFlower ? '8%' : null
							}}
							alt="tile"
						/>
					) : null;
				})}
				{player.shownTiles.map((tile: Tile, index: number) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<img
							key={`top-shown-tile-${index}`}
							className="horizontal-tile-shown"
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					) : null;
				})}
			</div>
			<div className="discarded">
				{player.discardedTiles.map((tile: Tile, index: number) => {
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

export default TopPlayer;
