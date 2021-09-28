import { useEffect, useState } from 'react';

export function useWindowSize() {
	const [windowHeight, setWindowHeight] = useState(undefined);
	const [windowWidth, setWindowWidth] = useState(undefined);

	function handleResize() {
		setWindowHeight(window.innerHeight);
		setWindowWidth(window.innerWidth);
	}

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	});

	return { height: windowHeight, width: windowWidth };
}
