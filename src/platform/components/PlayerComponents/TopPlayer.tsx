import { DiscardedTiles, HiddenHand, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import ShownHiddenHand from 'platform/components/Tiles/ShownHiddenHand';
import { useSelector } from 'react-redux';
import { AppFlag, FrontBackTag, Segment, Size } from 'shared/enums';
import { useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { PlayerComponentProps } from 'shared/typesPlus';
import './playerComponents.scss';

const TopPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
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
			{process.env.REACT_APP_FLAG.startsWith(AppFlag.DEV_BOT) || sT ? (
				<ShownHiddenHand
					className="htss top"
					segment={Segment.TOP}
					lastSuffix="margin-right"
					{...{ hTs, lTa, tHK }}
				/>
			) : (
				<HiddenHand tiles={allHiddenTiles.length} segment={Segment.TOP} tileSize={tileSize} />
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
