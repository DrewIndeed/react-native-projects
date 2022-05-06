import React, { useRef, useState } from 'react';
import { Animated, Text, View, ScrollView } from 'react-native';
import {
  capitalizeWords,
  sliceDataObj,
  allErrorHandling,
  determineCase,
} from './utils';
import { Column, FreezableTableProps } from './types';
import { FreezableTableMainSheet } from './stylesheets';

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
  const scrollViewRef1 = useRef<ScrollView>(null);

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
    hidden,
    headerRowData,
    rowOrder,
  }: {
    hidden: boolean;
    headerRowData: string[];
    rowOrder: number;
  }) => {
    // ! compulsory style containers for first and following cells
    let commonCellsStyles: any = {
      borderWidth: innerBorderWidth || 1,
      textAlign: 'center',
      backgroundColor: '#fff',
      padding: 10,
    };
    const headerCellsStyles: any = {
      otherCells: {
        style: {
          ...commonCellsStyles,
          opacity: hidden ? 0 : 1,
        },
      },
      firstCell: {
        style: {
          ...commonCellsStyles,
          // ! Toggle display of first cell of header / freeze column here
          opacity: hidden ? 1 : 0,
        },
      },
    };

    // ! generate must-have style array for header cell
    const compulsoryStyles = (rowOrder: number, idx: number) => [
      (freezeColNum ? idx < freezeColNum : idx < 1)
        ? headerCellsStyles.firstCell.style
        : headerCellsStyles.otherCells.style,
      { width: widths[idx] || defaultWidth },
      rowOrder === 0 && firstRowStyles,
      rowOrder > 0 && idx === 0 && firstColStyles,
      rowOrder > 0 && idx > 0 && bodyStyles,
    ];

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
          <Text
            style={compulsoryStyles(rowOrder, idx)}
            key={`freeze-row-${rowOrder}-cell-${idx}`}
            onPress={() =>
              alert(`(header_row, header_col) : (${rowOrder}, ${idx})`)
            }
          >
            {content}
          </Text>
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
    // ! compulsory style containers for first and following cells
    const commonCellsStyles: any = {
      borderWidth: innerBorderWidth || 1,
      backgroundColor: '#fff',
      padding: 10,
    };
    const dataRowStyles: any = {
      firstCell: {
        style: {
          ...commonCellsStyles,
          display: 'flex',
          opacity: hidden ? 1 : 0,
        },
      },
      otherCells: {
        style: {
          ...commonCellsStyles,
          opacity: hidden ? 0 : 1,
        },
      },
    };

    // ! generate must-have style array for data cell
    const compulsoryStyles = (rowOrder: number, idx: number) => [
      (freezeColNum ? idx < freezeColNum : idx < 1)
        ? dataRowStyles.firstCell.style
        : dataRowStyles.otherCells.style,
      { width: widths[idx] || defaultWidth },
      rowOrder >= 0 && idx === 0 && firstColStyles,
      rowOrder >= 0 && idx > 0 && bodyStyles,
    ];

    // ! return header row component
    return (
      <View style={{ flexDirection: 'row' }}>
        {columnKeys.map((key: string, idx: number) => {
          // ** if cellRenderer is specified, render based in cellRenderer value
          if (cellRenderer) {
            const cellValue = cellRenderer(key, dataItem[key], dataItem);

            // ** if cellRenderer return value has typeof string
            if (typeof cellValue === 'string') {
              return (
                <View
                  style={compulsoryStyles(rowOrder, idx)}
                  key={`data-row-${rowOrder}-cell-${idx}`}
                >
                  <Text>{cellValue}</Text>
                </View>
              );
            }

            // ** otherwise, clone the component and handle its props
            return React.cloneElement(cellValue, {
              ...cellValue.props,
              style: [
                ...compulsoryStyles(rowOrder, idx),
                cellValue.props.style,
              ],
              key: `data-row-${rowOrder}-cell-${idx}`,
            });
          }

          // ** otherwise, return string 'Empty'
          return (
            <View
              style={compulsoryStyles(rowOrder, idx)}
              key={`data-row-${rowOrder}-cell-${idx}`}
            >
              <Text>{dataItem[key]}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  // ! freezable rendering of FreezableTable
  // TODO: make it reuseable
  const FreezableCore = () => (
    <>
      {/* beneath table to display freeze column */}
      <View style={[FreezableTableMainSheet.freezeColTable]}>
        {headerRowDataFrame.map((headerRowArr: string[], idx: number) => (
          <HeaderRow
            key={`freeze-row-${idx}-hidden`}
            headerRowData={headerRowArr}
            rowOrder={idx}
            hidden
          />
        ))}

        <ScrollView
          bounces={false}
          scrollEventThrottle={16}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <Animated.ScrollView
            style={[
              {
                transform: [
                  {
                    translateY: Animated.multiply(
                      freezeColOffsetY,
                      new Animated.Value(-1)
                    ),
                  },
                ],
              },
            ]}
            bounces={false}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            {data
              .slice(freezeRowNum ? freezeRowNum - 1 : 0)
              .map((item, idx) => (
                <DataRow
                  key={`data-row-${
                    freezeRowNum ? idx + (freezeRowNum - 1) : idx
                  }-hidden`}
                  dataItem={sliceDataObj(item, columnKeys)}
                  rowOrder={freezeRowNum ? idx + (freezeRowNum - 1) : idx}
                  hidden
                />
              ))}
          </Animated.ScrollView>
        </ScrollView>
      </View>

      {/* float table to display scrollable table */}
      {/* ! CONDITION for marginLeft: must have to display freeze column from underneath table */}
      <View
        style={[
          FreezableTableMainSheet.scrollableTable,
          { marginLeft: accWidth },
        ]}
      >
        {headerRowDataFrame.map((headerRowArr: string[], idx: number) => (
          <HeaderRow
            key={`freeze-row-${idx}-scrollable`}
            headerRowData={headerRowArr}
            rowOrder={idx}
            hidden={false}
          />
        ))}

        <ScrollView
          ref={scrollViewRef1}
          onContentSizeChange={() =>
            scrollViewRef1.current?.scrollTo({
              x: defaultWidth,
              y: 0,
              animated: false,
            })
          }
          decelerationRate={0.45}
          onScroll={(event) => {
            const curX = event.nativeEvent.contentOffset.x;
            if (curX - accWidth <= 0) {
              scrollViewRef1.current?.scrollTo({
                x: accWidth,
                y: 0,
                animated: false,
              });
            }
            headerOffsetX.setValue(curX);
          }}
          bounces={false}
          scrollEventThrottle={16}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <ScrollView
            decelerationRate={0.45}
            bounces={false}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: freezeColOffsetY,
                    },
                  },
                },
              ],
              { useNativeDriver: false }
            )}
          >
            {data
              .slice(freezeRowNum ? freezeRowNum - 1 : 0)
              .map((item, idx) => (
                <DataRow
                  key={`data-row-${
                    freezeRowNum ? idx + (freezeRowNum - 1) : idx
                  }-scrollable`}
                  dataItem={sliceDataObj(item, columnKeys)}
                  rowOrder={freezeRowNum ? idx + (freezeRowNum - 1) : idx}
                  hidden={false}
                />
              ))}
          </ScrollView>
        </ScrollView>
      </View>
    </>
  );

  // ! pick what to render based on freezeColNum and freezeRowNum values
  const caseResult = determineCase(freezeRowNum, freezeColNum);

  // ! return case render content
  return caseResult.type === 'regular' ? (
    <View style={[FreezableTableMainSheet.mainContainer, mainContainerStyles]}>
      <FreezableCore />
    </View>
  ) : (
    <ScrollView
      style={[FreezableTableMainSheet.mainContainer, mainContainerStyles]}
      bounces={false}
      horizontal={caseResult.scrolling[0]}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView
        bounces={false}
        horizontal={caseResult.scrolling[1]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <FreezableCore />
      </ScrollView>
    </ScrollView>
  );
}
