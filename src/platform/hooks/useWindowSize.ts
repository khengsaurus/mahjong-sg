import { useCallback, useEffect, useMemo, useState } from 'react';
import { EEvent, Size, _ShownTileHeight, _ShownTileWidth } from 'shared/enums';
import { useWindowListener } from '.';

interface useDynamicWidthProps {
	ref: React.MutableRefObject<any>;
	tiles: number;
	tileSize: Size;
	dealer?: boolean;
	add?: number;
}

export function useWindowSize() {
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const handleResize = useCallback(() => {
		setWindowHeight(window.innerHeight);
		setWindowWidth(window.innerWidth);
	}, []);
	useWindowListener(EEvent.RESIZE, handleResize);

	return { height: windowHeight, width: windowWidth };
}

export function useWindowHeight() {
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);

	const handleResize = useCallback(() => {
		setWindowHeight(window.innerHeight);
	}, []);
	useWindowListener(EEvent.RESIZE, handleResize);

	return windowHeight;
}

/**
 * Workaround for column-wrap div's not having dynamic width
 * https://stackoverflow.com/questions/33891709/when-flexbox-items-wrap-in-column-mode-container-does-not-grow-its-width
 */
export function useDynamicWidth({ ref, tiles, tileSize, dealer = false, add = 0 }: useDynamicWidthProps) {
	const windowHeight = useWindowHeight();

	const colsReq = useMemo(() => {
		const length = tiles + Number(dealer);
		const maxColHeight = 0.85 * windowHeight; // Referenced in playerComponents.scss
		const reqHeight = length * _ShownTileWidth[tileSize] + add;
		const cols = maxColHeight >= reqHeight ? 1 : Number(maxColHeight) ? Math.ceil(reqHeight / maxColHeight) : 1;
		return cols;
	}, [add, dealer, tileSize, tiles, windowHeight]);

	return useEffect(() => {
		if (ref.current) {
			requestAnimationFrame(() => {
				ref.current.style.width = `${colsReq * _ShownTileHeight[tileSize]}px`;
			});
		}
	}, [colsReq, ref, tileSize]);
}
