import { storeData, getData, containsKey, removeItem } from '../storage';
import data from '../data.json';
import { Workout } from '../types/data';

export const initWorkouts = async (): Promise<boolean> => {
  const hasWorkouts = await containsKey('workout-data');
  if (!hasWorkouts) {
    await storeData('workout-data', data);
    return true;
  }
  return false;
};

export const getWorkouts = async (): Promise<Workout[]> =>
  await getData('workout-data');

export const clearWorkouts = async () => {
  await removeItem('workout-data');
};
