import { IconButton } from '@material-ui/core';
import { User } from '../../components/Models/User';
import getTileSrc from '../../images/tiles/index';
import './table.scss';

interface Player {
	player: User;
}

const Self = (props: Player) => {
	const { player } = props;
	function selectTile(tile: Tile) {
		console.log(tile.card);
	}

	return (
		<div className="column-section">
			<div className="self-hidden-tiles">
				{player.hiddenTiles &&
					player.hiddenTiles.map((tile: Tile, index: number) => {
						return (
							<IconButton
								key={`self-hidden-tile${index}`}
								className="self-hidden-tile"
								onClick={() => selectTile(tile)}
							>
								<img className="self-hidden-tile-bg" src={getTileSrc(tile.card)} alt="tile" />
							</IconButton>
						);
					})}
			</div>
			<div className="vertical-tiles-shown">
				{player.shownTiles.map((tile: Tile, index: number) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<div className="vertical-tile-shown">
							<img
								key={`self-shown-tile-${index}`}
								className="vertical-tile-shown-bg"
								src={getTileSrc(tile.card)}
								alt="tile"
							/>
						</div>
					) : null;
				})}
				{player.shownTiles.map((tile: Tile, index: number) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<div className="vertical-tile-shown" key={`self-shown-tile-${index}`}>
							<img
								className="vertical-tile-shown-bg"
								src={getTileSrc(tile.card)}
								style={{
									background: tile.isValidFlower ? '#9ba6bd' : null,
									borderRadius: tile.isValidFlower ? '8%' : null
								}}
								alt="tile"
							/>
						</div>
					) : null;
				})}
			</div>
			<div className="discarded">
				{player.discardedTiles.map((tile: Tile, index: number) => {
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

export default Self;
