import { useEffect, useRef } from 'react';

const useFirstEffect = (effect: () => void) => {
	const mounted = useRef(false);

	useEffect(() => {
		if (!mounted.current) {
			effect();
			mounted.current = true;
		}
	}, [effect]);
};

export default useFirstEffect;
