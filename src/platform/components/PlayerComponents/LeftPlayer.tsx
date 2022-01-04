import { DiscardedTiles, HiddenHand, ShownTiles, SuspenseTiles, UnusedTiles } from 'platform/components/Tiles';
import { useDynamicWidth } from 'platform/hooks';
import { lazy, Suspense, useRef } from 'react';
import { useSelector } from 'react-redux';
import { AppFlag, FrontBackTag, Segment, Size, _ShownTileHeight, _ShownTileWidth } from 'shared/enums';
import { useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { IPlayerComponentProps } from 'shared/typesPlus';
import './playerComponents.scss';

const ShownHiddenHand = lazy(() => import('platform/components/Tiles/ShownHiddenHand'));

const LeftPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const frontBackTag = hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null;
	const allHiddenTiles = player?.allHiddenTiles() || [];
	const {
		theme: { tileColor },
		sizes: { tileSize = Size.MEDIUM },
		tHK
	} = useSelector((state: IStore) => state);
	const { flowers, nonFlowers, nonFlowerRefs, flowerRefs } = useTiles({
		sTs,
		ms
	});
	const shownTilesRef = useRef(null);
	useDynamicWidth({
		ref: shownTilesRef,
		tiles: nonFlowers.length + flowers.length,
		tileSize,
		dealer
	});
	const shownHiddenHandRef = useRef(null);
	useDynamicWidth({
		ref: shownHiddenHandRef,
		tiles: player.allHiddenTiles().length,
		tileSize,
		add: 6
	});

	return (
		<div className={`column-section-${tileSize || Size.MEDIUM}`}>
			{/* Hidden or shown hand */}
			{process.env.REACT_APP_FLAG.startsWith(AppFlag.DEV_BOT) || sT ? (
				<Suspense
					fallback={
						<SuspenseTiles
							height={_ShownTileHeight[tileSize]}
							width={allHiddenTiles.length * _ShownTileWidth[tileSize]}
							color={tileColor}
							segment={Segment.LEFT}
						/>
					}
				>
					<ShownHiddenHand
						className="vtss left"
						{...{ hTs, lTa, tHK }}
						segment={Segment.LEFT}
						lastSuffix="margin-bottom"
						ref={shownHiddenHandRef}
					/>
				</Suspense>
			) : (
				<HiddenHand tiles={allHiddenTiles.length} segment={Segment.LEFT} />
			)}

			{/* Shown tiles */}
			{(dealer || sTs?.length > 0) && (
				<ShownTiles
					className="vtss left"
					nonFlowers={nonFlowers}
					flowers={flowers}
					flowerRefs={flowerRefs}
					nonFlowerRefs={nonFlowerRefs}
					segment={Segment.LEFT}
					dealer={dealer}
					tileSize={tileSize}
					lastThrownRef={lastThrown?.r}
					ref={shownTilesRef}
				/>
			)}

			{/* Unused tiles */}
			<UnusedTiles tiles={uTs} segment={Segment.LEFT} tag={frontBackTag} />

			{/* Discarded tiles */}
			{dTs?.length > 0 && (
				<DiscardedTiles
					className="vtss left discarded"
					tiles={dTs}
					segment={Segment.LEFT}
					lastThrownRef={lastThrown?.r}
				/>
			)}
		</div>
	);
};

export default LeftPlayer;
