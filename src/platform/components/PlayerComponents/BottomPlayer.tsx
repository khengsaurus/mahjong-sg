import { isEmpty } from 'lodash';
import { DiscardedTiles, ShownTile, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FrontBackTag, Segment, Size } from 'shared/enums';
import { useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { IPlayerComponentProps } from 'shared/typesPlus';
import { getCardFromHashId, revealTile } from 'shared/util';
import BottomHiddenHand from '../Tiles/BottomHiddenHand';
import './playerComponents.scss';

const BottomPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];

	const {
		sizes: { tileSize },
		tHK
	} = useSelector((state: IStore) => state);
	const { flowers, nonFlowers, nonFlowerRefs, flowerRefs } = useTiles({
		sTs,
		allHiddenTiles,
		ms,
		toRotate: false
	});

	const shownHiddenHand = useCallback(
		(hTs: IHiddenTile[], lTa: IShownTile | IHiddenTile) => {
			const revLTT: IShownTile = !isEmpty(lTa) ? (!Number(lTa?.x) ? revealTile(lTa, tHK) : lTa) : null;
			return (
				<div className="htss">
					{hTs.map((tile: IHiddenTile) => {
						const revC = getCardFromHashId(tile.i, tHK);
						return <ShownTile key={tile.i} tileRef={tile.r} tileCard={revC} segment={Segment.BOTTOM} />;
					})}
					{revLTT && (
						<ShownTile
							key={revLTT.i}
							tileRef={revLTT.r}
							tileCard={revLTT.c}
							segment={Segment.BOTTOM}
							highlight
							classSuffix="margin-left"
						/>
					)}
				</div>
			);
		},
		[tHK]
	);

	const renderShownTiles = () => (
		<ShownTiles
			className="htss"
			nonFlowers={nonFlowers}
			// nonFlowers={[...hTs, ...nonFlowers]}
			flowers={flowers}
			flowerRefs={flowerRefs}
			nonFlowerRefs={nonFlowerRefs}
			segment={Segment.BOTTOM}
			dealer={dealer}
			tileSize={tileSize}
			lastThrownRef={lastThrown?.r}
		/>
	);

	const renderDiscardedTiles = () => (
		<DiscardedTiles
			className="htss discarded"
			tiles={dTs}
			// tiles={[...hTs, ...dTs]}
			segment={Segment.BOTTOM}
			lastThrownRef={lastThrown?.r}
		/>
	);

	return (
		<div className={`row-section-${tileSize || Size.MEDIUM} bottom`}>
			{sT ? shownHiddenHand(hTs, lTa) : <BottomHiddenHand hTs={hTs} lTa={lTa} />}
			{sTs?.length > 0 && renderShownTiles()}
			<UnusedTiles tiles={uTs} segment={Segment.BOTTOM} tag={frontBackTag} />
			{dTs?.length > 0 && renderDiscardedTiles()}
		</div>
	);
};

export default BottomPlayer;
