import { AppContext } from 'hooks';
import { useContext, useMemo } from 'react';

const useHuLocked = () => {
	const { currGame } = useContext(AppContext);
	const { f, hu, ps } = currGame;

	const isHuLocked = useMemo(
		() => hu.length > 2 || f[5] || !!ps.find(p => p.sT || p.cfH),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[hu?.length, f[5], currGame?.psOpenRef() as string]
	);

	return { isHuLocked };
};

export default useHuLocked;
