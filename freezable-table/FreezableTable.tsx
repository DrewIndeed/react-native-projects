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
//capitalize only the first letter of the string.
function capitalizeFirstLetter(targetStr: string) {
  return targetStr.charAt(0).toUpperCase() + targetStr.slice(1);
}
//capitalize all words of a targetStr.
function capitalizeWords(targetStr: string) {
  return targetStr.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

/* TYPE HANDLING*/
interface DataItem {
  [key: string]: string;
}
interface FreezableTableProps {
  data: DataItem[];
  width: number[];

  firstCellContent?: string;
  freezeColNum?: number;
  freezeHeaderNum?: number;

  boldHeader?: boolean;
  boldFreezeCol?: boolean;
  capHeader?: boolean;
  upperHeader?: boolean;

  borderWidth?: number;
  marginTop?: number;
  marginBottom?: number;
  bgColors?: {
    cornerCell?: string;
    header?: string;
    freezeColumn?: string;
    body?: string;
  };
  textColors?: {
    cornerCell?: string;
    header?: string;
    freezeColumn?: string;
    body?: string;
  };
}

export default function FreezableTable(props: FreezableTableProps) {
  // props destructoring
  const { data, width, freezeColNum } = props;

  // error handling
  if (!data || data.length === 0)
    throw new Error('[FreezableTable Error]: There is no data to render');

  if (width.length === 0)
    throw new Error(
      '[FreezableTable Error]: At least 1 column width value must present'
    );

  if (width.length !== Object.keys(data[0]).length + 1)
    throw new Error("[FreezableTable Error]: Invalid length for 'width' array");

  if (width.some((value) => value <= 0))
    throw new Error(
      "[FreezableTable Error]: Value must be greater than 0 in 'width' array"
    );

  if (freezeColNum && freezeColNum < 1)
    throw new Error(
      '[FreezableTable Error]: Value must be greater or equal to 1 for freezeColNum, otherwise leave blank with default value as 1'
    );

  if (
    props.freezeHeaderNum &&
    (props.freezeHeaderNum > props.data.length || props.freezeHeaderNum < 1)
  )
    throw new Error(
      '[FreezableTable Error]: Value must be greater or equal to 1 for freezeHeaderNum, otherwise leave blank with default value as 1'
    );
  // anim values tracking refs
  const headerOffsetX = useRef(new Animated.Value(0)).current;
  const freezeColOffsetY = useRef(new Animated.Value(0)).current;

  // accumulate width values if freezeColNum is defined
  let accWidth = 0;
  for (let i = 0; i < (freezeColNum ? freezeColNum : 1); i++)
    accWidth += props.width[i];

  // header row data
  const headerRowDataFrame = [
    [
      props.firstCellContent || '',
      ...Object.keys(props.data[0]).map((dt) =>
        props.capHeader
          ? props.upperHeader
            ? capitalizeWords(dt).toUpperCase()
            : capitalizeWords(dt)
          : props.upperHeader
          ? dt.toUpperCase()
          : dt
      ),
    ],
  ];

  // adjust header rendering based on freezeHeaderNum
  if (
    props.freezeHeaderNum &&
    headerRowDataFrame.length <= props.data.length - 1
  ) {
    for (let i = 0; i < props.freezeHeaderNum - 1; i++) {
      const extraHeaderData = Object.values(
        props.data[headerRowDataFrame.length - 1]
      );

      headerRowDataFrame.push([
        headerRowDataFrame.length.toString(),
        ...extraHeaderData,
      ]);
    }
  }
  // header row component
  const HeaderRow = ({
    hidden,
    headerRowData,
  }: {
    hidden: boolean;
    headerRowData: string[];
  }) => {
    // styles container for first and following cells
    const commonCellsStyles: StyleProp<TextStyle> = {
      borderWidth: props.borderWidth || 1,
      padding: 10,
      backgroundColor: props.bgColors?.header || '#fff',
      fontWeight: props.boldHeader ? 'bold' : 'normal',
      color: props.textColors?.header || '#000',
      textAlign: 'center',
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
          backgroundColor: props.bgColors?.cornerCell || '#fff',
          color: props.textColors?.cornerCell || '#000',
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
              (props.freezeColNum ? idx < props.freezeColNum : idx < 1)
                ? headerCellsStyles.firstCell.style
                : headerCellsStyles.otherCells.style,
              { width: props.width[idx] },
            ]}
            key={`Header Render ${getRandomNumberBetween(
              0,
              props.data.length * 1000000
            )}`}
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
    dataItem: DataItem;
    rowOrder: number;
    hidden?: boolean;
  }) => {
    // generate data row cells content based on data
    const dataRowContainer: string[] = [(rowOrder + 1).toString()];
    Object.keys(dataItem).forEach((key: string) => {
      dataRowContainer.push(dataItem[key as keyof DataItem]);
    });

    // styles container for first and following cells
    const commonCellsStyles: StyleProp<TextStyle> = {
      borderWidth: props.borderWidth || 1,
      textAlign: 'center',
      padding: 10,
    };
    const dataRowStyles: {
      firstCell: { style: StyleProp<TextStyle> };
      otherCells: { style: StyleProp<TextStyle> };
    } = {
      firstCell: {
        style: {
          ...commonCellsStyles,
          backgroundColor: props.bgColors?.freezeColumn || '#ffff',
          color: props.textColors?.freezeColumn || '#000',
          display: hidden ? 'flex' : 'none',
          fontWeight: props.boldFreezeCol ? 'bold' : 'normal',
        },
      },
      otherCells: {
        style: {
          ...commonCellsStyles,
          backgroundColor: props.bgColors?.body || '#fff',
          color: props.textColors?.body || '#000',
          opacity: hidden ? 0 : 1,
        },
      },
    };

    return (
      <View style={{ flexDirection: 'row' }}>
        {dataRowContainer.map((data: string, idx: number) => (
          <Text
            style={[
              (props.freezeColNum ? idx < props.freezeColNum : idx < 1)
                ? dataRowStyles.firstCell.style
                : dataRowStyles.otherCells.style,
              { width: props.width[idx] },
            ]}
            key={`Data Row Render ${getRandomNumberBetween(
              0,
              props.data.length * 1000000
            )}`}
          >
            {data}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {
          marginTop: props.marginTop || 0,
          marginBottom: props.marginBottom || 0,
        },
      ]}
    >
      {/* beneath table to display freeze column */}
      <View style={[styles.freezeColTable]}>
        {headerRowDataFrame.map((headerRowArr) => (
          <HeaderRow
            key={`Header Frame Hidden Table Render ${getRandomNumberBetween(
              0,
              props.data.length * 1000000
            )}`}
            headerRowData={headerRowArr}
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
              { paddingBottom: 16 },
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
            {props.data
              .slice(props.freezeHeaderNum ? props.freezeHeaderNum - 1 : 0)
              .map((item, idx) => (
                <DataRow
                  key={`Hidden Table Render ${getRandomNumberBetween(
                    0,
                    props.data.length * 1000000
                  )}`}
                  dataItem={item}
                  rowOrder={
                    props.freezeHeaderNum
                      ? idx + (props.freezeHeaderNum - 1)
                      : idx
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
        {headerRowDataFrame.map((headerRowArr) => (
          <HeaderRow
            key={`Header Frame Scrollable Table Render ${getRandomNumberBetween(
              0,
              props.data.length * 1000000
            )}`}
            headerRowData={headerRowArr}
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
            {props.data
              .slice(props.freezeHeaderNum ? props.freezeHeaderNum - 1 : 0)
              .map((item, idx) => (
                <DataRow
                  key={`Scrollable Table Render ${getRandomNumberBetween(
                    0,
                    props.data.length * 1000000
                  )}`}
                  dataItem={item}
                  rowOrder={
                    props.freezeHeaderNum
                      ? idx + (props.freezeHeaderNum - 1)
                      : idx
                  }
                  hidden={false}
                />
              ))}
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',

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
