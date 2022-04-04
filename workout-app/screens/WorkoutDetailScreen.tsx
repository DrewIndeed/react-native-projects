import { View, Text, StyleSheet } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { getWorkoutBySlug } from '../storage/workout';
import useWorkoutBySlug from '../hooks/useWorkoutBySlug';

type NavigateParams = {
  route: {
    params: {
      slug: string;
    };
  };
};

type DetailNavigation = NativeStackHeaderProps & NavigateParams;

const WorkoutDetailScreen = ({ route }: DetailNavigation) => {
  const workoutBySlug = useWorkoutBySlug(route.params.slug);
  return (
    <View style={styles.container}>
      {/* use ? because workoutBySlug might be undefined */}
      <Text style={styles.header}>{workoutBySlug?.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default WorkoutDetailScreen;
