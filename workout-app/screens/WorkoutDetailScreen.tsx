import { View, Text, StyleSheet } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import useWorkoutBySlug from '../hooks/useWorkoutBySlug';
import CustomModal from '../components/styled/CustomModal';
import PressableText from '../components/styled/PressableText';

type NavigateParams = {
  route: {
    params: {
      slug: string;
    };
  };
};

type DetailNavigation = NativeStackHeaderProps & NavigateParams;

const WorkoutDetailScreen = ({ route }: DetailNavigation) => {
  // if you place this line below useWorkoutBySlug(), there will be an error: the hook is renderred more time than the previous render
  // const [isModalVisible, setModalVisible] = useState(false);

  const workoutBySlug = useWorkoutBySlug(route.params.slug);
  if (!workoutBySlug) return null;

  return (
    <View style={styles.container}>
      {/* use ? because workoutBySlug might be undefined */}
      <Text style={styles.header}>{workoutBySlug.name}</Text>
      <CustomModal
        activator={() => (
          <PressableText
            onPress={() => {
              alert('Opening');
            }}
            text="Check Sequence"
          />
        )}
      />

      {/* render another one to see the difference */}
      <CustomModal />
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
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WorkoutDetailScreen;
