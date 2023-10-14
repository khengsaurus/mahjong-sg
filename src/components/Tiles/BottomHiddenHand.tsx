import { CustomFade, HandTile } from 'components';
import { Size, Transition } from 'enums';
import { AppContext } from 'hooks';
import { isEmpty } from 'lodash';
import { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import { Row } from 'style/StyledComponents';
import { revealTile } from 'utility';

interface IBottomHiddenHandP {
	hTs: IHiddenTile[];
	lTa?: IHiddenTile | IShownTile;
}

const BottomHiddenHand = ({ hTs, lTa }: IBottomHiddenHandP) => {
	const { selectedTiles, setSelectedTiles } = useContext(AppContext);
	const {
		sizes: { handSize },
		tHK
	} = useSelector((state: IStore) => state);
	const selectedTsRef = selectedTiles.map(tile => tile.r);

	const selectTile = useCallback(
		(tile: IShownTile) => {
			if (
				!selectedTiles.map(tile => tile.r).includes(tile.r) &&
				selectedTiles.length < 4
			) {
				const selected = [...selectedTiles, tile];
				setSelectedTiles(selected);
			} else {
				const selected = selectedTiles.filter(
					selectedTile => selectedTile.r !== tile.r
				);
				setSelectedTiles(selected);
			}
		},
		[selectedTiles, setSelectedTiles]
	);

	const renderHiddenHand = (hTs: IHiddenTile[], lTa: IHiddenTile) => {
		const revLTT = !isEmpty(lTa) ? revealTile(lTa, tHK) : null;
		return (
			<div
				className={`self-hidden-tiles-${handSize || Size.MEDIUM} ${
					!revLTT && 'transform-right'
				}`}
			>
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
					<CustomFade
						show={!!revLTT}
						timeout={{ enter: Transition.FAST, exit: Transition.INSTANT }}
					>
						<HandTile
							key={revLTT?.i}
							card={revLTT?.c}
							selected={selectedTsRef.includes(revLTT?.r)}
							last={true}
							callback={() => selectTile(revLTT)}
						/>
					</CustomFade>
				</div>
			</div>
		);
	};

	return renderHiddenHand(hTs, lTa);
};

export default BottomHiddenHand;
