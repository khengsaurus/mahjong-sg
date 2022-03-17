import { LocalFlag } from 'enums';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';

const useHuLocked = () => {
	const { game, gameId, localGame } = useSelector((state: IStore) => state);
	const { f, hu, ps } = gameId === LocalFlag ? localGame : game;
	const currGame = gameId === LocalFlag ? localGame : game;

	const isHuLocked = useMemo(
		() => {
			const isHuLocked = hu.length > 2 || f[5] || !!ps.find(p => p.sT || p.cfH);
			return isHuLocked;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[hu?.length, f[5], currGame?.psOpenRef() as string]
	);

	return { isHuLocked };
};

export default useHuLocked;
