import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any) => {
  try {
    const stringValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getData = async (key: string) => {
  try {
    const retrievedValue = await AsyncStorage.getItem(key);
    if (retrievedValue !== null) return JSON.parse(retrievedValue);
  } catch (error: any) {
    console.log(error.message);
  }
};
