import React from 'react';
import { View, ScrollView } from 'react-native';

// ! component to pick container for FreezableCore Component
const PickContainer = ({ caseResult, styleArray, renderCore }: any) => {
  return caseResult.type === 'regular' ? (
    <View style={styleArray}>{renderCore('core-in-regular')}</View>
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
        {renderCore('core-in-special')}
      </ScrollView>
    </ScrollView>
  );
};

export default PickContainer;
