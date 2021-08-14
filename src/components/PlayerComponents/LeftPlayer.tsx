import CasinoIcon from '@material-ui/icons/Casino';
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import getTileSrc from '../../images';
import { AppContext } from '../../util/hooks/AppContext';
import { generateNumberArray } from '../../util/utilFns';
import './playerComponents.scss';
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
			<div className={`self-hidden-tiles-${handSize}`}>
				{player.hiddenTiles &&
					player.hiddenTiles.map((tile: Tile, index: number) => {
						return (
							<div
								key={`self-hidden-tile${index}`}
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
			<div className="vertical-tiles-shown">
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
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
				{player.shownTiles.map((tile: Tile, index: number) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<div className="vertical-tile-shown" key={`self-shown-tile-${index}`}>
							<img className="vertical-tile-shown-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					) : null;
				})}
			</div>
			<div className={`vertical-tiles-hidden unused ${frontBackTag}`}>
				{unusedTiles.map(i => {
					return <div key={`self-unused-tile${i}`} className="vertical-tile-hidden" />;
				})}
			</div>
			<div className="discarded">
				{player.discardedTiles.map((tile: Tile, index: number) => {
					let tileDivName = `discarded-tile${
						!_.isEmpty(lastThrownTile) && tile.id === lastThrownTile.id ? ` last-thrown` : ``
					}`;
					let tileBgName = `vertical-tile-shown-bg${
						!_.isEmpty(lastThrownTile) && tile.id === lastThrownTile.id ? ` last-thrown` : ``
					}`;
					return (
						<div className={tileDivName} key={`self-discarded-tile-${index}`}>
							<img className={tileBgName} src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})}
				{/* Extra discarded tiles */}
				{/* {player.hiddenTiles.map((tile: Tile, index: number) => {
					return (
						<div className="discarded-tile" key={`self-discarded-tile-${index}`}>
							<img className="vertical-tile-shown-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})}
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return (
						<div className="discarded-tile" key={`self-discarded-tile-${index}`}>
							<img className="vertical-tile-shown-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})} */}
			</div>
		</div>
	);
};

export default React.memo(LeftPlayer);
