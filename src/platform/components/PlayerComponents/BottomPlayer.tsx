import { BottomHiddenHand, DiscardedTiles, ShownHiddenHand, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import { useSelector } from 'react-redux';
import { FrontBackTag, Segment, Size } from 'shared/enums';
import { useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { IPlayerComponentP } from 'shared/typesPlus';
import './playerComponents.scss';

const BottomPlayer = (props: IPlayerComponentP) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const {
		sizes: { tileSize },
		tHK
	} = useSelector((state: IStore) => state);
	const { flowers, nonFlowers } = useTiles({
		sTs,
		ms,
		toRotate: false
	});

	return (
		<div className={`row-section-${tileSize || Size.MEDIUM} bottom`}>
			{/* Hidden or shown hand */}
			{sT ? (
				<ShownHiddenHand
					className="htss"
					segment={Segment.BOTTOM}
					lastSuffix="margin-left"
					{...{ hTs, lTa, tHK }}
				/>
			) : (
				<BottomHiddenHand hTs={hTs} lTa={lTa} />
			)}

			{/* Shown tiles */}
			{(dealer || sTs?.length > 0) && (
				<ShownTiles
					className="htss"
					segment={Segment.BOTTOM}
					lastThrownId={lastThrown?.i}
					{...{ dealer, flowers, nonFlowers, tileSize }}
					sT
				/>
			)}

			{/* Unused tiles */}
			<UnusedTiles
				tiles={uTs}
				segment={Segment.BOTTOM}
				tag={hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null}
				tileSize={tileSize}
			/>

			{/* Discarded tiles */}
			{dTs?.length > 0 && <DiscardedTiles className="htss discarded" tiles={dTs} segment={Segment.BOTTOM} />}
		</div>
	);
};

export default BottomPlayer;
