import CasinoIcon from '@material-ui/icons/Casino';
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import getTileSrc from '../../images';
import { AppContext } from '../../util/hooks/AppContext';
import { generateUnusedTiles } from '../../util/utilFns';
import './playerComponents.scss';
import './playerComponentsLarge.scss';

const RightPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrownTile } = props;
	const { tilesSize } = useContext(AppContext);
	const unusedTiles: number[] = useMemo(() => generateUnusedTiles(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? ' front' : hasBack ? ' back' : '';

	return (
		<div className={`column-section-${tilesSize} right`}>
			<div className="vertical-tiles-hidden">
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return <div key={`right-hidden-tile${index}`} className="vertical-tile-hidden" />;
				})}
			</div>
			<div className="vertical-tiles-shown right">
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
				{player.shownTiles.map((tile: Tile, index: number) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<div className="vertical-tile-shown" key={`right-shown-tile-${index}`}>
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
						<div className="vertical-tile-shown" key={`right-shown-tile-${index}`}>
							<img className="vertical-tile-shown-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					) : null;
				})}
			</div>
			<div className={`vertical-tiles-hidden unused right ${frontBackTag}`}>
				{unusedTiles.map(i => {
					return <div key={`right-unused-tile${i}`} className="vertical-tile-hidden" />;
				})}
			</div>
			<div className="discarded right">
				{player.discardedTiles.map((tile: Tile, index: number) => {
					let tileDivName = `discarded-tile${
						!_.isEmpty(lastThrownTile) && tile.id === lastThrownTile.id ? ` last-thrown` : ``
					}`;
					let tileBgName = `vertical-tile-shown-bg${
						!_.isEmpty(lastThrownTile) && tile.id === lastThrownTile.id ? ` last-thrown` : ``
					}`;
					return (
						<div className={tileDivName} key={`right-discarded-tile-${index}`}>
							<img className={tileBgName} src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})}
				{/* Extra discarded tiles */}
				{/* {player.hiddenTiles.map((tile: Tile, index: number) => {
					return (
						<div className="discarded-tile" key={`right-discarded-tile-${index}`}>
							<img className="vertical-tile-shown-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})}
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return (
						<div className="discarded-tile" key={`right-discarded-tile-${index}`}>
							<img className="vertical-tile-shown-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})} */}
			</div>
		</div>
	);
};

export default React.memo(RightPlayer);
