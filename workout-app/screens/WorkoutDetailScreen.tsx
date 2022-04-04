import { View, Text, StyleSheet } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { getWorkoutBySlug } from '../storage/workout';

type NavigateParams = {
  route: {
    params: {
      slug: string;
    };
  };
};

type DetailNavigation = NativeStackHeaderProps & NavigateParams;

const WorkoutDetailScreen = ({ route }: DetailNavigation) => {
  useEffect(() => {
    async function getDataForDetails() {
      const workoutDetails = await getWorkoutBySlug(route.params.slug);
      console.log(workoutDetails);
    }

    getDataForDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Slug - {route.params.slug}</Text>
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
