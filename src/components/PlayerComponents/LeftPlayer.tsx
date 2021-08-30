import CasinoIcon from '@material-ui/icons/Casino';
import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
import { Segment } from '../../Enums';
import { User } from '../../Models/User';
import { generateNumberArray } from '../../util/utilFns';
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

const LeftPlayer = (props: Props) => {
	const { tilesSize, player, dealer, hasFront, hasBack, lastThrown } = props;
	const unusedTiles: number[] = useMemo(() => generateNumberArray(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? 'front' : hasBack ? 'back' : '';

	return (
		<div className={`column-section-${tilesSize}`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
				<div className="vtss left">
					{player.hiddenTiles.map(tile => {
						return <ShownTile key={tile.uuid} tile={tile} segment={Segment.left} />;
					})}
					{!isEmpty(player.lastTakenTile) && (
						<ShownTile
							key={player.lastTakenTile.uuid}
							tile={player.lastTakenTile}
							segment={Segment.left}
							classSuffix="margin-bottom"
							highlight
						/>
					)}
				</div>
			) : (
				<div className="vtsh">
					{player.allHiddenTiles().map(tile => {
						return <div key={tile.uuid} className="vth" />;
					})}
				</div>
			)}

			{/*------------------------------ Shown tiles ------------------------------*/}
			<div className="vtss left">
				{player.shownTiles.map(tile => {
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<ShownTile key={tile.uuid} tile={tile} segment={Segment.left} last={lastThrown} />
					) : null;
				})}
				{player.shownTiles.map(tile => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<ShownTile
							key={tile.uuid}
							tile={tile}
							segment={Segment.left}
							classSuffix={
								tile.isValidFlower ? (tile.suit === '动物' ? 'flower animal' : 'hts flower') : ''
							}
						/>
					) : null;
				})}
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<div className={`vtsh unused ${frontBackTag}`}>
				{unusedTiles.map(i => {
					return <div key={`left-unused-${i}`} className="vth" />;
				})}
			</div>

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="vtss left">
				{player.discardedTiles.map(tile => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segment.left} last={lastThrown} />;
				})}
			</div>
		</div>
	);
};

export default React.memo(LeftPlayer);
