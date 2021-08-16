import CasinoIcon from '@material-ui/icons/Casino';
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import getTileSrc from '../../images';
import { AppContext } from '../../util/hooks/AppContext';
import { generateNumberArray } from '../../util/utilFns';
import './playerComponentsSmall.scss';
import './playerComponentsMedium.scss';
import './playerComponentsLarge.scss';

const LeftPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrownTile } = props;
	const { selectedTiles, setSelectedTiles, handSize, tilesSize } = useContext(AppContext);
	const unusedTiles: number[] = useMemo(() => generateNumberArray(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? 'front' : hasBack ? 'back' : '';

	function selectTile(tile: Tile) {
		if (!selectedTiles.includes(tile) && selectedTiles.length < 4) {
			setSelectedTiles([...selectedTiles, tile]);
		} else {
			setSelectedTiles(selectedTiles.filter(selectedTile => selectedTile.id !== tile.id));
		}
	}

	return (
		<div className={`column-section-${tilesSize}`}>
			{/* Hidden tiles */}
			{player.showTiles ? (
				<div className="vertical-tiles-shown flow-column-wrap">
					{player.hiddenTiles.map((tile: Tile) => {
						let tileBgName = `vertical-tile-shown-bg${
							!_.isEmpty(lastThrownTile) && tile.id === lastThrownTile.id ? ` last-thrown` : ``
						}`;
						return (
							<div className={`vertical-tile-shown`} key={`${tile.id}-hidden`}>
								<img className={tileBgName} src={getTileSrc(tile.card)} alt="tile" />
							</div>
						);
					})}
				</div>
			) : (
				<div className={`self-hidden-tiles-${handSize}`}>
					{player.hiddenTiles.map((tile: Tile) => {
						return (
							<div
								key={`${tile.id}-hidden`}
								className={
									selectedTiles.includes(tile)
										? 'self-hidden-tile selected'
										: 'self-hidden-tile unselected'
								}
								onClick={() => selectTile(tile)}
							>
								<img className="self-hidden-tile-bg" src={getTileSrc(tile.card)} alt="tile" />
							</div>
						);
					})}
				</div>
			)}

			{/* Shown tiles */}
			<div className="vertical-tiles-shown">
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
				{player.shownTiles.map((tile: Tile) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<div className="vertical-tile-shown" key={`${tile.id}-shown`}>
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
				{player.shownTiles.map((tile: Tile) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<div className="vertical-tile-shown" key={`${tile.id}-shown`}>
							<img className="vertical-tile-shown-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					) : null;
				})}
				{/* {player.hiddenTiles.map((tile: Tile) => {
					return (
						<div className="vertical-tile-shown" key={`${tile.id}-shown`}>
							<img className="vertical-tile-shown-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})} */}
			</div>

			{/* Unused tiles */}
			<div className={`vertical-tiles-hidden unused ${frontBackTag}`}>
				{unusedTiles &&
					unusedTiles.map(i => {
						return <div key={`self-unused-tile${i}`} className="vertical-tile-hidden" />;
					})}
			</div>

			{/* Discarded tiles */}
			<div className="discarded">
				{/* {player.hiddenTiles.map((tile: Tile) => {
					return (
						<div className="discarded-tile" key={`self-discarded-tile-${tile.id}`}>
							<img className="vertical-tile-shown-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})} */}
				{player.discardedTiles.map((tile: Tile) => {
					let tileBgName = `vertical-tile-shown-bg${
						!_.isEmpty(lastThrownTile) && tile.id === lastThrownTile.id ? ` last-thrown` : ``
					}`;
					return (
						<div className={'discarded-tile'} key={`${tile.id}-discarded`}>
							<img className={tileBgName} src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default React.memo(LeftPlayer);
