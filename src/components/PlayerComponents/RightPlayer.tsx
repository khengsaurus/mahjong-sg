import CasinoIcon from '@material-ui/icons/Casino';
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import getTileSrc from '../../images';
import { AppContext } from '../../util/hooks/AppContext';
import { generateNumberArray } from '../../util/utilFns';
import './playerComponentsSmall.scss';
import './playerComponentsMedium.scss';
import './playerComponentsLarge.scss';

const RightPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrownTile } = props;
	const { tilesSize } = useContext(AppContext);
	const unusedTiles: number[] = useMemo(() => generateNumberArray(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? ' front' : hasBack ? ' back' : '';

	return (
		<div className={`column-section-${tilesSize} right`}>
			{/* Hidden tiles */}
			{player.showTiles ? (
				<div className="vertical-tiles-shown">
					{player.hiddenTiles.map((tile: Tile) => {
						// Consider animating tile if last drawn
						let tileBgName = `vertical-tile-shown-bg${
							!_.isEmpty(lastThrownTile) && tile.id === lastThrownTile.id ? ` last-thrown` : ``
						}`;
						return (
							<div className="vertical-tile-shown" key={`${tile.id}-hidden`}>
								<img className={tileBgName} src={getTileSrc(tile.card)} alt="tile" />
							</div>
						);
					})}
				</div>
			) : (
				<div className="vertical-tiles-hidden">
					{player.hiddenTiles.map((tile: Tile) => {
						return <div key={`${tile.id}-hidden`} className="vertical-tile-hidden" />;
					})}
				</div>
			)}

			{/* Shown tiles */}
			<div className="vertical-tiles-shown flow-column-wrap">
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
			<div className={`vertical-tiles-hidden unused right ${frontBackTag}`}>
				{unusedTiles.map(i => {
					return <div key={`right-unused-tile${i}`} className="vertical-tile-hidden" />;
				})}
			</div>

			{/* Discarded tiles */}
			<div className="discarded flow-column-r-wrap-r">
				{/* {player.hiddenTiles.map((tile: Tile) => {
					return (
						<div className="discarded-tile" key={`${tile.id}`}>
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

export default React.memo(RightPlayer);
