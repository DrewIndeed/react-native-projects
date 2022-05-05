import React, { useRef } from 'react';
import {
  Animated,
  Text,
  View,
  ScrollView,
  StyleProp,
  TextStyle,
} from 'react-native';
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

  // ! anim values tracking refs
  const headerOffsetX = useRef(new Animated.Value(0)).current;
  const freezeColOffsetY = useRef(new Animated.Value(0)).current;

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
    // FreezableTableMainSheet container for first and following cells
    let commonCellsStyles: StyleProp<TextStyle> = {
      borderWidth: innerBorderWidth || 1,
      textAlign: 'center',
      backgroundColor: '#fff',
      padding: 10,
    };

    const headerCellsStyles: {
      otherCells: { style: StyleProp<TextStyle> };
      firstCell: { style: StyleProp<TextStyle> };
    } = {
      otherCells: {
        style: {
          ...commonCellsStyles,
        },
      },
      firstCell: {
        style: {
          ...commonCellsStyles,
          // ! Toggle display of first cell of header / freeze column here
          opacity: 1,
          display: hidden ? 'flex' : 'none',
        },
      },
    };

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
            style={[
              (freezeColNum ? idx < freezeColNum : idx < 1)
                ? headerCellsStyles.firstCell.style
                : headerCellsStyles.otherCells.style,
              { width: widths[idx] || defaultWidth },
              rowOrder === 0 && firstRowStyles,
              rowOrder > 0 && idx === 0 && firstColStyles,
              rowOrder > 0 && idx > 0 && bodyStyles,
            ]}
            key={`freeze-row-${rowOrder}-cell-${idx}`}
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
    // generate data row cells content based on data
    const dataRowContainer: string[] = [];
    columnKeys.forEach((key: string) => {
      if (cellRenderer) {
        dataRowContainer.push(cellRenderer(key, dataItem[key], dataItem));
      } else {
        dataRowContainer.push('Empty');
      }
    });

    // FreezableTableMainSheet container for first and following cells
    const commonCellsStyles: StyleProp<TextStyle> = {
      borderWidth: innerBorderWidth || 1,
      textAlign: 'center',
      backgroundColor: '#fff',
      padding: 10,
    };
    const dataRowStyles: {
      firstCell: { style: StyleProp<TextStyle> };
      otherCells: { style: StyleProp<TextStyle> };
    } = {
      firstCell: {
        style: {
          ...commonCellsStyles,
          display: hidden ? 'flex' : 'none',
        },
      },
      otherCells: {
        style: {
          ...commonCellsStyles,
          opacity: hidden ? 0 : 1,
        },
      },
    };

    return (
      <View style={{ flexDirection: 'row' }}>
        {dataRowContainer.map((data: string, idx: number) => (
          <Text
            style={[
              (freezeColNum ? idx < freezeColNum : idx < 1)
                ? dataRowStyles.firstCell.style
                : dataRowStyles.otherCells.style,
              { width: widths[idx] || defaultWidth },
              rowOrder === 0 && firstRowStyles,
              rowOrder >= 0 && idx === 0 && firstColStyles,
              rowOrder >= 0 && idx > 0 && bodyStyles,
            ]}
            key={`data-row-${rowOrder}-cell-${idx}`}
          >
            {data}
          </Text>
        ))}
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
          bounces={false}
          scrollEventThrottle={16}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: headerOffsetX,
                  },
                },
              },
            ],
            { useNativeDriver: false }
          )}
        >
          <ScrollView
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
  if (caseResult.type === 'regular') {
    return (
      <View
        style={[FreezableTableMainSheet.mainContainer, mainContainerStyles]}
      >
        <FreezableCore />
      </View>
    );
  } else {
    return (
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
}
