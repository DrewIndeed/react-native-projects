import { Workout } from '../types/data';
import { getWorkouts } from '../storage/workout';
import { useState, useEffect } from 'react';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]); // if not specified, [] in useState will have type of 'never[]'

  useEffect(() => {
    async function getWorkoutDataFromAsyncStorage() {
      const _workouts = await getWorkouts();
      await setWorkouts(_workouts);
    }

    getWorkoutDataFromAsyncStorage();
  }, []);

  return workouts;
};
