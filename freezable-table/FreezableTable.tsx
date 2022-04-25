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

// method to generate random number for unique list keys
function getRandomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

// type handling
interface DataItem {
  [key: string]: string;
}
interface FreezableTableProps {
  data: DataItem[];
  headers: string[];
  width: number[];
  borderWidth?: number;
  marginVertical?: number;
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
  const { data, headers, width } = props;

  // error handling
  if (!data || data.length === 0)
    throw new Error('[FreezableTable Error]: There is no data to render');

  if (headers.length === 0)
    throw new Error('[FreezableTable Error]: At least 1 header must present');

  if (headers.length !== Object.keys(data[0]).length + 1)
    throw new Error(
      "[FreezableTable Error]: Invalid length for 'headers' array"
    );

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

  // anim values tracking refs
  const headerOffsetX = useRef(new Animated.Value(0)).current;
  const freezeColOffsetY = useRef(new Animated.Value(0)).current;

  // header row component
  const HeaderRow = ({ hidden }: { hidden: boolean }) => {
    // styles container for first and following cells
    const commonCellsStyles: StyleProp<TextStyle> = {
      borderWidth: props.borderWidth || 1,
      padding: 10,
      backgroundColor: props.bgColors?.header || '#fff',
      fontWeight: 'bold',
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
          opacity: 1, // ! Toggle display of first cell of header / freeze column here
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
        {props.headers.map((content: string, idx: number) => (
          <Text
            style={[
              idx === 0
                ? headerCellsStyles.firstCell.style
                : headerCellsStyles.otherCells.style,
              { width: props.width[idx] },
            ]}
            key={`HEADER ${getRandomNumberBetween(0, props.data.length)}`}
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
              idx === 0
                ? dataRowStyles.firstCell.style
                : dataRowStyles.otherCells.style,
              { width: props.width[idx] },
            ]}
            key={getRandomNumberBetween(0, props.data.length * 1000000)}
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
        { marginVertical: props.marginVertical || 0 },
      ]}
    >
      {/* beneath table to display freeze column */}
      <View style={[styles.freezeColTable]}>
        <HeaderRow hidden />

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
            ]} // ! TO SCROLL VERTICALLY COMPLETELY
            bounces={false}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            {props.data.map((item, idx) => (
              <DataRow
                key={getRandomNumberBetween(0, props.data.length * 1000000)}
                dataItem={item}
                rowOrder={idx}
                hidden
              />
            ))}
          </Animated.ScrollView>
        </ScrollView>
      </View>

      {/* float table to display scrollable table */}
      {/* ! CONDITION for marginLeft: must have to display freeze column from underneath table */}
      <View style={[styles.scrollableTable, { marginLeft: props.width[0] }]}>
        <HeaderRow hidden={false} />

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
            {props.data.map((item, idx) => (
              <DataRow
                key={getRandomNumberBetween(0, props.data.length * 1000000)}
                dataItem={item}
                rowOrder={idx}
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
    overflow: 'hidden', // ! CONDITION: must have to hide freeze column vertical overflow
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
    overflow: 'hidden', // ! CONDITION: must have to hide header horizontal overflow
  },
});
