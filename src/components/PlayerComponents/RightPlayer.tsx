import CasinoIcon from '@material-ui/icons/Casino';
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import getTileSrc from '../../images';
import { AppContext } from '../../util/hooks/AppContext';
import { generateNumberArray } from '../../util/utilFns';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';

const RightPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { tilesSize } = useContext(AppContext);
	const unusedTiles: number[] = useMemo(() => generateNumberArray(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? 'front' : hasBack ? 'back' : '';

	return (
		<div className={`column-section-${tilesSize} right`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
				<div className="vtss col-r">
					{player.hiddenTiles.map((tile: TileI) => {
						return (
							<div className="vts" key={`${tile.id}-hidden`}>
								<img className="vts-bg" src={getTileSrc(tile.card)} alt="tile" />
							</div>
						);
					})}
					{!_.isEmpty(player.lastTakenTile) && (
						<div className={`vts margin-bottom`} key={`${player.lastTakenTile.id}-hidden`}>
							<img className={`vts-bg last`} src={getTileSrc(player.lastTakenTile.card)} alt="tile" />
						</div>
					)}
				</div>
			) : (
				<div className="vtsh">
					{player.allHiddenTiles().map((tile: TileI) => {
						return <div key={`${tile.id}-hidden`} className="vth" />;
					})}
				</div>
			)}

			{/*------------------------------ Shown tiles ------------------------------*/}
			<div className="vtss right">
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<div className="vts" key={`${tile.id}-shown`}>
							<img
								className={
									tile.isValidFlower
										? tile.suit === '动物'
											? 'vts-bg flower animal'
											: 'vts-bg flower'
										: 'vts-bg'
								}
								src={getTileSrc(tile.card)}
								alt="tile"
							/>
						</div>
					) : null;
				})}
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<div className="vts" key={`${tile.id}-shown`}>
							<img className="vts-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					) : null;
				})}
				{/* Extra */}
				{/* {player.hiddenTiles.map((tile: TileI) => {
					return (
						<div className="vts" key={`${tile.id}-shown`}>
							<img className="vts-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})} */}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<div className={`vtsh unused right ${frontBackTag}`}>
				{unusedTiles.map(i => {
					return <div key={`right-unused-tile${i}`} className="vth" />;
				})}
			</div>

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="vtss discarded right">
				{/* Extra */}
				{/* {player.hiddenTiles.map((tile: TileI) => {
					return (
						<div className="dt" key={`${tile.id}`}>
							<img className="vts-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})} */}
				{player.discardedTiles.map((tile: TileI) => {
					let tileBgName = `vts-bg${!_.isEmpty(lastThrown) && tile.id === lastThrown.id ? ` last` : ``}`;
					return (
						<div className={'vts'} key={`${tile.id}-discarded`}>
							<img className={tileBgName} src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default React.memo(RightPlayer);
