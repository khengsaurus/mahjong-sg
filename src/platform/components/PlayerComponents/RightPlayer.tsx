import { DiscardedTiles, HiddenHand, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import ShownHiddenHand from 'platform/components/Tiles/ShownHiddenHand';
import { useDynamicWidth } from 'platform/hooks';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { AppFlag, FrontBackTag, Segment, Size, _HiddenTileWidth } from 'shared/enums';
import { useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { PlayerComponentProps } from 'shared/typesPlus';
import './playerComponents.scss';

const RightPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const countHandTiles = hTs?.length + (Number(lTa?.r) ? 1 : 0);
	const {
		sizes: { tileSize = Size.MEDIUM },
		tHK
	} = useSelector((state: IStore) => state);
	const { flowers, nonFlowers } = useTiles({
		sTs,
		ms
	});
	const shownTilesRef = useRef(null);
	useDynamicWidth({
		ref: shownTilesRef,
		countTs: nonFlowers.length + flowers.length,
		tileSize,
		add: dealer ? 1 : 0
	});
	const shownHiddenHandRef = useRef(null);
	useDynamicWidth({
		ref: shownHiddenHandRef,
		countTs: countHandTiles,
		tileSize,
		flag: sT,
		addPx: _HiddenTileWidth[tileSize]
	});

	return (
		<div className={`column-section-${tileSize || Size.MEDIUM} right`}>
			{/* Hidden or shown hand */}
			{process.env.REACT_APP_FLAG.startsWith(AppFlag.DEV_BOT) || sT ? (
				<ShownHiddenHand
					className="vtss col-r"
					segment={Segment.RIGHT}
					lastSuffix="margin-bottom"
					ref={shownHiddenHandRef}
					{...{ hTs, lTa, tHK }}
				/>
			) : (
				<HiddenHand tiles={countHandTiles} segment={Segment.RIGHT} tileSize={tileSize} />
			)}

			{/* Shown tiles */}
			{(dealer || sTs?.length > 0) && (
				<ShownTiles
					className="vtss"
					segment={Segment.RIGHT}
					lastThrownId={lastThrown?.i}
					ref={shownTilesRef}
					{...{ dealer, flowers, nonFlowers, sT, tileSize }}
				/>
			)}

			{/* Unused tiles */}
			<UnusedTiles
				tiles={uTs}
				segment={Segment.RIGHT}
				tag={hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null}
				tileSize={tileSize}
			/>

			{/* Discarded tiles */}
			{dTs?.length > 0 && <DiscardedTiles className="vtss discarded" tiles={dTs} segment={Segment.RIGHT} />}
		</div>
	);
};

export default RightPlayer;
