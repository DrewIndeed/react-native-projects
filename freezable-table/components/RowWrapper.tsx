import React from 'react';
import { View, Animated } from 'react-native';

const RowWrapper = ({
  rowType,
  cellWrapperStyles,
  children,
}: {
  rowType: string;
  cellWrapperStyles: object;
  children: any;
}) => {
  return rowType === 'header' ? (
    <Animated.View style={cellWrapperStyles}>{children}</Animated.View>
  ) : (
    <View style={cellWrapperStyles}>{children}</View>
  );
};

export default RowWrapper;
