import { isEmpty } from 'lodash';
import { DiscardedTiles, HiddenHand, ShownHiddenHand, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import { useDynamicWidth } from 'platform/hooks';
import { useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FrontBackTag, Segment, Size, _HiddenTileWidth } from 'shared/enums';
import { AppContext, useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { IPlayerComponentP } from 'shared/typesPlus';
import './playerComponents.scss';

const LeftPlayer = (props: IPlayerComponentP) => {
	const { player, dealer, hasFront, hasBack, lastThrown, highlight } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const { showBot } = useContext(AppContext);
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
		countTs: player.allHiddenTiles().length,
		tileSize,
		flag: sT || showBot,
		addPx: isEmpty(lTa) ? 0 : _HiddenTileWidth[tileSize]
	});

	return (
		<div className={`column-section-${tileSize || Size.MEDIUM}`}>
			{/* Hidden or shown hand */}
			{showBot || sT ? (
				<ShownHiddenHand
					className="vtss left"
					segment={Segment.LEFT}
					lastSuffix="margin-bottom"
					ref={shownHiddenHandRef}
					{...{ hTs, lTa, tHK }}
				/>
			) : (
				<HiddenHand tiles={countHandTiles} segment={Segment.LEFT} tileSize={tileSize} highlight={highlight} />
			)}

			{/* Shown tiles */}
			{(dealer || sTs?.length > 0) && (
				<ShownTiles
					className="vtss left"
					segment={Segment.LEFT}
					lastThrownId={lastThrown?.i}
					ref={shownTilesRef}
					{...{ dealer, flowers, nonFlowers, sT, tileSize }}
				/>
			)}

			{/* Unused tiles */}
			<UnusedTiles
				tiles={uTs}
				segment={Segment.LEFT}
				tag={hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null}
				tileSize={tileSize}
			/>

			{/* Discarded tiles */}
			{dTs?.length > 0 && <DiscardedTiles className="vtss left discarded" tiles={dTs} segment={Segment.LEFT} />}
		</div>
	);
};

export default LeftPlayer;
