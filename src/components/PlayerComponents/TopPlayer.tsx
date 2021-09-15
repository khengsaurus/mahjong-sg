import CasinoIcon from '@material-ui/icons/Casino';
import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
import { FrontBackTag, IPlayerComponentProps, Segments, Sizes } from '../../global/enums';
import { comparePlayerProps, rotateShownTiles, sortShownTiles } from '../../util/utilFns';
import HiddenHand from './HiddenTiles/HiddenHand';
import UnusedTiles from './HiddenTiles/UnusedTiles';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';

const TopPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, tilesSize } = props;
	let frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;
	console.log('Rendering top');

	const { flowers, nonFlowers } = useMemo(() => {
		return sortShownTiles(player.shownTiles);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player.shownTiles.length]);

	const rotatedNonFlowers = useMemo(() => {
		return rotateShownTiles(nonFlowers);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nonFlowers.length]);

	return (
		<div className={`row-section-${tilesSize || Sizes.medium}`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
				<div className="htss top">
					{player.hiddenTiles.map((tile: ITile) => {
						return <ShownTile key={tile.uuid} tile={tile} segment={Segments.top} last={lastThrown} />;
					})}
					{!isEmpty(player.lastTakenTile) && (
						<ShownTile
							key={player.lastTakenTile.uuid}
							tile={player.lastTakenTile}
							segment={Segments.top}
							highlight
							classSuffix="margin-right"
						/>
					)}
				</div>
			) : (
				<HiddenHand tiles={player.allHiddenTiles().length} segment={Segments.top} />
			)}

			{/*------------------------------ Shown tiles ------------------------------*/}
			<div className="htss top">
				{nonFlowers.length > 0 &&
					rotatedNonFlowers.map(tile => {
						return <ShownTile key={tile.uuid} tile={tile} segment={Segments.top} last={lastThrown} />;
					})}
				{flowers.map(tile => {
					return (
						<ShownTile
							key={tile.uuid}
							tile={tile}
							segment={Segments.top}
							classSuffix={
								tile.isValidFlower ? (tile.suit === '动物' ? 'flower animal' : 'hts flower') : ''
							}
						/>
					);
				})}
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<UnusedTiles tiles={player.unusedTiles} segment={Segments.top} tag={frontBackTag} />

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="htss top">
				{player.discardedTiles.map((tile: ITile) => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segments.top} last={lastThrown} />;
				})}
			</div>
		</div>
	);
};

export default React.memo(TopPlayer, comparePlayerProps);
