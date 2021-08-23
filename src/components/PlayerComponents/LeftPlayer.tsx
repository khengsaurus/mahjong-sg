import CasinoIcon from '@material-ui/icons/Casino';
import isEmpty from 'lodash.isempty';
import React, { useContext, useMemo } from 'react';
import getTileSrc from '../../images';
import { AppContext } from '../../util/hooks/AppContext';
import { generateNumberArray } from '../../util/utilFns';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';

const LeftPlayer = (props: PlayerComponentProps) => {
	const { tilesSize, player, dealer, hasFront, hasBack, lastThrown } = props;
	const { selectedTiles, setSelectedTiles, handSize } = useContext(AppContext);
	const unusedTiles: number[] = useMemo(() => generateNumberArray(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? 'front' : hasBack ? 'back' : '';

	function selectTile(tile: TileI) {
		if (!selectedTiles.includes(tile) && selectedTiles.length < 4) {
			setSelectedTiles([...selectedTiles, tile]);
		} else {
			setSelectedTiles(selectedTiles.filter(selectedTile => selectedTile.id !== tile.id));
		}
	}

	return (
		<div className={`column-section-${tilesSize}`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
				<div className="vtss">
					{player.hiddenTiles.map((tile: TileI) => {
						return <ShownTile key={tile.id} tile={tile} segment="left" last={lastThrown} />;
					})}
					{!isEmpty(player.lastTakenTile) && (
						<ShownTile
							key={player.lastTakenTile.id}
							tile={player.lastTakenTile}
							segment="left"
							highlight
							divClassSuffix="margin-top"
						/>
					)}
				</div>
			) : (
				<div className={`self-hidden-tiles-${handSize}`}>
					{player.hiddenTiles.map((tile: TileI) => {
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
					{!isEmpty(player.lastTakenTile) && (
						<div
							key={`${player.lastTakenTile.id}-hidden`}
							className={
								selectedTiles.includes(player.lastTakenTile)
									? 'self-hidden-tile selected last'
									: 'self-hidden-tile unselected last'
							}
							onClick={() => selectTile(player.lastTakenTile)}
						>
							<img
								className="self-hidden-tile-bg"
								src={getTileSrc(player.lastTakenTile.card)}
								alt="tile"
							/>
						</div>
					)}
				</div>
			)}

			{/*------------------------------ Shown tiles ------------------------------*/}
			<div className="vtss">
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<ShownTile key={tile.id} tile={tile} segment="left" last={lastThrown} />
					) : null;
				})}
				{/* Extra */}
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<ShownTile
							key={tile.id}
							tile={tile}
							segment="left"
							imgClassSuffix={
								tile.isValidFlower ? (tile.suit === '动物' ? 'flower animal' : 'hts flower') : ''
							}
						/>
					) : null;
				})}
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<div className={`vtsh unused ${frontBackTag}`}>
				{unusedTiles &&
					unusedTiles.map(i => {
						return <div key={`self-unused-tile${i}`} className="vth" />;
					})}
			</div>

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="vtss discarded">
				{/* Extra */}
				{player.discardedTiles.map((tile: TileI) => {
					return <ShownTile key={tile.id} tile={tile} segment="left" last={lastThrown} />;
				})}
			</div>
		</div>
	);
};

export default React.memo(LeftPlayer);
