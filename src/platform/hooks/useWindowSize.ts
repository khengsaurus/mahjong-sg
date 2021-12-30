import { useEffect, useState } from 'react';
import { ShownTileHeight, ShownTileWidth, Size } from 'shared/enums';

interface useDynamicWidthProps {
	ref: React.MutableRefObject<any>;
	tiles: number;
	tileSize: Size;
	dealer?: boolean;
	addHalfTile?: boolean;
}

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
	}, []);

	return { height: windowHeight, width: windowWidth };
}

export function useWindowHeight() {
	const [windowHeight, setWindowHeight] = useState(undefined);

	function handleResize() {
		setWindowHeight(window.innerHeight);
	}

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowHeight;
}

/**
 * Workaround for column-wrap div's not having dynamic width
 * https://stackoverflow.com/questions/33891709/when-flexbox-items-wrap-in-column-mode-container-does-not-grow-its-width
 */
export function useDynamicWidth({ ref, tiles, tileSize, dealer = false, addHalfTile = false }: useDynamicWidthProps) {
	const windowHeight = useWindowHeight();
	useEffect(() => {
		const length = tiles + Number(dealer) + (addHalfTile ? 0.5 : 0);
		const shownTilesHeight = ref.current?.offsetHeight || 0;
		if (!!Number(length) && !!Number(shownTilesHeight) && ref.current) {
			const reqHeight = length * ShownTileWidth[tileSize.toUpperCase()] + 1;
			const cols = Math.ceil(reqHeight / shownTilesHeight);
			const toSet = `${cols * ShownTileHeight[tileSize.toUpperCase()]}px`;
			ref.current.style.width = toSet;
		}
	}, [windowHeight, ref, tiles, tileSize, dealer, addHalfTile]);
}
