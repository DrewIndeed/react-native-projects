import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StyleProp,
  TextStyle,
} from 'react-native';

/* UTILS */
// method to generate random number for unique list keys
function getRandomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

//capitalize all words of a targetStr.
function capitalizeWords(targetStr: string) {
  return targetStr.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

// get a limited number of obj data
function sliceDataObj(targetObj: object, limit: number, columnKeys: string[]) {
  // if there is no limit return the whole obj
  if (limit === 0) return targetObj;

  // create new obj container after filtering
  let filterObjContainer: { [key: string]: string } = {};

  // populate new obj data
  columnKeys.map((colKey: string) => {
    filterObjContainer[colKey] = targetObj[colKey as keyof object];
  });

  // return new obj
  return filterObjContainer;
}

/* TYPE HANDLING*/
type Column = {
  width?: number;
  header: string | number;
  key: string;
};

interface FreezableTableProps {
  data: object[];
  defaultWidth: number;
  columns: Column[];

  cellRenderer?: (key: any, value: any, row: any) => string;
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

export default function FreezableTable({
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
}: FreezableTableProps) {
  // ERROR HANDLING: required props
  if (!data || data.length === 0)
    throw new Error('[FreezableTable Error]: There is no data to render');

  if (defaultWidth < 0)
    throw new Error(
      '[FreezableTable Error]: defaultWidth must be greater than 0'
    );

  // ERROR HANDLING: freeze row and col number props
  if (
    freezeColNum &&
    (freezeColNum > Object.keys(data[0]).length + 1 || freezeColNum < 0)
  )
    throw new Error(
      '[FreezableTable Error]: Value must be greater or equal to 0 and less than data keys number for freezeColNum, otherwise leave blank with default value as 0'
    );

  if (freezeRowNum && (freezeRowNum > data.length || freezeRowNum < 0))
    throw new Error(
      '[FreezableTable Error]: Value must be greater or equal to 0 and less than data row number for freezeRowNum, otherwise leave blank with default value as 0'
    );

  // ERROR HANDLING: styles containers
  // --- main container ---
  if (mainContainerStyles && Object.keys(mainContainerStyles).length > 0) {
    // supported styles array for mainContainerStyles
    const SUPPORTED_STYLES: string[] = [
      'margin',
      'border',
      'background',
      'width',
      'height',
      'flex',
      'shadow',
      'zIndex',
    ].sort();
    let isValid: boolean = false;

    Object.keys(mainContainerStyles).map((styleKey) => {
      isValid = false;

      for (let i = 0; i < SUPPORTED_STYLES.length; i++) {
        const element = SUPPORTED_STYLES[i];
        if (styleKey.toLowerCase().includes(element.toLowerCase())) {
          isValid = true;
          break;
        }
      }
    });

    if (!isValid)
      throw new Error(
        `[FreezableTable Error]: mainContainerStyles only supports styles relating to: ${SUPPORTED_STYLES.join(
          ', '
        )}`
      );

    if (Object.keys(mainContainerStyles).includes('width')) {
      if (!Object.keys(mainContainerStyles).includes('height'))
        throw new Error(
          `[FreezableTable Error]: both 'width' and 'height' must present if one of them is defined in mainContainerStyles`
        );
    } else if (Object.keys(mainContainerStyles).includes('height')) {
      if (!Object.keys(mainContainerStyles).includes('width'))
        throw new Error(
          `[FreezableTable Error]: both 'width' and 'height' must present if one of them is defined in mainContainerStyles`
        );
    } else {
      if (!Object.keys(mainContainerStyles).includes('flex')) {
        throw new Error(
          `[FreezableTable Error]: 'flex: 1' must present if none of 'width' and 'height' is defined in mainContainerStyles`
        );
      }
    }
  }
  // --- cells container ---
  const validateCellStyles = (styleObj: object) => {
    // supported styles array for mainContainerStyles
    const SUPPORTED_STYLES: string[] = [
      'background',
      'border',
      'color',
      'font',
      'text',
      'line',
      'letter',
      'padding',
      'shadow',
    ].sort();
    let isValid: boolean = false;

    Object.keys(styleObj!).map((styleKey) => {
      isValid = false;

      for (let i = 0; i < SUPPORTED_STYLES.length; i++) {
        const element = SUPPORTED_STYLES[i];
        if (styleKey.toLowerCase().includes(element.toLowerCase())) {
          isValid = true;
          break;
        }
      }
    });

    if (!isValid)
      throw new Error(
        `[FreezableTable Error]: ${
          Object.keys({ styleObj })[0]
        } only supports styles relating to: ${SUPPORTED_STYLES.join(', ')}`
      );
  };
  if (firstRowStyles && Object.keys(firstRowStyles).length > 0)
    validateCellStyles(firstRowStyles);
  if (firstColStyles && Object.keys(firstColStyles).length > 0)
    validateCellStyles(firstColStyles);
  if (bodyStyles && Object.keys(bodyStyles).length > 0)
    validateCellStyles(bodyStyles);

  // anim values tracking refs
  const headerOffsetX = useRef(new Animated.Value(0)).current;
  const freezeColOffsetY = useRef(new Animated.Value(0)).current;

  const columnKeys: string[] = [];
  columns.map((col) => {
    columnKeys.push(col.key);
  });

  // accumulate width values if freezeColNum is defined
  let accWidth = defaultWidth;

  const widths = columns.reduce((container: number[], item: Column) => {
    container.push(item.width ? item.width : defaultWidth);
    return container;
  }, []);

  if (widths && widths.length > 0) {
    accWidth = 0;
    for (let i = 0; i < (freezeColNum ? freezeColNum : 1); i++)
      accWidth += widths[i];
  }

  // header row data
  const headers =
    columns.length > 0
      ? columns.reduce((container: string[], item: Column, idx: number) => {
          container.push(
            item.header
              ? typeof item.header !== 'string'
                ? item.header.toString()
                : item.header
              : Object.keys(data[0])[idx]
          );
          return container;
        }, [])
      : Object.keys(data[0]);

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

  // adjust header rendering based on freezeRowNum
  if (freezeRowNum && headerRowDataFrame.length <= data.length - 1) {
    for (let i = 0; i < freezeRowNum - 1; i++) {
      const extraHeaderData: string[] = Object.values(
        sliceDataObj(
          data[headerRowDataFrame.length - 1],
          columns.length,
          columnKeys
        )
      );

      headerRowDataFrame.push([...extraHeaderData]);
    }
  }
  // header row component
  const HeaderRow = ({
    hidden,
    headerRowData,
    rowOrder,
  }: {
    hidden: boolean;
    headerRowData: string[];
    rowOrder: number;
  }) => {
    // styles container for first and following cells
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
          styles.headerRowContainer,
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

  // data row component
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

    // styles container for first and following cells
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

  // pick what to render based on freezeColNum and freezeRowNum values
  let isHorizontalOuter = false;
  let isHorizontalInner = false;
  const pickRenderCase = (): number => {
    if (
      (freezeRowNum &&
        freezeRowNum === 0 &&
        freezeColNum &&
        freezeColNum === 0) ||
      (!freezeRowNum && !freezeColNum) ||
      (!freezeRowNum && freezeColNum && freezeColNum === 0) ||
      (!freezeColNum && freezeRowNum && freezeRowNum === 0)
    ) {
      isHorizontalOuter = true;
      return 2;
    }

    if (
      (freezeColNum === 0 && freezeRowNum !== 0) ||
      (!freezeColNum && freezeRowNum && freezeRowNum !== 0)
    ) {
      isHorizontalOuter = true;
      isHorizontalInner = true;
      return 3;
    }

    if (
      (freezeColNum !== 0 && freezeRowNum === 0) ||
      (!freezeRowNum && freezeColNum && freezeColNum !== 0)
    ) {
      isHorizontalOuter = false;
      isHorizontalInner = false;
      return 4;
    }

    return 1;
  };

  // return picked case
  const renderCase = pickRenderCase();
  // alert(renderCase);

  if (renderCase === 1) {
    return (
      <View style={[styles.mainContainer, mainContainerStyles]}>
        {/* beneath table to display freeze column */}
        <View style={[styles.freezeColTable]}>
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
                    dataItem={sliceDataObj(item, columns.length, columnKeys)}
                    rowOrder={freezeRowNum ? idx + (freezeRowNum - 1) : idx}
                    hidden
                  />
                ))}
            </Animated.ScrollView>
          </ScrollView>
        </View>

        {/* float table to display scrollable table */}
        {/* ! CONDITION for marginLeft: must have to display freeze column from underneath table */}
        <View style={[styles.scrollableTable, { marginLeft: accWidth }]}>
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
                    dataItem={sliceDataObj(item, columns.length, columnKeys)}
                    rowOrder={freezeRowNum ? idx + (freezeRowNum - 1) : idx}
                    hidden={false}
                  />
                ))}
            </ScrollView>
          </ScrollView>
        </View>
      </View>
    );
  } else {
    return (
      <ScrollView
        bounces={false}
        horizontal={isHorizontalOuter}
        style={[styles.mainContainer, mainContainerStyles]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          bounces={false}
          horizontal={isHorizontalInner}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {/* beneath table to display freeze column */}
          <View style={[styles.freezeColTable]}>
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
                      dataItem={sliceDataObj(item, columns.length, columnKeys)}
                      rowOrder={freezeRowNum ? idx + (freezeRowNum - 1) : idx}
                      hidden
                    />
                  ))}
              </Animated.ScrollView>
            </ScrollView>
          </View>

          {/* float table to display scrollable table */}
          {/* ! CONDITION for marginLeft: must have to display freeze column from underneath table */}
          <View style={[styles.scrollableTable, { marginLeft: accWidth }]}>
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
                      dataItem={sliceDataObj(item, columns.length, columnKeys)}
                      rowOrder={freezeRowNum ? idx + (freezeRowNum - 1) : idx}
                      hidden={false}
                    />
                  ))}
              </ScrollView>
            </ScrollView>
          </View>
        </ScrollView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,

    // ! CONDITION: must have to hide freeze column vertical overflow
    overflow: 'hidden',
  },
  headerRowContainer: {
    flexDirection: 'row',
  },
  freezeColTable: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    position: 'absolute',
  },
  scrollableTable: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',

    // ! CONDITION: must have to hide header horizontal overflow
    overflow: 'hidden',
  },
});
