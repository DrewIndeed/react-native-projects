import React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import { getTextRelatedStyles } from '../utils';

const Cell = ({ content, compulsoryStyleArr, rowType, rowOrder, idx }: any) => {
  // ** filtered compulsoryStyleArr
  const filteredStylesObj = getTextRelatedStyles(compulsoryStyleArr);

  // ** render content
  return (
    <TouchableHighlight
      underlayColor={filteredStylesObj.backgroundColor}
      style={compulsoryStyleArr}
      onPress={() => alert(`${rowType} - (${idx},${rowOrder})`)}
    >
      <Text style={filteredStylesObj}>{content}</Text>
    </TouchableHighlight>
  );
};

export default Cell;
