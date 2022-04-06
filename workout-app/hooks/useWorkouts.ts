import { Workout } from '../types/data';
import { getWorkouts } from '../storage/workout';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

export const useWorkouts = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]); // if not specified, [] in useState will have type of 'never[]'
    const isFocused = useIsFocused();

    useEffect(() => {
        async function getWorkoutDataFromAsyncStorage() {
            console.log('Getting data ...');
            const _workouts = await getWorkouts();
            await setWorkouts(_workouts);
        }

        if (isFocused) getWorkoutDataFromAsyncStorage();
    }, [isFocused]);

    return workouts;
};
