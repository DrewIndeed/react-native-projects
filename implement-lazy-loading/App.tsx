// MomentJS
import moment from 'moment';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
// Search component
import SearchInput from './SearchInput';
// Utils
import { getLocationId, getWeather } from './utils/api';
import getIconForWeather from './utils/getIconForWeather';
import getImageForWeather from './utils/getImageForWeather';

export default function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [city, setCity] = useState<any>({
    location: '',
    temperature: 0,
    weather: '',
    created: '2000-01-01T00:00:00.000000Z',
  });

  const { location, temperature, weather, created } = city;

  // Parse of date
  const handleDate = (date: string) => moment(date).format('hh:mm:ss');

  // Update current location
  const handleUpdateLocation = async (city: string) => {
    if (!city) return;

    setLoading(true);

    const cityData = async () => {
      try {
        const ID = await getLocationId(city);
        const { location, weather, temperature, created } = await getWeather(
          ID
        );

        setLoading(false);
        setError(false);

        setCity({
          location,
          weather,
          temperature,
          created,
        });
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    };

    cityData();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={getImageForWeather(weather)}
        style={styles.imageContainer}
        imageStyle={styles.image}
      >
        <View style={styles.detailsContainer}>
          <ActivityIndicator animating={loading} color="white" size="large" />

          {!loading && (
            <View>
              
              {error && (
                <Text style={[styles.smallText, styles.textStyle]}>
                  😞 Could not load your city or weather. Please try again
                  later...
                </Text>
              )}

              {!error && (
                <View>
                  <Text style={[styles.largeText, styles.textStyle]}>
                    {getIconForWeather(weather)} {location}
                  </Text>
                  <Text style={[styles.smallText, styles.textStyle]}>
                    {weather}
                  </Text>
                  <Text style={[styles.largeText, styles.textStyle]}>
                    {`${Math.round(temperature)}°`}
                  </Text>
                </View>
              )}

              <SearchInput
                placeholder="Search any city"
                onSubmit={handleUpdateLocation}
              />

              {!error && (
                <Text style={[styles.smallText, styles.textStyle]}>
                  Last update: {handleDate(created)}
                </Text>
              )}
            </View>
          )}
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

/* StyleSheet */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,

    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
});
