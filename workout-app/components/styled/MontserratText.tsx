import React from 'react';
import { Text } from 'react-native';

const MontserratText = ({ children }: { children: Text["props"]["children"] }) => {
  return <Text style={{ fontFamily: 'montserrat' }} children={children} />;
};

export default MontserratText;
