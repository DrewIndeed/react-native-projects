import React from 'react';
import { Text } from 'react-native';

const MontserratText = ({ children }: { children: React.ReactNode }) => {
  return <Text style={{ fontFamily: 'montserrat' }} children={children} />;
};

export default MontserratText;
