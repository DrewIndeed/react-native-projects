import { useState, useEffect } from 'react';
import { getWorkoutBySlug } from '../storage/workout';
import { Workout } from '../types/data';

const useWorkoutBySlug = (slug: string) => {
    // type of workout is Workout OR undefined!
    const [workout, setWorkout] = useState<Workout>();

    useEffect(() => {
        async function getData() {
            const _workout = await getWorkoutBySlug(slug);
            setWorkout(_workout);
        }

        getData();
    }, []);

    return workout;
};

export default useWorkoutBySlug;
