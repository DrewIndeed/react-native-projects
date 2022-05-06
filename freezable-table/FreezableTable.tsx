import React, { useRef } from 'react';
import { Animated, Text, View, ScrollView } from 'react-native';
import {
  capitalizeWords,
  sliceDataObj,
  allErrorHandling,
  determineCase,
  generateCompulsoryStyles,
} from './utils';
import { Column, FreezableTableProps } from './types';
import { FreezableTableMainSheet } from './stylesheets';
import FreezableCore from './FreezableCore';
import PickContainer from './PickContainer';

export default function FreezableTable(props: FreezableTableProps) {
  // ! destructure Props object
  const {
    data,
    defaultWidth,
    columns,
    cellRenderer,
    freezeColNum,
    freezeRowNum,
    mainContainerStyles,
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

  // ! header row component
  const HeaderRow = ({
    headerRowData,
    rowOrder,
    hidden,
  }: {
    headerRowData: string[];
    rowOrder: number;
    hidden: boolean;
  }) => {
    return (
      <Animated.View
        style={[
          FreezableTableMainSheet.headerRowContainer,
          !hidden && {
            transform: [
              {
                translateX: Animated.multiply(
                  headerOffsetX,
                  new Animated.Value(-1)
                ),
              },
            ],
          },
        ]}
      >
        {headerRowData.map((content: string, idx: number) => (
          <View
            style={generateCompulsoryStyles(
              innerBorderWidth,
              hidden,
              freezeColNum,
              widths,
              defaultWidth,
              firstRowStyles,
              firstColStyles,
              bodyStyles,
              false
            )(rowOrder, idx)}
            key={`freeze-row-${rowOrder}-cell-${idx}`}
          >
            <Text>{content}</Text>
          </View>
        ))}
      </Animated.View>
    );
  };

  // ! data row component
  const DataRow = ({
    dataItem,
    rowOrder,
    hidden,
  }: {
    dataItem: { [key: string]: any };
    rowOrder: number;
    hidden?: boolean;
  }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {columnKeys.map((key: string, idx: number) => {
          // ** compulsory style
          const compulsoryStyleArr = generateCompulsoryStyles(
            innerBorderWidth,
            hidden,
            freezeColNum,
            widths,
            defaultWidth,
            firstRowStyles,
            firstColStyles,
            bodyStyles,
            true
          )(rowOrder, idx);

          // ** if cellRenderer is specified, render based in cellRenderer value
          if (cellRenderer) {
            // get return value from cellRenderer
            const cellValue = cellRenderer(key, dataItem[key], dataItem);

            // ** if cellRenderer return value is not a Component
            if (
              typeof cellValue === 'function' &&
              !!cellValue.prototype.isReactComponent
            ) {
              return (
                <View
                  style={compulsoryStyleArr}
                  key={`data-row-${rowOrder}-cell-${idx}`}
                >
                  <Text>{cellValue}</Text>
                </View>
              );
            }

            // ** otherwise, clone the component and handle its props
            return React.cloneElement(cellValue, {
              ...cellValue.props,
              style: [...compulsoryStyleArr, cellValue.props.style],
              key: `data-row-${rowOrder}-cell-${idx}`,
            });
          }

          // ** otherwise, return default data from data source
          return (
            <View
              style={compulsoryStyleArr}
              key={`data-row-${rowOrder}-cell-${idx}`}
            >
              <Text>{dataItem[key]}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  // ! pick what to render based on freezeColNum and freezeRowNum values
  const caseResult = determineCase(freezeRowNum, freezeColNum);

  // ! FreezableCore Component with properly chosen parent
  return (
    <PickContainer
      caseResult={caseResult}
      styleArray={[FreezableTableMainSheet.mainContainer, mainContainerStyles]}
      renderCore={(customKey: string) => (
        <FreezableCore
          key={customKey}
          HeaderRow={HeaderRow}
          DataRow={DataRow}
          freezeColOffsetY={freezeColOffsetY}
          headerOffsetX={headerOffsetX}
          freezeRowNum={freezeRowNum}
          freezeColNum={freezeColNum}
          scrollViewRef={scrollViewRef}
          data={data}
          headerRowDataFrame={headerRowDataFrame}
          columnKeys={columnKeys}
          defaultWidth={defaultWidth}
          accWidth={accWidth}
        />
      )}
    />
  );
}
