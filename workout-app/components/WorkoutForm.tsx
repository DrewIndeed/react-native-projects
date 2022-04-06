import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Controller, useForm } from 'react-hook-form';

// type for submit form information
export type WorkoutFormSubmit = {
  name: string;
  duration: string;
};

// type for WorkoutForm component Props
type WorkoutFormProps = {
  onSubmit: (form: WorkoutFormSubmit) => void;
};

const WorkoutForm = ({ onSubmit }: WorkoutFormProps) => {
  const { control } = useForm();

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
          />
        )}
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
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default WorkoutForm;
