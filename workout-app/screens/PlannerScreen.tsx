import { View, StyleSheet } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import WorkoutForm, { WorkoutFormSubmit } from '../components/WorkoutForm';
import { SequenceItem, SequenceType } from '../types/data';
import slugify from 'slugify';

const PlannerScreen = ({ navigation }: NativeStackHeaderProps) => {
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

        console.log(sequenceItem);
    };

    return (
        <View style={styles.container}>
            <WorkoutForm onSubmit={handleOnSubmit} />
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
