export type Column = {
  width?: number;
  header: string | number;
  key: string;
  mergeRequests?: {
    row: number;
    amount: number;
  }[];
};

export interface FreezableTableProps {
  data: object[];
  defaultWidth: number;
  columns: Column[];

  cellRenderer?: (key: any, value: any, row: any) => any;
  freezeColNum?: number;
  freezeRowNum?: number;

  mainContainerStyles?: object;
  firstRowStyles?: object;
  firstColStyles?: object;
  bodyStyles?: object;

  capHeader?: boolean;
  upperHeader?: boolean;
  innerBorderWidth?: number;
}
