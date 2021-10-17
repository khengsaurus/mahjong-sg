import { useMemo } from 'react';
import { rotateShownTiles, sortShownTiles } from '../utilFns';

interface Args {
	sTs: IShownTile[];
	melds: string[];
	allHiddenTiles: IHiddenTile[];
	toRotate?: boolean;
}

const useTiles = (args: Args) => {
	const { sTs = [], melds = [], allHiddenTiles = [], toRotate = true } = args;

	const shownCards = useMemo(() => {
		return sTs?.map(tile => tile.id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sTs.length]);

	const { flowers, nonFlowers, nonFlowerIds, flowerIds } = useMemo(() => {
		return sortShownTiles(sTs);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shownCards]);

	const rotatedNonFlowers = useMemo(() => {
		return toRotate && melds.length > 0 ? rotateShownTiles(nonFlowers, melds) : nonFlowers;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nonFlowerIds.length]);

	const hiddenCards = useMemo(() => {
		return allHiddenTiles.map(tile => tile.id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allHiddenTiles.length]);

	return { flowers, nonFlowers: rotatedNonFlowers, nonFlowerIds, flowerIds, hiddenCards };
};

export default useTiles;
