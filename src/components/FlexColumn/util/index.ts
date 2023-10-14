import { MutableRefObject } from "react";
import { IHeightWidth } from "../types";

/**
 * @param rem: units in rem
 * @return value in px
 */
function remToPixels(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

/**
 * @param str: height as string, with units
 * @param unitLength: length of the unit of str
 * @return numerical value of str without units
 */
function getNums(str: string, unitLength: number): number {
  return Number(str.slice(0, str.length - unitLength)) || 0;
}

/**
 * Get the max-height of a element reference, parsing the string value with unit '%' | 'px' | 'vh' | 'vw' | 'em' | 'rem' to a number (unit of pixel).
 * @param ref React.MutableRefObject containing the node to calculate
 * @return maximum height in px, inclusive of margin, padding and borders
 */
function getMaxHeight(ref: MutableRefObject<any>): number {
  const { height, maxHeight } = window.getComputedStyle(ref.current);
  const _maxH: string = maxHeight === "none" || !maxHeight ? height : maxHeight;

  if (_maxH.endsWith("px")) {
    return getNums(_maxH, 2);
  } else if (_maxH.endsWith("%")) {
    /**
     * Calculate height as percentage of parent element's height
     */
    const { height: parentHeight = "0" } = window.getComputedStyle(
      ref.current.parentNode
    );
    const percentage = getNums(_maxH, 1);
    return (
      (Number(parentHeight.slice(0, parentHeight.length - 2)) * percentage) /
      100
    );
  } else if (_maxH.endsWith("em")) {
    const fontSize = parseFloat(getComputedStyle(ref.current).fontSize) || 0;
    const units = getNums(_maxH, 2);
    return fontSize * units;
  } else if (_maxH.endsWith("rem")) {
    return remToPixels(getNums(_maxH, 3));
  } else {
    /**
     * Note: vh and vw will be auto-converted to px in some browsers
     */
    const units = getNums(_maxH, 2);
    if (_maxH.endsWith("vh")) {
      return (units * window.innerHeight) / 100;
    }
    if (_maxH.endsWith("vw")) {
      return (units * window.innerWidth) / 100;
    }
  }
  return 0;
}

/**
 * @param child HTMLDivElement
 * @return object {height: number, width: number} of the element in px, inclusive of margins, padding and borders
 */
function getHeightWidth(child: HTMLDivElement): IHeightWidth {
  const styles = window.getComputedStyle(child);
  let _height = Math.ceil(
    child.offsetHeight +
      parseFloat(styles["marginTop"]) +
      parseFloat(styles["marginBottom"])
  );
  let _width = Math.ceil(
    child.offsetWidth +
      parseFloat(styles["marginLeft"]) +
      parseFloat(styles["marginRight"])
  );
  if (!_height || !_width) {
    // For testing
    const { height, width } = child.style;
    if (height.endsWith("px")) {
      _height = getNums(height, 2);
    }
    if (width.endsWith("px")) {
      _width = getNums(width, 2);
    }
  }

  return { height: _height, width: _width };
}

/**
 * Get the minimum width of an element by iterating over its children.
 * @param ref React.MutableRefObject containing the column node
 * @param constantHeight take height of first child as reference for the others
 * @param constantWidth take width of first child as reference for the others
 * @return minimum width of element required to contain all its children in a column/-reverse wrap/-reverse flex format
 */
export function getMinWidth(
  ref: MutableRefObject<any>,
  constantHeight = false,
  constantWidth = false,
  setMaxHeight = 0
): number {
  let oldHeight = 0;
  let oldWidth = 0;
  let reqWidth = 0;
  let _cHeight = 0;
  let _cWidth = 0;
  const children: HTMLDivElement[] = [].slice.call(ref.current?.children);
  if (children.length === 0) {
    return 0;
  }
  const maxHeight = setMaxHeight > 0 ? setMaxHeight : getMaxHeight(ref);
  /**
   * Get dimensions of first child as reference
   */
  if (constantHeight || constantWidth) {
    const { height, width } = getHeightWidth(children[0]);
    _cHeight = height;
    _cWidth = width;
  }
  children.forEach((child: HTMLDivElement) => {
    /**
     * If not constantHeight or not constantWidth, re-assign values on each iteration. Else, re-use _cHeight and _cWidth
     */
    if (!constantHeight || !constantWidth) {
      const { height, width } = getHeightWidth(child);
      if (!constantHeight) {
        _cHeight = height;
      }
      if (!constantWidth) {
        _cWidth = width;
      }
    }
    const newHeight = oldHeight + _cHeight;
    if (newHeight > maxHeight) {
      /**
       * Scenario 1: max column height exceeded
       * Add column, incrementing required width by new element width
       */
      oldHeight = _cHeight;
      oldWidth = _cWidth;
      reqWidth += _cWidth;
    } else {
      /**
       * Scenario 2: max column height not exceeded
       * Update current (last) column height and increment width if latest element is the widest element in this column
       */
      oldHeight = newHeight;
      if (_cWidth > oldWidth) {
        reqWidth += _cWidth - oldWidth;
        oldWidth = _cWidth;
      }
    }
  });
  return reqWidth;
}
