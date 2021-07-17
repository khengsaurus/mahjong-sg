import { User } from '../../components/Models/User';
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
					return (
						<img
							key={`top-shown-tile${index}`}
							className="horizontal-tile-shown"
							// src={`../../images/tiles/${tile.card}.svg`}
							src="../../images/tiles/无.svg"
							// alt={'../../images/tiles/无.svg'}
							alt="无"
						/>
					);
				})}
			</div>
		</div>
	);
};

export default TopPlayer;
