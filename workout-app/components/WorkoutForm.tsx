import React, { useState } from 'react';
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
  const [isSelectionOn, setIsSelectionOn] = useState(false);

  const selections = ['Exercise', 'Stretch', 'Break'];

  return (
    <View style={styles.container}>
      <Text>Exercise Form</Text>
      <View style={styles.rowContainer}>
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
      </View>

      <View style={styles.rowContainer}>
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
          render={({ field: { onChange, value } }) =>
            isSelectionOn ? (
              <View
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: 'rgba(0,0,0,0.4)',
                }}
              >
                {selections.map((slt) => (
                  <PressableText
                    key={slt}
                    text={slt}
                    onPressIn={() => {
                      onChange(slt);
                      setIsSelectionOn(false);
                    }}
                    style={styles.selection}
                  />
                ))}
              </View>
            ) : (
              <TextInput
                onPressIn={() => setIsSelectionOn(true)}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                placeholder="Type"
              />
            )
          }
        />
      </View>

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
    flex: 1,
    height: 35,
    margin: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
    borderRadius: 5,
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  selection: {
    margin: 2,
    padding: 5,
    alignSelf: 'center',
  },
});

export default WorkoutForm;
