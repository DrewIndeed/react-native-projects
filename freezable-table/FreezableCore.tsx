import React from 'react';
import { Animated, View, ScrollView } from 'react-native';
import { sliceDataObj } from './utils';
import { FreezableTableMainSheet } from './stylesheets';

const FreezableCore = ({
  HeaderRow,
  DataRow,
  freezeColOffsetY,
  headerOffsetX,
  freezeRowNum,
  freezeColNum,
  scrollViewRef,
  data,
  headerRowDataFrame,
  columnKeys,
  defaultWidth,
  accWidth,
}: any) => {
  const dataRowComponentsArr = (keyType: string, hidden: boolean) =>
    data
      .slice(freezeRowNum ? freezeRowNum - 1 : 0)
      .map((item: any, idx: number) => (
        <DataRow
          key={`data-row-${
            freezeRowNum ? idx + (freezeRowNum - 1) : idx
          }-${keyType}`}
          dataItem={sliceDataObj(item, columnKeys)}
          rowOrder={freezeRowNum ? idx + (freezeRowNum - 1) : idx}
          hidden={hidden}
        />
      ));

  return (
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
            {dataRowComponentsArr('hidden', true)}
          </Animated.ScrollView>
        </ScrollView>
      </View>

      {/* float table to display scrollable table */}
      {/* // ! CONDITION for marginLeft: must have to display freeze column from underneath table */}
      <View
        style={[
          FreezableTableMainSheet.scrollableTable,
          {
            marginLeft:
              !freezeColNum || (freezeColNum && freezeColNum === 0)
                ? 0
                : accWidth,
          },
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
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollTo({
              x: defaultWidth,
              y: 0,
              animated: false,
            })
          }
          onScroll={(event) => {
            const curX = event.nativeEvent.contentOffset.x;
            if (curX - accWidth <= 0) {
              scrollViewRef.current?.scrollTo({
                x: accWidth,
                y: 0,
                animated: false,
              });
            }
            headerOffsetX.setValue(curX);
          }}
          decelerationRate={0.45}
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
            {dataRowComponentsArr('scrollable', false)}
          </ScrollView>
        </ScrollView>
      </View>
    </>
  );
};

export default FreezableCore;
