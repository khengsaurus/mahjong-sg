import { useEffect, useState } from 'react';
import { ShownTileHeights, ShownTileWidths, Sizes } from '../../global/enums';

interface useDynamicWidthProps {
	ref: React.MutableRefObject<any>;
	tiles: number;
	tilesSize: Sizes;
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
	});

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
	});

	return windowHeight;
}

/**
 * Workaround for column-wrap div's not having dynamic width
 * https://stackoverflow.com/questions/33891709/when-flexbox-items-wrap-in-column-mode-container-does-not-grow-its-width
 */
export function useDynamicWidth({ ref, tiles, tilesSize, dealer = false, addHalfTile = false }: useDynamicWidthProps) {
	const windowHeight = useWindowHeight();
	useEffect(() => {
		let length = tiles + Number(dealer) + (addHalfTile ? 0.5 : 0);
		let shownTilesHeight = ref.current?.offsetHeight || 0;
		if (!!Number(length) && !!Number(shownTilesHeight) && ref.current) {
			let reqHeight = length * ShownTileWidths[tilesSize.toUpperCase()] + 1;
			let cols = Math.ceil(reqHeight / shownTilesHeight);
			let toSet = `${cols * ShownTileHeights[tilesSize.toUpperCase()]}px`;
			ref.current.style.width = toSet;
		}
	}, [windowHeight, ref, tiles, tilesSize, dealer, addHalfTile]);
}
