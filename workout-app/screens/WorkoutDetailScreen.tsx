import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
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
  if (workoutBySlug === undefined) return null;

  return (
    <View style={styles.container}>
      {/* use ? because workoutBySlug might be undefined */}
      <Text style={styles.header}>{workoutBySlug.name}</Text>
      <Pressable onPress={() => alert('Opening Modal')}>
        <Text style={{ textDecorationLine: 'underline' }}>Check Sequence</Text>
      </Pressable>
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
