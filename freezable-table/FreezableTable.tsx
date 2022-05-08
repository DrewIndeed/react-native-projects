import React, { useRef } from 'react';
import { Animated, ScrollView } from 'react-native';
import {
  capitalizeWords,
  sliceDataObj,
  allErrorHandling,
  determineCase,
} from './utils';
import { Column, FreezableTableProps } from './types';
import Core from './Core';

export default function FreezableTable(props: FreezableTableProps) {
  // ! destructure Props object
  const {
    data,
    defaultWidth,
    columns,
    cellRenderer,
    freezeColNum,
    freezeRowNum,
    // mainContainerStyles,
    firstRowStyles,
    firstColStyles,
    bodyStyles,
    capHeader,
    upperHeader,
    innerBorderWidth,
  } = props;

  // ! error handling
  allErrorHandling(props);

  // ! extract all keys from columns
  const columnKeys: string[] = [];
  columns.map((col) => columnKeys.push(col.key));

  // ! accumulate columns width values if freezeColNum is defined
  // ** default width tracker
  let accWidth = defaultWidth;

  // ** extract all column widths
  const widths = columns.reduce((container: number[], item: Column) => {
    container.push(item.width ? item.width : defaultWidth);
    return container;
  }, []);

  // ** accumulate all column widths if there is
  if (widths && widths.length > 0) {
    accWidth = 0;
    for (let i = 0; i < (freezeColNum ? freezeColNum : 1); i++)
      accWidth += widths[i];
  }

  // ! anim values tracking refs
  const headerOffsetX = useRef(new Animated.Value(0)).current;
  const freezeColOffsetY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // ! header rows(s)
  // ** extract header row content
  const headers = columns.reduce(
    (container: string[], item: Column, idx: number) => {
      container.push(
        item.header
          ? typeof item.header !== 'string'
            ? item.header.toString()
            : item.header
          : Object.keys(data[0])[idx]
      );
      return container;
    },
    []
  );

  // ** populate header row dataframe with nitialheaders
  const headerRowDataFrame = [
    [
      ...headers.map((dt: any) => {
        const finalDt = typeof dt !== 'string' ? dt.toString() : dt;
        return capHeader
          ? upperHeader
            ? capitalizeWords(finalDt).toUpperCase()
            : capitalizeWords(finalDt)
          : upperHeader
          ? finalDt.toUpperCase()
          : finalDt;
      }),
    ],
  ];

  // ** adjust header row dataframe rendering based on freezeRowNum
  if (freezeRowNum && headerRowDataFrame.length <= data.length - 1) {
    for (let i = 0; i < freezeRowNum - 1; i++) {
      const extraHeaderData: string[] = Object.values(
        sliceDataObj(data[headerRowDataFrame.length - 1], columnKeys)
      );

      headerRowDataFrame.push([...extraHeaderData]);
    }
  }

  // ! compulsory style seed objects
  const compulsoryStyleSeed = {
    freezeColNum,
    innerBorderWidth,
    defaultWidth,
    firstRowStyles,
    firstColStyles,
    bodyStyles,
    widths,
  };

  // ! pick what to render based on freezeColNum and freezeRowNum values
  const caseResult = determineCase(freezeRowNum, freezeColNum);

  // ! Core Component with properly chosen parent
  return (
    <Core
      cellRenderer={cellRenderer}
      compulsoryStyleSeed={compulsoryStyleSeed}
      freezeColOffsetY={freezeColOffsetY}
      headerOffsetX={headerOffsetX}
      scrollViewRef={scrollViewRef}
      headerRowDataFrame={headerRowDataFrame}
      accWidth={accWidth}
      columnKeys={columnKeys}
      caseResult={caseResult}
      {...props}
    />
  );
}
