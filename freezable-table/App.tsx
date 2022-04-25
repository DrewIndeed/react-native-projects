import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, View, ScrollView } from 'react-native';
import testData from './testData.js';

// method to generate random number for unique list keys
function getRandomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

// ! CONDITION: test data items must have consistent number of keys
const COLS_NUM = Object.keys(testData[0]).length;

export default function App() {
  // anim values tracking refs
  const headerOffsetX = useRef(new Animated.Value(0)).current;
  const freezeColOffsetY = useRef(new Animated.Value(0)).current;

  // header row component
  const HeaderRow = ({ hidden }: { hidden: boolean }) => {
    // generate header cells content based on data
    const headerCellsContent: any = [];
    headerCellsContent.push(''); // hidden first cell
    Object.keys(testData[0]).forEach((key) =>
      headerCellsContent.push(key.toUpperCase())
    );

    // styles container for first and following cells
    const headerCellsStyles: any = {
      firstCell: {
        style: {
          borderWidth: 1,
          width: 100,
          padding: 10,
          opacity: 0,
          display: hidden ? 'flex' : 'none',
        },
      },
      otherCells: {
        style: {
          borderWidth: 1,
          width: 175,
          padding: 10,
          backgroundColor: 'lime',
          fontWeight: 'bold',
        },
      },
    };

    return (
      <Animated.View
        style={[
          styles.headerRowContainer,
          {
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
        {headerCellsContent.map((content: string, idx: number) => (
          <Text
            style={
              idx === 0
                ? headerCellsStyles.firstCell.style
                : headerCellsStyles.otherCells.style
            }
            key={`HEADER ${idx}`}
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
    dataItem: any;
    rowOrder: number;
    hidden?: boolean;
  }) => {
    // generate data row cells content based on data
    const dataRowContainer: any = [];
    dataRowContainer.push(rowOrder + 1);
    Object.keys(dataItem).forEach((key) => {
      dataRowContainer.push(dataItem[key]);
    });

    // styles container for first and following cells
    const dataRowStyles: any = {
      firstCell: {
        style: {
          borderWidth: 1,
          width: 100,
          backgroundColor: 'lightpink',
          textAlign: 'center',
          padding: 10,
          display: hidden ? 'flex' : 'none',
        },
      },
      otherCells: {
        style: {
          borderWidth: 1,
          width: 175,
          backgroundColor: 'violet',
          textAlign: 'center',
          padding: 10,
          opacity: hidden ? 0 : 1,
        },
      },
    };

    return (
      <View style={{ flexDirection: 'row' }}>
        {dataRowContainer.map((data: string, idx: number) => (
          <Text
            style={
              idx === 0
                ? dataRowStyles.firstCell.style
                : dataRowStyles.otherCells.style
            }
            key={getRandomNumberBetween(0, 2000)}
          >
            {data}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* beneath table to display freeze column */}
      <Animated.View
        style={[
          styles.freezeColTable,
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
      >
        <HeaderRow hidden />

        <ScrollView
          bounces={false}
          scrollEventThrottle={16}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <ScrollView
            style={{ paddingBottom: 16 }} // ! TO SCROLL VERTICALLY COMPLETELY
            bounces={false}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            {testData.map((item, idx) => (
              <DataRow
                key={getRandomNumberBetween(2000, 3000)}
                dataItem={item}
                rowOrder={idx}
                hidden={true}
              />
            ))}
          </ScrollView>
        </ScrollView>
      </Animated.View>

      {/* float table to display scrollable table */}
      <View style={styles.scrollableTable}>
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
            style={{ paddingBottom: 16 }} // ! TO SCROLL VERTICALLY COMPLETELY
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
            {testData.map((item, idx) => (
              <DataRow
                key={getRandomNumberBetween(2000, 3000)}
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
  scrollableTable: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    marginLeft: 100,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 40,
    overflow: 'hidden', // ! CONDITION: must have to hide column overflow
  },
  freezeColTable: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    position: 'absolute',
  },
  headerRowContainer: {
    flexDirection: 'row',
  },
});
