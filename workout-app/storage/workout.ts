import { storeData, getData, containsKey } from '../storage';
import data from '../data.json';
import { Workout } from '../types/data';

export const initWorkouts = async (): Promise<boolean> => {
  if (!containsKey('workout-data')) {
    await console.log('Storing workout-data ...');
    await storeData('workout-data', data);
    return true;
  }
  return false;
};

export const getWorkouts = async (): Promise<Workout[]> =>
  await getData('workout-data');
