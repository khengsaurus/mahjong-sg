import { useCallback, useEffect, useState } from 'react';
import { EEvent, Size, _ShownTileHeight, _ShownTileWidth } from 'shared/enums';
import { useWindowListener } from '.';

interface useDynamicWidthProps {
	ref: React.MutableRefObject<any>;
	countTs: number;
	tileSize: Size;
	add?: number;
	addPx?: number;
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
	const handleResize = useCallback(() => setWindowHeight(window.innerHeight), []);

	useWindowListener(EEvent.RESIZE, handleResize);

	return windowHeight;
}

/**
 * Workaround for column-wrap div's not having dynamic width
 * https://stackoverflow.com/questions/33891709/when-flexbox-items-wrap-in-column-mode-container-does-not-grow-its-width
 */
export function useDynamicWidth({ ref, countTs, tileSize, add = 0, addPx = 0 }: useDynamicWidthProps) {
	const windowHeight = useWindowHeight();

	return useEffect(() => {
		if (ref.current?.style) {
			const length = countTs + add;
			const maxColHeight = 0.85 * windowHeight; // Referenced in playerComponents.scss
			const reqHeight = length * _ShownTileWidth[tileSize] + addPx;
			const colsReq =
				maxColHeight >= reqHeight ? 1 : Number(maxColHeight) ? Math.ceil(reqHeight / maxColHeight) : 1;

			ref.current.style.width = `${colsReq * _ShownTileHeight[tileSize]}px`;
		}
	}, [add, addPx, countTs, ref, tileSize, windowHeight]);
}
