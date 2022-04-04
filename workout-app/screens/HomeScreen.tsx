import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Workout } from '../types/data';
import WorkoutItem from '../components/WorkoutItem';
// import MontserratText from '../components/styled/MontserratText';
import { getWorkouts } from '../storage/workout';
import { useState, useEffect } from 'react';

// CREATE PRESSABLE WORKOUT ITEM AS A SEPERATED COMPONENT
// const PressableWorkoutItem = ({ item }: { item: Workout }) => {
//   return (
//     <Pressable onPress={() => alert(`I am - ${item.name}`)}>
//       <WorkoutItem item={item} />
//     </Pressable>
//   );
// };

const HomeScreen = ({ navigation }: NativeStackHeaderProps) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]); // if not specified, [] in useState will have type of 'never[]'

  useEffect(() => {
    async function getWorkoutDataFromAsyncStorage() {
      const _workouts = await getWorkouts();
      await setWorkouts(_workouts);
    }

    getWorkoutDataFromAsyncStorage();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Workouts</Text>
      {/* <MontserratText style={{ fontSize: 30 }}>Your Workouts</MontserratText> */}
      <FlatList
        // data here is the WHOLE ARRAY OF OBJECTS
        // data is read from a JSON file so dont know what tah hell is the tpye
        // so we need to specify which type of array it is
        data={workouts}
        keyExtractor={(item) => item.slug} // key attribute when you render a list in React
        // WRITE INLINE WAY
        // renderItem={(
        //   { item } // remember to deconstruct "item"
        // ) => (
        //   <View>
        //     {/* render items name here */}
        //     <Text>{item.name}</Text>s
        //   </View>
        // )}

        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() =>
                // the second argument is called the PARAMS
                navigation.navigate('WorkoutDetails', { slug: item.slug })
              }
            >
              <WorkoutItem item={item} />
            </Pressable>
          );
        }}
      />
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

export default HomeScreen;
