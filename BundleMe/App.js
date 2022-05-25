import React from 'react';
import { Text } from 'react-native';

const MainPageWrapper = React.lazy(() => import('./MainWrapper'));

export default function App() {
  return (
    <React.Suspense fallback={<Text>Loading Main Page ...</Text>}>
      <MainPageWrapper />
    </React.Suspense>
  );
}
