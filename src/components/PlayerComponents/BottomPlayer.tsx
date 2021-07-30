import CasinoIcon from '@material-ui/icons/Casino';
import React, { useEffect, useMemo } from 'react';
import getTileSrc from '../../images';
import { generateUnusedTiles } from '../../util/utilFns';
import './playerComponents.scss';

const BottomPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack } = props;
	const unusedTiles: number[] = useMemo(() => generateUnusedTiles(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? 'front' : hasBack ? 'back' : '';

	useEffect(() => {
		console.log('Rendering bottom component');
	});

	return (
		<div className="row-section bottom">
			<div className="horizontal-tiles-hidden">
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return <div key={`bottom-hidden-tile${index}`} className="horizontal-tile-hidden" />;
				})}
			</div>
			<div className="horizontal-tiles-shown bottom">
				{player.shownTiles.map((tile: Tile, index: number) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<img
							key={`bottom-shown-tile-${index}`}
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
							key={`bottom-shown-tile-${index}`}
							className="horizontal-tile-shown"
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					) : null;
				})}
				{/* Extra shown tiles */}
				{/* {player.hiddenTiles.map((tile: Tile, index: number) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<img
							key={`bottom-shown-tile-${index}`}
							className="horizontal-tile-shown"
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					) : null;
				})} */}
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
			</div>
			{player.unusedTiles > 0 && (
				<div className={`horizontal-tiles-hidden unused bottom ${frontBackTag}`}>
					{unusedTiles.map(i => {
						return <div key={`bottom-unused-tile${i}`} className="horizontal-tile-hidden" />;
					})}
				</div>
			)}
			<div className="discarded bottom">
				{player.discardedTiles.map((tile: Tile, index: number) => {
					return (
						<img
							key={`bottom-discarded-tile-${index}`}
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
							key={`bottom-discarded-tile-${index}`}
							className="discarded-tile"
							src={getTileSrc(tile.card)}
							alt="tile"
						/>
					);
				})}
				{player.hiddenTiles.map((tile: Tile, index: number) => {
					return (
						<img
							key={`bottom-discarded-tile-${index}`}
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

export default React.memo(BottomPlayer);
