import { useMemo } from 'react';
import { rotateShownTiles, sortShownTiles } from '../utilFns';

interface Args {
	shownTiles: ITile[];
	allHiddenTiles: ITile[];
	toRotate?: boolean;
}

const useTiles = (args: Args) => {
	const { shownTiles = [], allHiddenTiles = [], toRotate = true } = args;

	const shownCards = useMemo(() => {
		return shownTiles?.map(tile => tile.id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shownTiles.length]);

	const { flowers, nonFlowers, nonFlowerIds, flowerIds } = useMemo(() => {
		return sortShownTiles(shownTiles);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shownCards]);

	const rotatedNonFlowers = useMemo(() => {
		return toRotate ? rotateShownTiles(nonFlowers) : nonFlowers;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nonFlowerIds.length]);

	const hiddenCards = useMemo(() => {
		return allHiddenTiles.map(tile => tile.uuid);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allHiddenTiles.length]);

	return { flowers, nonFlowers: rotatedNonFlowers, nonFlowerIds, flowerIds, hiddenCards };
};

export default useTiles;
