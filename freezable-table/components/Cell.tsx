import React from 'react';
import { Text, View } from 'react-native';

const Cell = ({ compulsoryStyleArr, content, style }: any) => {
  // ** render content
  return (
    <View style={[...compulsoryStyleArr, style]}>
      <Text>{content}</Text>
    </View>
  );
};

export default Cell;
