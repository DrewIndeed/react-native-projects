import { View, StyleSheet, TextInput } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import WorkoutForm from '../components/WorkoutForm';

const PlannerScreen = ({ navigation }: NativeStackHeaderProps) => {
  return (
    <View style={styles.container}>
      <WorkoutForm />
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
