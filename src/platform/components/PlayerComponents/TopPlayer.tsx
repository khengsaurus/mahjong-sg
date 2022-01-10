import { DiscardedTiles, HiddenHand, ShownTiles, SuspenseTiles, UnusedTiles } from 'platform/components/Tiles';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { AppFlag, FrontBackTag, Segment, Size, _ShownTileHeight, _ShownTileWidth } from 'shared/enums';
import { useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { PlayerComponentProps } from 'shared/typesPlus';
import './playerComponents.scss';

const ShownHiddenHand = lazy(() => import('platform/components/Tiles/ShownHiddenHand'));

const TopPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const allHiddenTiles = player?.allHiddenTiles() || [];
	const {
		theme: { tileColor },
		sizes: { tileSize = Size.MEDIUM },
		tHK
	} = useSelector((state: IStore) => state);
	const { flowers, nonFlowers } = useTiles({
		sTs,
		ms
	});

	return (
		<div className={`row-section-${tileSize || Size.MEDIUM}`}>
			{/* Hidden or shown hand */}
			{process.env.REACT_APP_FLAG.startsWith(AppFlag.DEV_BOT) || sT ? (
				<Suspense
					fallback={
						<SuspenseTiles
							height={_ShownTileHeight[tileSize]}
							width={allHiddenTiles.length * _ShownTileWidth[tileSize]}
							color={tileColor}
							segment={Segment.TOP}
						/>
					}
				>
					<ShownHiddenHand
						className="htss top"
						{...{ hTs, lTa, tHK }}
						segment={Segment.TOP}
						lastSuffix="margin-right"
					/>
				</Suspense>
			) : (
				<HiddenHand tiles={allHiddenTiles.length} segment={Segment.TOP} />
			)}

			{/* Shown tiles */}
			{(dealer || sTs?.length > 0) && (
				<ShownTiles
					className="htss top"
					nonFlowers={nonFlowers}
					flowers={flowers}
					segment={Segment.TOP}
					dealer={dealer}
					tileSize={tileSize}
					lastThrownId={lastThrown?.i}
					sT
				/>
			)}

			{/* Unused tiles */}
			<UnusedTiles
				tiles={uTs}
				segment={Segment.TOP}
				tag={hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null}
			/>

			{/* Discarded tiles */}
			{dTs?.length > 0 && <DiscardedTiles className="htss top discarded" tiles={dTs} segment={Segment.TOP} />}
		</div>
	);
};

export default TopPlayer;
