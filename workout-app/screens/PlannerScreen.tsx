import { View, StyleSheet, FlatList, Text } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import WorkoutForm, { WorkoutFormSubmit } from '../components/WorkoutForm';
import { SequenceItem, SequenceType } from '../types/data';
import slugify from 'slugify';
import { useState } from 'react';
import WorkoutPlannerItem from '../components/WorkoutPlannerItem';
import PressableText from '../components/styled/PressableText';

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
