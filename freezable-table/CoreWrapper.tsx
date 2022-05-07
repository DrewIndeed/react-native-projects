import React from 'react';
import { View, ScrollView } from 'react-native';

// ! component to pick container for FreezableCore Component
const CoreWrapper = ({ caseResult, styleArray, children }: any) => {
  return caseResult.type === 'regular' ? (
    <View style={styleArray}>{children}</View>
  ) : (
    <ScrollView
      style={styleArray}
      bounces={false}
      horizontal={caseResult.scrolling[0]}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView
        bounces={false}
        horizontal={caseResult.scrolling[1]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </ScrollView>
  );
};

export default CoreWrapper;
