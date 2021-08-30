import CasinoIcon from '@material-ui/icons/Casino';
import isEmpty from 'lodash.isempty';
import React, { useContext, useMemo } from 'react';
import { Segment } from '../../Enums';
import { User } from '../../Models/User';
import { AppContext } from '../../util/hooks/AppContext';
import { generateNumberArray } from '../../util/utilFns';
import { HandTile } from './HandTile';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';

interface Props {
	tilesSize: string;
	player: User;
	dealer?: boolean;
	hasFront?: boolean;
	hasBack?: boolean;
	isPlayerTurn?: boolean;
	lastThrown?: TileI;
}

const BottomPlayer = (props: Props) => {
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
		<div className={`row-section-${tilesSize} bottom`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
				<div className="htss">
					{player.hiddenTiles.map((tile: TileI) => {
						return <ShownTile key={tile.uuid} tile={tile} segment={Segment.bottom} last={lastThrown} />;
					})}
					{!isEmpty(player.lastTakenTile) && (
						<ShownTile
							key={player.lastTakenTile.uuid}
							tile={player.lastTakenTile}
							segment={Segment.bottom}
							highlight
							classSuffix="margin-left"
						/>
					)}
				</div>
			) : (
				<div className={`self-hidden-tiles-${handSize}`}>
					{player.hiddenTiles.map((tile: TileI) => {
						return (
							<HandTile
								key={tile.uuid}
								card={tile.card}
								selected={selectedTiles.includes(tile)}
								last={false}
								callback={() => selectTile(tile)}
							/>
						);
					})}
					{!isEmpty(player.lastTakenTile) && (
						<HandTile
							key={player.lastTakenTile.uuid}
							card={player.lastTakenTile.card}
							selected={selectedTiles.includes(player.lastTakenTile)}
							last={true}
							callback={() => selectTile(player.lastTakenTile)}
						/>
					)}
				</div>
			)}

			{/*------------------------------ Shown tiles ------------------------------*/}
			<div className="htss">
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<ShownTile key={tile.uuid} tile={tile} segment={Segment.bottom} last={lastThrown} />
					) : null;
				})}
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<ShownTile
							key={tile.uuid}
							tile={tile}
							segment={Segment.bottom}
							classSuffix={
								tile.isValidFlower ? (tile.suit === '动物' ? 'flower animal' : 'hts flower') : ''
							}
						/>
					) : null;
				})}
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<div className={`htsh unused bottom ${frontBackTag}`}>
				{unusedTiles.map(i => {
					return <div key={`bottom-unused-${i}`} className="vth" />;
				})}
			</div>

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="htss">
				{player.discardedTiles.map((tile: TileI) => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segment.bottom} last={lastThrown} />;
				})}
			</div>
		</div>
	);
};

export default React.memo(BottomPlayer);
