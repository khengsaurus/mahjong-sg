import { useCallback, useEffect, useState } from 'react';

/**
 * Returns a number proxy for window size, changes on window resize.
 * Uses singletonHook from react-singleton-hook so that the proxy can be
 * referenced multiple times without re-calculation.
 *
 * @return proxy number for window size
 */
export function useWindowDimensions() {
	const [windowDimProxy, setWindowDimProxy] = useState(0);

	const handleResize = useCallback(() => {
		setWindowDimProxy(window.innerHeight + 1000 * window.innerWidth);
	}, []);

	useEffect(() => {
		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [handleResize]);

	return windowDimProxy;
}

export default useWindowDimensions;
