import CasinoIcon from '@material-ui/icons/Casino';
import isEmpty from 'lodash.isempty';
import React, { useContext, useMemo } from 'react';
import { FrontBackTag, IPlayerComponentProps, Segments, Sizes } from '../../global/enums';
import { AppContext } from '../../util/hooks/AppContext';
import { comparePlayerProps, sortShownTiles } from '../../util/utilFns';
import { HandTile } from './HandTile';
import UnusedTiles from './HiddenTiles/UnusedTiles';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';
import ShownTile from './ShownTile';

const BottomPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { tilesSize, handSize, selectedTiles, setSelectedTiles } = useContext(AppContext);
	let frontBackTag = hasFront ? FrontBackTag.front : hasBack ? FrontBackTag.back : null;
	console.log('Rendering bottom');

	const { flowers, nonFlowers } = useMemo(() => {
		return sortShownTiles(player.shownTiles);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player.shownTiles.length]);

	function selectTile(tile: ITile) {
		if (!selectedTiles.includes(tile) && selectedTiles.length < 4) {
			setSelectedTiles([...selectedTiles, tile]);
		} else {
			setSelectedTiles(selectedTiles.filter(selectedTile => selectedTile.id !== tile.id));
		}
	}

	return (
		<div className={`row-section-${tilesSize || Sizes.medium} bottom`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
				<div className="htss">
					{player.hiddenTiles.map((tile: ITile) => {
						return <ShownTile key={tile.uuid} tile={tile} segment={Segments.bottom} last={lastThrown} />;
					})}
					{!isEmpty(player.lastTakenTile) && (
						<ShownTile
							key={player.lastTakenTile.uuid}
							tile={player.lastTakenTile}
							segment={Segments.bottom}
							highlight
							classSuffix="margin-left"
						/>
					)}
				</div>
			) : (
				<div className={`self-hidden-tiles-${handSize || Sizes.medium}`}>
					{player.hiddenTiles.map((tile: ITile) => {
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
				{nonFlowers.map((tile: ITile) => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segments.bottom} last={lastThrown} />;
				})}
				{flowers.map((tile: ITile) => {
					return (
						<ShownTile
							key={tile.uuid}
							tile={tile}
							segment={Segments.bottom}
							classSuffix={
								tile.isValidFlower ? (tile.suit === '动物' ? 'flower animal' : 'hts flower') : ''
							}
						/>
					);
				})}
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<UnusedTiles tiles={player.unusedTiles} segment={Segments.bottom} tag={frontBackTag} />

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="htss">
				{player.discardedTiles.map((tile: ITile) => {
					return <ShownTile key={tile.uuid} tile={tile} segment={Segments.bottom} last={lastThrown} />;
				})}
			</div>
		</div>
	);
};

export default React.memo(BottomPlayer, comparePlayerProps);
