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

export const getWorkoutBySlug = async (slug: string) => {
    const allData = await getWorkouts();
    const workoutBySlugData = allData.filter((item) => item.slug === slug)[0];
    return workoutBySlugData;
};

export const getWorkouts = async (): Promise<Workout[]> =>
    await getData('workout-data');

export const clearWorkouts = async () => {
    await removeItem('workout-data');
};

export const storeWorkouts = async (newWorkout: Workout): Promise<boolean> => {
    const currentWorkouts = await getWorkouts();
    await storeData('workout-data', [newWorkout, ...currentWorkouts]);
    return true;
};
