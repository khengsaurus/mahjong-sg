import { ButtonBase } from '@material-ui/core';
import React, { useContext, useEffect, useMemo } from 'react';
import { User } from '../../Models/User';
import getTileSrc from '../../images/tiles/index';
import { AppContext } from '../../util/hooks/AppContext';
import { generateUnusedTiles } from '../../util/utilFns';
import './playerComponents.scss';

const LeftPlayer = (props: PlayerComponentProps) => {
	const { selectedTiles, setSelectedTiles } = useContext(AppContext);
	const { player, hasFront, hasBack } = props;
	const unusedTiles: number[] = useMemo(() => generateUnusedTiles(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? 'front' : hasBack ? 'back' : '';

	useEffect(() => {
		console.log('Rendering left component');
	});

	function selectTile(tile: Tile) {
		if (!selectedTiles.includes(tile) && selectedTiles.length < 5) {
			setSelectedTiles([...selectedTiles, tile]);
		} else {
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
				{player.shownTiles.map((tile: Tile, index: number) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<div className="vertical-tile-shown" key={`self-shown-tile-${index}`}>
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
										? tile.suit === '动物'
											? 'vertical-tile-shown-bg animate-flower animal'
											: 'vertical-tile-shown-bg animate-flower'
										: 'vertical-tile-shown-bg'
								}
								src={getTileSrc(tile.card)}
								alt="tile"
							/>
						</div>
					) : null;
				})}
			</div>
			{player.unusedTiles > 0 && (
				<div className={`vertical-tiles-hidden unused ${frontBackTag}`}>
					{unusedTiles.map(i => {
						return <div key={`self-unused-tile${i}`} className="vertical-tile-hidden" />;
					})}
				</div>
			)}
			<div className="discarded">
				{player.discardedTiles.map((tile: Tile, index: number) => {
					return (
						<div className="discarded-tile" key={`self-discarded-tile-${index}`}>
							<img className="vertical-tile-shown-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})}
				{/* Extra discarded tiles */}
				{/* {player.hiddenTiles.map((tile: Tile, index: number) => {
					return (
						<div className="discarded-tile">
							<img
								key={`self-discarded-tile-${index}`}
								className="vertical-tile-shown-bg"
								src={getTileSrc(tile.card)}
								alt="tile"
							/>
						</div>
					);
				})}
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return (
						<div className="discarded-tile">
							<img
								key={`self-discarded-tile-${index}`}
								className="vertical-tile-shown-bg"
								src={getTileSrc(tile.card)}
								alt="tile"
							/>
						</div>
					);
				})} */}
			</div>
		</div>
	);
};

export default React.memo(LeftPlayer);
