import CasinoIcon from '@material-ui/icons/Casino';
import React, { useContext, useEffect, useMemo } from 'react';
import getTileSrc from '../../images';
import { AppContext } from '../../util/hooks/AppContext';
import { generateUnusedTiles } from '../../util/utilFns';
import './playerComponents.scss';
import './playerComponentsLarge.scss';

const TopPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack } = props;
	const { tilesSize } = useContext(AppContext);
	const unusedTiles: number[] = useMemo(() => generateUnusedTiles(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? ' front' : hasBack ? ' back' : '';

	useEffect(() => {
		console.log('Rendering top component');
	});

	return (
		<div className={`row-section-${tilesSize}`}>
			<div className="horizontal-tiles-hidden">
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return <div key={`top-hidden-tile${index}`} className="horizontal-tile-hidden" />;
				})}
			</div>
			<div className="horizontal-tiles-shown">
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
				{player.shownTiles.map((tile: Tile, index: number) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<img
							key={`top-shown-tile-${index}`}
							className={
								tile.isValidFlower
									? tile.suit === '动物'
										? 'horizontal-tile-shown animate-flower animal'
										: 'horizontal-tile-shown animate-flower'
									: 'horizontal-tile-shown'
							}
							src={getTileSrc(tile.card)}
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
			{player.unusedTiles > 0 && (
				<div className={`horizontal-tiles-hidden unused ${frontBackTag}`}>
					{unusedTiles.map(i => {
						return <div key={`top-unused-tile${i}`} className="horizontal-tile-hidden" />;
					})}
				</div>
			)}
			<div className="discarded">
				{player.discardedTiles.map((tile: Tile, index: number) => {
					return (
						<img
							key={`top-discarded-tile-${index}`}
							className="discarded-tile"
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					);
				})}
				{/* Extra discarded tiles */}
				{/* {player.hiddenTiles.map((tile: Tile, index: number) => {
					return (
						<img
							key={`top-discarded-tile-${index}`}
							className="discarded-tile"
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					);
				})}
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return (
						<img
							key={`top-discarded-tile-${index}`}
							className="discarded-tile"
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					);
				})} */}
			</div>
		</div>
	);
};

export default React.memo(TopPlayer);
