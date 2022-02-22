import { Capacitor } from '@capacitor/core';
import { useCallback, useLayoutEffect, useState } from 'react';
import { EEvent, Platform, Size, _ShownTileHeight, _ShownTileWidth } from 'shared/enums';
import { isMobile } from 'shared/util';
import { useWindowListener } from '.';

interface IUseDynamicWidthP {
	ref: React.MutableRefObject<any>;
	countTs: number;
	tileSize: Size;
	flag?: boolean;
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
export function useDynamicWidth({ ref, countTs, tileSize, flag, add = 0, addPx = 0 }: IUseDynamicWidthP) {
	const windowHeight = useWindowHeight();

	return useLayoutEffect(() => {
		if (ref.current?.style) {
			const length = countTs + add;
			const maxColHeight = Math.floor(0.92 * windowHeight || 0); // IMPORTANT! used in playerComponents.scss
			// Hardcoding for iPhone 12 >
			if (
				maxColHeight <= 380 &&
				length >= 13 &&
				flag &&
				isMobile() &&
				Capacitor.getPlatform() === Platform.IOS &&
				(tileSize === Size.MEDIUM || tileSize === Size.LARGE)
			) {
				ref.current.style.width = `${2 * _ShownTileHeight[tileSize]}px`;
			} else {
				const reqHeight = length * _ShownTileWidth[tileSize] + addPx;
				const colsReq =
					maxColHeight >= reqHeight ? 1 : Number(maxColHeight) ? Math.ceil(reqHeight / maxColHeight) : 1;
				ref.current.style.width = `${colsReq * _ShownTileHeight[tileSize]}px`;
			}
		}
	}, [add, addPx, countTs, flag, ref, tileSize, windowHeight]);
}
