import { useEffect, useState } from 'react';
import { ShownTileHeights, ShownTileWidths, Sizes } from '../../global/enums';

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

interface Args {
	shownTilesRef: React.MutableRefObject<any>;
	nonFlowersLength: number;
	flowersLength: number;
	tilesSize: Sizes;
	dealer: boolean;
}

/**
 * Workaround for column-wrap div's not having dynamic width
 * https://stackoverflow.com/questions/33891709/when-flexbox-items-wrap-in-column-mode-container-does-not-grow-its-width
 */
export function useDynamicShownTilesWidth({ shownTilesRef, nonFlowersLength, flowersLength, tilesSize, dealer }: Args) {
	const windowHeight = useWindowHeight();
	useEffect(() => {
		let length = nonFlowersLength + flowersLength + Number(dealer);
		let shownTilesHeight = shownTilesRef.current?.offsetHeight || 0;
		if (!!Number(length) && !!Number(shownTilesHeight) && shownTilesRef.current) {
			let reqHeight = length * ShownTileWidths[tilesSize.toUpperCase()];
			let cols = Math.ceil(reqHeight / shownTilesHeight);
			let toSet = `${cols * ShownTileHeights[tilesSize.toUpperCase()]}px`;
			shownTilesRef.current.style.width = toSet;
		}
	}, [windowHeight, shownTilesRef, nonFlowersLength, flowersLength, tilesSize, dealer]);
}
