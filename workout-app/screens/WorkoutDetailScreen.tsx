import { View, Text, StyleSheet } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import useWorkoutBySlug from '../hooks/useWorkoutBySlug';
import CustomModal from '../components/styled/CustomModal';
import PressableText from '../components/styled/PressableText';
import { formatSec } from '../utils/time';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import WorkoutItem from '../components/WorkoutItem';

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
      {/* <Text style={styles.header}>{workoutBySlug.name}</Text> */}
      <WorkoutItem item={workoutBySlug}>
        <CustomModal
          activator={({ handleOpen }) => (
            <PressableText onPress={handleOpen} text="Check Sequence" />
          )}
        >
          <View>
            {workoutBySlug.sequence.map((sqItem, idx) => (
              <View key={sqItem.slug} style={styles.sequenceItem}>
                <Text>
                  {sqItem.name} - {sqItem.type} - {formatSec(sqItem.duration)}
                </Text>
                {idx !== workoutBySlug.sequence.length - 1 && (
                  <FontAwesome name="arrow-down" size={20} />
                )}
              </View>
            ))}
          </View>
        </CustomModal>
      </WorkoutItem>
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
  sequenceItem: {
    alignItems: 'center',
  },
});

export default WorkoutDetailScreen;
