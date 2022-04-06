import { View, StyleSheet } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import WorkoutForm, { WorkoutFormSubmit } from '../components/WorkoutForm';

const PlannerScreen = ({ navigation }: NativeStackHeaderProps) => {
  // method to handle form submission
  const handleOnSubmit = (form: WorkoutFormSubmit) => {
    alert(`${form.name} - ${form.duration} - ${form.reps} - ${form.type}`);
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
