import React from 'react';
import {
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
} from 'react-native';
import {StartupTime} from 'react-native-startup-time';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

const MainPageContent = React.lazy(() => import('./MainContent'));

const MainWrapper = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />

        <React.Suspense fallback={<Text>Loading Main Content ...</Text>}>
          <MainPageContent />
        </React.Suspense>
      </ScrollView>

      <StartupTime style={styles.startupTime} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  startupTime: {
    marginTop: 100,
  },
});

export default MainWrapper;
