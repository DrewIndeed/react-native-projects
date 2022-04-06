import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import PressableText from './styled/PressableText';

// type for submit form information
export type WorkoutFormSubmit = {
  name: string;
  duration: string;
  reps?: number;
  type: string;
};

// type for WorkoutForm component Props
type WorkoutFormProps = {
  onSubmit: (form: WorkoutFormSubmit) => void;
};

const WorkoutForm = ({ onSubmit }: WorkoutFormProps) => {
  const { control, handleSubmit } = useForm();

  return (
    <View style={styles.container}>
      <Text>Exercise Form</Text>
      <Controller
        control={control}
        rules={{ required: true }}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            onChangeText={onChange}
            value={value}
            style={styles.input}
            placeholder="Name"
          />
        )}
      />

      <Controller
        control={control}
        rules={{ required: true }}
        name="duration"
        render={({ field: { onChange, value } }) => (
          <TextInput
            onChangeText={onChange}
            value={value}
            style={styles.input}
            placeholder="Duration"
          />
        )}
      />

      <Controller
        control={control}
        name="reps"
        render={({ field: { onChange, value } }) => (
          <TextInput
            onChangeText={onChange}
            value={value}
            style={styles.input}
            placeholder="Repetitions"
          />
        )}
      />

      <Controller
        control={control}
        rules={{ required: true }}
        name="type"
        render={({ field: { onChange, value } }) => (
          <TextInput
            onChangeText={onChange}
            value={value}
            style={styles.input}
            placeholder="Type"
          />
        )}
      />

      <PressableText
        text="Submit"
        onPress={handleSubmit((data) => onSubmit(data as WorkoutFormSubmit))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  input: {
    height: 35,
    margin: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
    borderRadius: 5,
    padding: 10,
  },
});

export default WorkoutForm;
