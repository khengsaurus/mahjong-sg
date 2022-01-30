import { isEmpty } from 'lodash';
import { DiscardedTiles, HiddenHand, ShownHiddenHand, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import { useDynamicWidth } from 'platform/hooks';
import { useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FrontBackTag, Segment, Size, _HiddenTileWidth } from 'shared/enums';
import { AppContext, useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { PlayerComponentProps } from 'shared/typesPlus';
import './playerComponents.scss';

const RightPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, highlight } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const { revealBot } = useContext(AppContext);
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
		flag: sT || revealBot,
		addPx: isEmpty(lTa) ? 0 : _HiddenTileWidth[tileSize]
	});

	return (
		<div className={`column-section-${tileSize || Size.MEDIUM} right`}>
			{/* Hidden or shown hand */}
			{revealBot || sT ? (
				<ShownHiddenHand
					className="vtss col-r"
					segment={Segment.RIGHT}
					lastSuffix="margin-bottom"
					ref={shownHiddenHandRef}
					{...{ hTs, lTa, tHK }}
				/>
			) : (
				<HiddenHand tiles={countHandTiles} segment={Segment.RIGHT} tileSize={tileSize} highlight={highlight} />
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
