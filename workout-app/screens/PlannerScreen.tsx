import { View, StyleSheet, FlatList, Text } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import WorkoutForm, { WorkoutFormSubmit } from '../components/WorkoutForm';
import { SequenceItem, SequenceType, Workout } from '../types/data';
import slugify from 'slugify';
import { useState } from 'react';
import WorkoutPlannerItem from '../components/WorkoutPlannerItem';
import PressableText from '../components/styled/PressableText';
import CustomModal from '../components/styled/CustomModal';
import WorkoutModalForm, {
    WorkoutFormData,
} from '../components/WorkoutModalForm';
import { storeWorkouts } from '../storage/workout';

const PlannerScreen = ({ navigation }: NativeStackHeaderProps) => {
    // state to keep track of planner sequence
    const [sequenceItems, setSequenceItems] = useState<SequenceItem[]>([]);

    // method to handle form submission
    const handleOnSubmit = (form: WorkoutFormSubmit) => {
        const sequenceItem: SequenceItem = {
            slug: slugify(form.name + ' ' + Date.now(), {
                lower: true,
                trim: true,
            }),
            name: form.name,
            type: form.type as SequenceType,
            duration: Number(form.duration),
        };

        if (!form.reps) sequenceItem.reps = Number(form.reps);

        console.log('Submitted sequence data: ', sequenceItem);
        setSequenceItems([...sequenceItems, sequenceItem]);
    };

    const computeDifficulty = (
        exercisesCount: number,
        workoutDuration: number
    ) => {
        const intensity = workoutDuration / exercisesCount;
        if (intensity <= 60) return 'hard';
        else if (intensity <= 100) return 'normal';
        else return 'easy';
    };

    const handleWorkoutSubmit = async (form: WorkoutFormData) => {
        const duration = sequenceItems.reduce(
            (acc, item) => acc + item.duration,
            0
        );

        const newWorkout: Workout = {
            name: form.name,
            slug: slugify(form.name + ' ' + Date.now(), {
                lower: true,
                trim: true,
            }),
            difficulty: computeDifficulty(sequenceItems.length, duration),
            sequence: [...sequenceItems],
            duration,
        };

        // console.log(newWorkout);
        await storeWorkouts(newWorkout)
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={sequenceItems}
                keyExtractor={(item) => item.slug}
                renderItem={({ item, index }) => {
                    return (
                        <WorkoutPlannerItem item={item}>
                            <PressableText
                                text="Remove"
                                onPressIn={() => {
                                    const items = [...sequenceItems];
                                    items.splice(index, 1);
                                    setSequenceItems(items);
                                }}
                            />
                        </WorkoutPlannerItem>
                    );
                }}
            />
            <WorkoutForm onSubmit={handleOnSubmit} />
            {sequenceItems.length > 0 && (
                <View>
                    <CustomModal
                        activator={({ handleOpen }) => (
                            <PressableText
                                style={{ marginTop: 15 }}
                                text="Create Workout"
                                onPress={handleOpen}
                            />
                        )}
                    >
                        {({ handleClose }) => (
                            <View>
                                <WorkoutModalForm
                                    onSubmit={async (data) => {
                                        await handleWorkoutSubmit(data);
                                        setSequenceItems([]);
                                        handleClose();
                                        navigation.navigate('Home');
                                    }}
                                />
                            </View>
                        )}
                    </CustomModal>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
});

export default PlannerScreen;
