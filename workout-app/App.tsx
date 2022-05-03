import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <View style={styles.container}>
      <WebView
        allowsInlineMediaPlayback={true}
        source={{
          uri: 'https://drewindeed.github.io/test-qr-scan.github.io/',
        }}
        startInLoadingState={true}
        onShouldStartLoadWithRequest={(event) => {
          if (
            event.url !== 'https://drewindeed.github.io/test-qr-scan.github.io/'
          ) {
            // print out the url when scanned QR code successfully
            console.log('onShouldStartLoadWithRequest', event.url);

            // Code to use the url further goes here.

            return false;
          }
          return true;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

// import { StatusBar } from 'expo-status-bar';
// import Navigation from './navigation/index';
// import useCachedResources from './hooks/useCachedResources';

// export default function App() {
//   const isLoaded = useCachedResources();
//   console.log('isLoaded:', isLoaded);

//   if (isLoaded) {
//     return (
//       <>
//         <Navigation />
//         <StatusBar style="auto" />
//       </>
//     );
//   } else {
//     return null;
//   }
// }
