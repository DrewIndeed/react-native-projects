import React from 'react';
import { Animated } from 'react-native';
import { generateCompulsoryStyles } from '../utils';
import { FreezableTableMainSheet } from '../stylesheets';
import RowWrapper from './RowWrapper';
import Cell from './Cell';

const Row = ({
  rowType,
  headerOffsetX,
  cellRenderer,
  dataArr,
  dataItem,
  rowOrder,
  hidden,
  compulsoryStyleSeed,
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
        let cellValue = null;
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

        return (
          <Cell
            compulsoryStyleArr={compulsoryStyleArr}
            key={`${rowType}-row-${rowOrder}-cell-${idx}`}
            content={
              rowType === 'header' ? key : cellValue ? cellValue : dataItem[key]
            }
          />
        );
      })}
    </RowWrapper>
  );
};

export default Row;
