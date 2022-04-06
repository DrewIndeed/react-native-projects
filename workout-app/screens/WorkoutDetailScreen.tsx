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
import { useCountDown } from '../hooks/useCountDown';

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

  // state to keep track of current index of current sequence item
  const [idxTracker, setIdxTracker] = useState(-1);

  // useCountDown hook usage
  const countDown = useCountDown(
    idxTracker,
    // if idx is the valid array index (starting from 0), return duration otherwise -1
    idxTracker >= 0 ? sequence[idxTracker].duration : -1
  );

  // handle adding new item to sequence when counting finished
  useEffect(() => {
    // if there is no workout data, do nohting
    if (!workoutBySlug) return;

    // if it is the last item of the sequence
    if (idxTracker === workoutBySlug.sequence.length - 1) return;

    // if the duration of the current item finished counting donw, increment to the next item
    if (countDown === 0) addItemToSequence(idxTracker + 1);
  }, [countDown]);

  // method to add item to sequence
  const addItemToSequence = (idx: number) => {
    // concat new item to sequence array for counting down
    setSequence([...sequence, workoutBySlug!.sequence[idx]]);

    // update current idx of current sequence item
    setIdxTracker(idx);
  };

  if (!workoutBySlug) return null;

  const hasReachedEnd =
    sequence.length === workoutBySlug.sequence.length && countDown === 0;

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

      {/* display play icon and duration count down */}
      <View style={styles.centerView}>
        {sequence.length === 0 && (
          <FontAwesome
            name="play-circle-o"
            size={80}
            onPress={() => addItemToSequence(0)}
          />
        )}

        {/* if there are sequence items and duration starts coungting and is counting down */}
        {sequence.length > 0 && countDown >= 0 && (
          <View>
            <Text style={{ fontSize: 30 }}>{countDown}</Text>
          </View>
        )}
      </View>

      {/* display exercise name and progress text */}
      <View>
        <Text>
          {sequence.length === 0
            ? 'Prepare'
            : hasReachedEnd
            ? 'Great job!'
            : sequence[idxTracker].name}
        </Text>
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
  sequenceItem: {
    alignItems: 'center',
  },
  centerView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default WorkoutDetailScreen;
