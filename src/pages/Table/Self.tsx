import { ButtonBase } from '@material-ui/core';
import React, { useContext } from 'react';
import { User } from '../../components/Models/User';
import getTileSrc from '../../images/tiles/index';
import { AppContext } from '../../util/hooks/AppContext';
import './table.scss';

interface Player {
	player: User;
}

const Self = (props: Player) => {
	console.log('Rendering left(self) player component');
	const { selectedTiles, setSelectedTiles } = useContext(AppContext);
	const { player } = props;

	function selectTile(tile: Tile) {
		if (!selectedTiles.includes(tile) && selectedTiles.length < 5) {
			console.log('Selecting ', tile.card);
			setSelectedTiles([...selectedTiles, tile]);
		} else {
			console.log('Deselecting ', tile.card);
			setSelectedTiles(selectedTiles.filter(selectedTile => selectedTile.id !== tile.id));
		}
	}

	return (
		<div className="column-section">
			<div className="self-hidden-tiles">
				{player.hiddenTiles &&
					player.hiddenTiles.map((tile: Tile, index: number) => {
						return (
							<ButtonBase
								key={`self-hidden-tile${index}`}
								// className="self-hidden-tile"
								className={
									selectedTiles.includes(tile)
										? 'self-hidden-tile selected'
										: 'self-hidden-tile unselected'
								}
								onClick={() => selectTile(tile)}
							>
								<img className="self-hidden-tile-bg" src={getTileSrc(tile.card)} alt="tile" />
							</ButtonBase>
						);
					})}
			</div>
			<div className="vertical-tiles-shown">
				{player.hiddenTiles.map((tile: Tile, index: number) => {
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
			<div className="discarded">
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

export default React.memo(Self);
