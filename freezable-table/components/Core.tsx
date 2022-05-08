import React from 'react';
import { Animated, View, ScrollView } from 'react-native';
import { sliceDataObj } from '../utils';
import { FreezableTableMainSheet } from '../stylesheets';
import CoreWrapper from './CoreWrapper';
import Row from './Row';

const Core = ({
  cellRenderer,
  compulsoryStyleSeed,

  freezeColOffsetY,
  headerOffsetX,
  scrollViewRef,
  headerRowDataFrame,

  accWidth,
  columnKeys,
  caseResult,

  data,
  freezeRowNum,
  freezeColNum,
  mainContainerStyles,
}: any) => {
  const headerRowComponentsArr = (keyType: string, hidden: boolean) =>
    headerRowDataFrame.map((headerRowArr: string[], rowOrder: number) => (
      <Row
        key={`freeze-row-${rowOrder}-${keyType}`}
        rowType="header"
        headerOffsetX={headerOffsetX}
        dataArr={headerRowArr}
        rowOrder={rowOrder}
        hidden={hidden}
        compulsoryStyleSeed={compulsoryStyleSeed}
      />
    ));

  const dataRowComponentsArr = (keyType: string, hidden: boolean) =>
    data
      .slice(freezeRowNum ? freezeRowNum - 1 : 0)
      .map((dataItem: any, rowOrder: number) => (
        <Row
          key={`data-row-${
            freezeRowNum ? rowOrder + (freezeRowNum - 1) : rowOrder
          }-${keyType}`}
          rowType="data"
          dataArr={columnKeys}
          cellRenderer={cellRenderer}
          dataItem={sliceDataObj(dataItem, columnKeys)}
          rowOrder={rowOrder}
          hidden={hidden}
          compulsoryStyleSeed={compulsoryStyleSeed}
        />
      ));

  return (
    <CoreWrapper
      caseResult={caseResult}
      styleArray={[FreezableTableMainSheet.mainContainer, mainContainerStyles]}
    >
      {/* beneath table to display freeze column */}
      <View style={[FreezableTableMainSheet.freezeColTable]}>
        {headerRowComponentsArr('hidden', true)}

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
        {headerRowComponentsArr('scrollable', false)}

        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollTo({
              x: accWidth,
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
    </CoreWrapper>
  );
};

export default Core;
