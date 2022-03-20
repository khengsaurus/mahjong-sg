import {
	DiscardedTiles,
	HiddenHand,
	ShownHiddenHand,
	ShownTiles,
	UnusedTiles
} from 'components';
import { FrontBackTag, Segment, Size } from 'enums';
import { AppContext, useTiles } from 'hooks';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import { IPlayerComponentP } from 'typesPlus';
import './playerComponents.scss';

const RightPlayer = (props: IPlayerComponentP) => {
	const { player, dealer, hasFront, hasBack, lastThrown, highlight, totalRounds } =
		props;
	const { hTs = [], sTs = [], ms, dTs = [], lTa = {}, uTs, sT } = player;
	const { showAI } = useContext(AppContext);
	const countHandTiles = hTs.length + (Number(lTa.r) ? 1 : 0);
	const {
		sizes: { tileSize = Size.MEDIUM },
		tHK
	} = useSelector((state: IStore) => state);
	const { flowers, nonFlowers } = useTiles({
		sTs,
		ms
	});

	return (
		<div className={`column-section-${tileSize || Size.MEDIUM} right`}>
			{/* Hidden or shown hand */}
			{showAI || sT ? (
				<ShownHiddenHand
					className="vtss col-r"
					segment={Segment.RIGHT}
					lastSuffix="margin-bottom"
					dependencies={[tileSize, showAI || sT, countHandTiles, totalRounds]}
					{...{ hTs, lTa, tHK, dealer }}
				/>
			) : (
				<HiddenHand
					segment={Segment.RIGHT}
					tiles={countHandTiles}
					tileSize={tileSize}
					highlight={highlight}
					dealer={dealer}
				/>
			)}

			{/* Shown tiles */}
			{(dealer || sTs.length > 0) && (
				<ShownTiles
					className="vtss"
					segment={Segment.RIGHT}
					lastThrownId={lastThrown?.i}
					dependencies={[sTs.length, totalRounds]}
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
			{dTs.length > 0 && (
				<DiscardedTiles
					className="vtss discarded"
					tiles={dTs}
					segment={Segment.RIGHT}
				/>
			)}
		</div>
	);
};

export default RightPlayer;
