import { useEffect, useRef } from 'react';

const useFirstEffect = (effect: () => void, deps: any[] = []) => {
	const mounted = useRef(false);

	useEffect(() => {
		mounted.current = false;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps]);

	useEffect(() => {
		if (!mounted.current) {
			effect();
			mounted.current = true;
		}
	}, [effect]);
};

export default useFirstEffect;
