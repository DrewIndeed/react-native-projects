import React from 'react';
import { Text } from 'react-native';

const Cell = ({ compulsoryStyleArr, content, style }: any) => {
  // ** render content
  return <Text style={[...compulsoryStyleArr, style]}>{content}</Text>;
};

export default Cell;
