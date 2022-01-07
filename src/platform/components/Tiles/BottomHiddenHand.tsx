import { Fade } from '@mui/material';
import { isEmpty } from 'lodash';
import { HandTile } from 'platform/components/Tiles';
import { Row } from 'platform/style/StyledComponents';
import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Size, Transition } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { IStore } from 'shared/store';
import { revealTile, triggerHaptic } from 'shared/util';

interface IBottomHiddenHand {
	hTs: IHiddenTile[];
	lTa?: IHiddenTile | IShownTile;
}

const BottomHiddenHand = ({ hTs, lTa }: IBottomHiddenHand) => {
	const { selectedTiles, setSelectedTiles } = useContext(AppContext);
	const {
		sizes: { handSize },
		tHK
	} = useSelector((state: IStore) => state);
	const selectedTsRef = selectedTiles.map(tile => tile.r);

	const selectTile = useCallback(
		tile => {
			triggerHaptic();
			if (!selectedTiles.map(tile => tile.r).includes(tile.r) && selectedTiles.length < 4) {
				const selected = [...selectedTiles, tile];
				setSelectedTiles(selected);
			} else {
				const selected = selectedTiles.filter(selectedTile => selectedTile.r !== tile.r);
				setSelectedTiles(selected);
			}
		},
		[selectedTiles, setSelectedTiles]
	);

	const renderHiddenHand = useCallback(
		(hTs: IHiddenTile[], lTa: IHiddenTile) => {
			const revLTT = !isEmpty(lTa) ? revealTile(lTa, tHK) : null;
			return (
				<div className={`self-hidden-tiles-${handSize || Size.MEDIUM} ${!revLTT && 'transform-right'}`}>
					<Row>
						{hTs.map((tile: IHiddenTile) => {
							const revealedTile = revealTile(tile, tHK);
							return (
								<HandTile
									key={revealedTile.i}
									card={revealedTile.c}
									selected={selectedTsRef.includes(revealedTile.r)}
									last={false}
									callback={() => selectTile(revealedTile)}
								/>
							);
						})}
					</Row>
					<div>
						<Fade in={!!revLTT} timeout={{ enter: Transition.FAST, exit: Transition.INSTANT }}>
							<div>
								<HandTile
									key={revLTT?.i}
									card={revLTT?.c}
									selected={selectedTsRef.includes(revLTT?.r)}
									last={true}
									callback={() => selectTile(revLTT)}
								/>
							</div>
						</Fade>
					</div>
				</div>
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[JSON.stringify(selectedTsRef), handSize, tHK]
	);

	return renderHiddenHand(hTs, lTa);
};

export default BottomHiddenHand;
