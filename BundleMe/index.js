/**
 * @format
 */

import React from 'react';
import {AppRegistry, Text} from 'react-native';
import {name as appName} from './app.json';

const MainApp = React.lazy(() => import('./App'));

const MyComponent = () => (
  <React.Suspense fallback={<Text>Andrew ....</Text>}>
    <MainApp />
  </React.Suspense>
);

AppRegistry.registerComponent(appName, () => MyComponent);
