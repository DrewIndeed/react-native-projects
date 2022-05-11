import React from 'react';
import { Animated, Text, Pressable } from 'react-native';
import { FreezableTableMainSheet } from '../stylesheets';
import { generateCompulsoryStyles } from '../utils';
import Cell from './Cell';
import RowWrapper from './RowWrapper';

const Row = ({
  rowType,
  headerOffsetX,
  cellRenderer,
  dataArr,
  dataItem,
  freezeRowNum,
  rowOrder,
  hidden,
  compulsoryStyleSeed,
  allMergeRequests,
}: any) => {
  return (
    <RowWrapper
      rowType={rowType}
      cellWrapperStyles={
        rowType === 'header'
          ? [
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
            ]
          : { flexDirection: 'row' }
      }
    >
      {dataArr.map((key: string, idx: number) => {
        // ** compulsory style
        const compulsoryStyleArr = generateCompulsoryStyles(
          compulsoryStyleSeed,
          hidden,
          rowType === 'header' ? false : true
        )(rowOrder, idx);

        // ** if cellRenderer is specified and cellRenderer returns a Component
        let cellValue: any = null;
        if (cellRenderer) {
          // ** get return value from cellRenderer
          cellValue = cellRenderer(key, dataItem[key], dataItem);

          // ** check for Component
          if (cellValue['$$typeof']) {
            return React.cloneElement(cellValue, {
              ...cellValue.props,
              style: [...compulsoryStyleArr, cellValue.props.style],
              key: `${rowType}-row-${rowOrder}-cell-${idx}`,
            });
          }
        }

        if (
          allMergeRequests.some(
            (rq: any) =>
              rq[0] === idx &&
              rq[1] ===
                (rowType === 'header' ? rowOrder : rowOrder + freezeRowNum)
          )
        ) {
          return (
            <Text
              style={compulsoryStyleArr}
              key={`${rowType}-row-${rowOrder}-cell-lord-${idx}`}
            >
              DREW_INDEED
            </Text>
          );
        } else {
          return (
            <Cell
              compulsoryStyleArr={compulsoryStyleArr}
              key={`${rowType}-row-${rowOrder}-cell-${idx}`}
              content={
                rowType === 'header'
                  ? key
                  : cellValue
                  ? cellValue
                  : dataItem[key]
              }
              rowType={rowType}
              rowOrder={
                rowType === 'header' ? rowOrder : rowOrder + freezeRowNum
              }
              idx={idx}
            />
          );
        }
      })}
    </RowWrapper>
  );
};

export default Row;
