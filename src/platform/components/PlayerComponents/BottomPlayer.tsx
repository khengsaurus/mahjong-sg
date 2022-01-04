import { DiscardedTiles, ShownHiddenHand, ShownTiles, SuspenseTiles, UnusedTiles } from 'platform/components/Tiles';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { FrontBackTag, Segment, Size, _ShownTileHeight, _ShownTileWidth } from 'shared/enums';
import { useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { IPlayerComponentProps } from 'shared/typesPlus';
import BottomHiddenHand from '../Tiles/BottomHiddenHand';
import './playerComponents.scss';

const BottomPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];
	const {
		theme: { tileColor },
		sizes: { tileSize },
		tHK
	} = useSelector((state: IStore) => state);
	const { flowers, nonFlowers, nonFlowerRefs, flowerRefs } = useTiles({
		sTs,
		ms,
		toRotate: false
	});

	return (
		<div className={`row-section-${tileSize || Size.MEDIUM} bottom`}>
			{/* Hidden or shown hand */}
			{sT ? (
				<Suspense
					fallback={
						<SuspenseTiles
							height={_ShownTileHeight[tileSize]}
							width={allHiddenTiles.length * _ShownTileWidth[tileSize]}
							color={tileColor}
							segment={Segment.BOTTOM}
						/>
					}
				>
					<ShownHiddenHand
						className="htss"
						{...{ hTs, lTa, tHK }}
						segment={Segment.BOTTOM}
						lastSuffix="margin-left"
					/>
				</Suspense>
			) : (
				<BottomHiddenHand hTs={hTs} lTa={lTa} />
			)}

			{/* Shown tiles */}
			{(dealer || sTs?.length > 0) && (
				<ShownTiles
					className="htss"
					nonFlowers={nonFlowers}
					flowers={flowers}
					flowerRefs={flowerRefs}
					nonFlowerRefs={nonFlowerRefs}
					segment={Segment.BOTTOM}
					dealer={dealer}
					tileSize={tileSize}
					lastThrownRef={lastThrown?.r}
				/>
			)}

			{/* Unused tiles */}
			<UnusedTiles tiles={uTs} segment={Segment.BOTTOM} tag={frontBackTag} />

			{/* Discarded tiles */}
			{dTs?.length > 0 && (
				<DiscardedTiles
					className="htss discarded"
					tiles={dTs}
					segment={Segment.BOTTOM}
					lastThrownRef={lastThrown?.r}
				/>
			)}
		</div>
	);
};

export default BottomPlayer;
