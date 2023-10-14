export interface IUseDynamicWidthProps {
  columnRef: MutableRefObject<any>;
  columnReverse?: boolean;
  wrapReverse?: boolean;
  maxHeight?: number;
  constantHeight?: boolean;
  constantWidth?: boolean;
  dependencies?: any[];
}

export interface IColumnProps {
  columnReverse?: boolean;
  wrapReverse?: boolean;
  maxHeight?: number;
  constantHeight?: boolean;
  constantWidth?: boolean;
  dependencies?: any[];
  children?: any;
  className?: string;
  style?: CSSProperties;
  id?: string;
  key?: string;
  effectOn?: boolean;
  testId?: string;
}

export interface IHeightWidth {
  height: number;
  width: number;
}
