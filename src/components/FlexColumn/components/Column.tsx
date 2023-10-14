import React, { forwardRef, MutableRefObject, useRef } from "react";
import { useDynamicWidth } from "../hooks";
import { IColumnProps } from "../types";

/**
 * A flex div with `flex-flow: column wrap` by default. Its width will expand to contain its children.
 * Supports column-reverse and wrap-reverse if passed via props, styles or css class, but will override other display and flex-wrap styles.
 *
 * Important! The column's max-height or height has to be specified via the maxHeight prop, styles or css class (in px, %, vh, vw, em or rem)
 * @param id optional
 * @param key optional
 * @param ref React.MutableRefObject<any> to be forwarded to the core parent div
 * @param className optional class name conferring styles
 * @param style optional in-line styles
 * @param columnReverse default false - if true the component will have `flex-direction: column-reverse` regardless of in-line style or css class
 * @param wrapReverse default false - if true the component will have `flex-wrap: wrap-reverse` regardless of in-line style or css class
 * @param maxHeight default 0 - if a value greater than 0 is provided, it will be set as the component's maximum height in px
 * @param constantHeight default false - if true the first child's height will be taken as reference for the others
 * @param constantWidth default false - if true the first child's width will be taken as reference for the others
 * @param dependencies optional dependencies for the core hook used to set the component's width
 * @param effectOn default true - set the effect on or off
 * @param testId optional - testId to be assigned to the Component. If not provided, if id is provided it be appended to `rcfw-c-`. If neither are provided, the Component will have testId of `rcfw-c`
 */
const Column = forwardRef<MutableRefObject<any>, IColumnProps>(
  (props: IColumnProps, ref?: MutableRefObject<any>) => {
    const rand = Math.random();
    const {
      id = `column-wrap-id-${rand}`,
      key = `column-wrap-key-${rand}`,
      children,
      className = "",
      style = {},
      constantHeight = false,
      constantWidth = false,
      columnReverse = false,
      wrapReverse = false,
      maxHeight = 0,
      dependencies = [],
      effectOn = true,
      testId = "",
    } = props;

    const _ref = useRef<MutableRefObject<any>>(null);
    const columnRef = effectOn ? ref || _ref : null;

    /**
     * Call to main hook to set component size.
     */
    useDynamicWidth({
      columnRef,
      columnReverse,
      wrapReverse,
      maxHeight,
      constantHeight,
      constantWidth,
      dependencies,
    });

    return (
      <div
        id={id}
        key={key}
        className={className}
        style={style}
        ref={columnRef}
        data-testid={testId ? "rcfw-c-" + testId : "rcfw-c"}
      >
        {children}
      </div>
    );
  }
);

export default Column;
