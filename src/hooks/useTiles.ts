import { useMemo } from 'react';
import { rotateShownTiles, sortShownTiles } from 'utility';

interface Args {
	sTs: IShownTile[];
	ms: string[];
	toRotate?: boolean;
}

const useTiles = (args: Args) => {
	const { sTs = [], ms = [], toRotate = true } = args;

	const { fs: flowers, nFs: nonFlowers } = useMemo(
		() => sortShownTiles(sTs),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[sTs?.map(tile => tile.i).join('')]
	);

	const rotatedNonFlowers = useMemo(
		() => (toRotate && ms.length > 0 ? rotateShownTiles(nonFlowers, ms) : nonFlowers),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[nonFlowers.length]
	);

	return { flowers, nonFlowers: rotatedNonFlowers };
};

export default useTiles;
