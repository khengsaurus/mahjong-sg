import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useWindowDimensions } from '.';
import { IUseDynamicWidthProps } from '../types';
import { getMinWidth } from '../util';

const wrapDirs = ['wrap', 'wrap-reverse'];
const columnDirs = ['column', 'column-reverse'];
const overrideWrap = ['none', 'nowrap'];
const overrideFlex = ['none', 'row', 'row-reverse'];
const overrideDisplay = ['none', 'inline', 'block', 'inline-block'];

/**
 * Custom hook using useEffect or useLayoutEffect (when window is defined) to
 * calculate minimum required width of element and set the following CSS properties:
 *
 * `display: flex`
 *
 * `flex-direction: column` or column-reverse if specified via styles or a css class
 *
 * `flex-wrap: wrap` or wrap-reverse if specified via styles or a css class
 */
const useDynamicWidth = ({
	columnRef,
	columnReverse = false,
	wrapReverse = false,
	maxHeight = 0,
	constantHeight = false,
	constantWidth = false,
	dependencies = []
}: IUseDynamicWidthProps) => {
	/**
	 * Proxy ref to detect changes in window dimensions
	 */
	const windowRef = useWindowDimensions();
	const children: HTMLDivElement[] = columnRef
		? Array.from(columnRef.current?.children || [])
		: [];

	return useEffect(() => {
		if (!!columnRef && !isEmpty(columnRef.current?.children)) {
			let { display, flexDirection, flexWrap } = window.getComputedStyle(
				columnRef.current
			);
			if (!display || overrideDisplay.includes(display)) {
				display = 'flex';
			}
			if (columnReverse) {
				flexDirection = 'column-reverse';
			} else if (!flexDirection || overrideFlex.includes(flexDirection)) {
				flexDirection = 'column';
			}
			if (wrapReverse) {
				flexWrap = 'wrap-reverse';
			} else if (!flexWrap || overrideWrap.includes(flexWrap)) {
				flexWrap = 'wrap';
			}

			if (
				display === 'flex' &&
				wrapDirs.includes(flexWrap) &&
				columnDirs.includes(flexDirection)
			) {
				const minWidth = getMinWidth(
					columnRef,
					constantHeight,
					constantWidth,
					maxHeight
				);
				if (maxHeight > 0) {
					columnRef.current.style.maxHeight = `${maxHeight}px`;
				}
				columnRef.current.style.display = display;
				columnRef.current.style.flexDirection = flexDirection;
				columnRef.current.style.flexWrap = flexWrap;
				columnRef.current.style.width = `${minWidth}px`;
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columnRef, children.length, windowRef, ...dependencies]);
};

export default useDynamicWidth;
