import { View, Text, StyleSheet } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import useWorkoutBySlug from '../hooks/useWorkoutBySlug';
import CustomModal from '../components/styled/CustomModal';
import PressableText from '../components/styled/PressableText';
import { formatSec } from '../utils/time';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import WorkoutItem from '../components/WorkoutItem';
import { SequenceItem } from '../types/data';

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

  // use hook to get workout data based on slug
  const workoutBySlug = useWorkoutBySlug(route.params.slug);

  // state to keep track of sequence belonging to that particular workout
  const [sequence, setSequence] = useState<SequenceItem[]>([]);

  // state to keep track of duration count down of workout sequence ITEM
  /* use -1 because:
  + It is safe when it is use to access an array or something because index of array start at 0 and
  + It indicates null state of counting 
  */
  const [currentDuration, setCurrentDuration] = useState(-1);

  // state to keep track of current index of current sequence item
  const [idxTracker, setIdxTracker] = useState(-1);

  // ! useEffect here right after all init of useState or other init variables
  useEffect(() => {
    // if there is no item in the sequence array, do nothing
    if (idxTracker === -1) return;

    // otherwise, keep track of duration of current item in sequence
    setCurrentDuration(workoutBySlug!.sequence[idxTracker].duration);

    // use tracking duration to count down
    const intervalId = window.setInterval(() => {
      // update by decrementing currentDuration
      // here, we use the functional form of use state content
      setCurrentDuration((curDur) => {
        console.log(curDur);
        return curDur - 1;
      });
    }, 100);

    // IMPORTANT: need to remove it when done using, otherwise, memory leak when it keeps counting down
    // this is also called Cleaning
    return () => window.clearInterval(intervalId);
  }, [idxTracker]); // it will depend on idxTracker

  // method to add item to sequence
  const addItemToSequence = (idx: number) => {
    // concat new item to sequence array for counting down
    setSequence([...sequence, workoutBySlug!.sequence[idx]]);

    // update current idx of current sequence item
    setIdxTracker(idx);
  };

  if (!workoutBySlug) return null;

  return (
    <View style={styles.container}>
      {/* use ? because workoutBySlug might be undefined */}
      {/* <Text style={styles.header}>{workoutBySlug.name}</Text> */}
      <WorkoutItem item={workoutBySlug} childStyles={{ marginTop: 10 }}>
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
      <View>
        {sequence.length === 0 && (
          <FontAwesome
            name="play-circle-o"
            size={80}
            onPress={() => addItemToSequence(0)}
          />
        )}
      </View>
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
