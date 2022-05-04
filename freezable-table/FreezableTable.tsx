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

/* TYPE HANDLING*/
interface FreezableTableProps {
  data: object[];
  defaultWidth: number;
  width: number[];
  headers: string[];

  freezeColNum?: number;
  freezeHeaderNum?: number;

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
  width,
  headers,
  freezeColNum,
  freezeHeaderNum,
  mainContainerStyles,
  firstRowStyles,
  firstColStyles,
  bodyStyles,
  capHeader,
  upperHeader,
  innerBorderWidth,
}: FreezableTableProps) {
  // ERROR HANDLING
  if (!data || data.length === 0)
    throw new Error('[FreezableTable Error]: There is no data to render');

  // if (width.length === 0)
  //   throw new Error(
  //     '[FreezableTable Error]: At least 1 column width value must present'
  //   );

  // if (width.length !== Object.keys(data[0]).length + 1)
  //   throw new Error(
  //     "[FreezableTable Error]: Invalid length for 'width' array, must be same length as data keys amount"
  //   );

  if (width && width.some((value) => value <= 0))
    throw new Error(
      "[FreezableTable Error]: Value must be greater than 0 in 'width' array"
    );

  if (
    freezeColNum &&
    (freezeColNum > Object.keys(data[0]).length + 1 || freezeColNum < 0)
  )
    throw new Error(
      '[FreezableTable Error]: Value must be greater or equal to 0 and less than data keys number for freezeColNum, otherwise leave blank with default value as 0'
    );

  if (freezeHeaderNum && (freezeHeaderNum > data.length || freezeHeaderNum < 0))
    throw new Error(
      '[FreezableTable Error]: Value must be greater or equal to 0 and less than data row number for freezeHeaderNum, otherwise leave blank with default value as 0'
    );

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

  // accumulate width values if freezeColNum is defined
  let accWidth = defaultWidth;

  if (width && width.length > 0) {
    accWidth = 0;
    for (let i = 0; i < (freezeColNum ? freezeColNum : 1); i++)
      accWidth += width[i];
  }

  // header row data
  const headerRowDataFrame = [];
  // headers render source tracking
  let headersSource;

  // adjust header rendering based on freezeHeaderNum
  if (freezeHeaderNum && headerRowDataFrame.length <= data.length - 1) {
    for (let i = 0; i < freezeHeaderNum - 1; i++) {
      const extraHeaderData: string[] = Object.values(
        data[headerRowDataFrame.length - 1]
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
              { width: width[idx] || defaultWidth },
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
    dataItem: object;
    rowOrder: number;
    hidden?: boolean;
  }) => {
    // generate data row cells content based on data
    const dataRowContainer: string[] = [];
    Object.keys(dataItem).forEach((key: string) => {
      dataRowContainer.push(dataItem[key as keyof object]);
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
              { width: width[idx] || defaultWidth },
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

  // pick what to render based on freezeColNum and freezeHeaderNum values
  let isHorizontalOuter = false;
  let isHorizontalInner = false;
  const pickRenderCase = (): number => {
    if (
      (freezeHeaderNum &&
        freezeHeaderNum === 0 &&
        freezeColNum &&
        freezeColNum === 0) ||
      (!freezeHeaderNum && !freezeColNum) ||
      (!freezeHeaderNum && freezeColNum && freezeColNum === 0) ||
      (!freezeColNum && freezeHeaderNum && freezeHeaderNum === 0)
    ) {
      isHorizontalOuter = true;
      return 2;
    }

    if (freezeColNum === 0 && freezeHeaderNum !== 0) {
      isHorizontalOuter = true;
      isHorizontalInner = true;
      return 3;
    }

    if (freezeColNum !== 0 && freezeHeaderNum === 0) {
      isHorizontalOuter = false;
      isHorizontalInner = false;
      return 4;
    }

    return 1;
  };

  // return picked case
  const renderCase = pickRenderCase();
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
                .slice(freezeHeaderNum ? freezeHeaderNum - 1 : 0)
                .map((item, idx) => (
                  <DataRow
                    key={`data-row-${
                      freezeHeaderNum ? idx + (freezeHeaderNum - 1) : idx
                    }-hidden`}
                    dataItem={item}
                    rowOrder={
                      freezeHeaderNum ? idx + (freezeHeaderNum - 1) : idx
                    }
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
                .slice(freezeHeaderNum ? freezeHeaderNum - 1 : 0)
                .map((item, idx) => (
                  <DataRow
                    key={`data-row-${
                      freezeHeaderNum ? idx + (freezeHeaderNum - 1) : idx
                    }-scrollable`}
                    dataItem={item}
                    rowOrder={
                      freezeHeaderNum ? idx + (freezeHeaderNum - 1) : idx
                    }
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
                  .slice(freezeHeaderNum ? freezeHeaderNum - 1 : 0)
                  .map((item, idx) => (
                    <DataRow
                      key={`data-row-${
                        freezeHeaderNum ? idx + (freezeHeaderNum - 1) : idx
                      }-hidden`}
                      dataItem={item}
                      rowOrder={
                        freezeHeaderNum ? idx + (freezeHeaderNum - 1) : idx
                      }
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
                  .slice(freezeHeaderNum ? freezeHeaderNum - 1 : 0)
                  .map((item, idx) => (
                    <DataRow
                      key={`data-row-${
                        freezeHeaderNum ? idx + (freezeHeaderNum - 1) : idx
                      }-scrollable`}
                      dataItem={item}
                      rowOrder={
                        freezeHeaderNum ? idx + (freezeHeaderNum - 1) : idx
                      }
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
