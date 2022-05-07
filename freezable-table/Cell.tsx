import React from 'react';
import { Text, View } from 'react-native';
import { generateCompulsoryStyles } from './utils';

const Cell = ({
  style,
  innerBorderWidth,
  hidden,
  freezeColNum,
  widths,
  defaultWidth,
  firstRowStyles,
  firstColStyles,
  bodyStyles,
  cellType,
  rowOrder,
  idx,
  content,
}: any) => {
  // ** compulsory style
  const compulsoryStyle = generateCompulsoryStyles(
    innerBorderWidth,
    hidden,
    freezeColNum,
    widths,
    defaultWidth,
    firstRowStyles,
    firstColStyles,
    bodyStyles,
    cellType === 'header' ? false : true
  )(rowOrder, idx);

  // ** render content
  return (
    <View style={[...compulsoryStyle]}>
      <Text>{content}</Text>
    </View>
  );
};

export default Cell;
