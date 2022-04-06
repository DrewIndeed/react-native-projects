import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import PressableText from './styled/PressableText';

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
  // state to keep track of form information on inputting
  const [form, setForm] = useState({
    name: '',
    duration: '',
  });

  // method to update form information on inputting
  const onChangeText = (name: string) => (text: string) => {
    setForm({
      ...form,
      [name]: text,
    });
  };

  return (
    <View style={styles.container}>
      <Text>Exercise Form</Text>
      <TextInput
        value={form.name}
        style={styles.input}
        onChangeText={onChangeText('name')}
      />
      <TextInput
        value={form.duration}
        style={styles.input}
        onChangeText={onChangeText('duration')}
      />
      <PressableText text="Submit" onPress={() => onSubmit(form)} />
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
