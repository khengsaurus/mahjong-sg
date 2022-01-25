import { DiscardedTiles, HiddenHand, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import ShownHiddenHand from 'platform/components/Tiles/ShownHiddenHand';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { FrontBackTag, Segment, Size } from 'shared/enums';
import { AppContext, useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { PlayerComponentProps } from 'shared/typesPlus';
import './playerComponents.scss';

const TopPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown, highlight } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const { revealBot } = useContext(AppContext);
	const allHiddenTiles = player?.allHiddenTiles() || [];
	const {
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
			{revealBot || sT ? (
				<ShownHiddenHand
					className="htss top"
					segment={Segment.TOP}
					lastSuffix="margin-right"
					{...{ hTs, lTa, tHK }}
				/>
			) : (
				<HiddenHand
					tiles={allHiddenTiles.length}
					segment={Segment.TOP}
					tileSize={tileSize}
					highlight={highlight}
				/>
			)}

			{/* Shown tiles */}
			{(dealer || sTs?.length > 0) && (
				<ShownTiles
					className="htss top"
					segment={Segment.TOP}
					lastThrownId={lastThrown?.i}
					{...{ dealer, flowers, nonFlowers, sT, tileSize }}
				/>
			)}

			{/* Unused tiles */}
			<UnusedTiles
				tiles={uTs}
				segment={Segment.TOP}
				tag={hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null}
				tileSize={tileSize}
			/>

			{/* Discarded tiles */}
			{dTs?.length > 0 && <DiscardedTiles className="htss top discarded" tiles={dTs} segment={Segment.TOP} />}
		</div>
	);
};

export default TopPlayer;
