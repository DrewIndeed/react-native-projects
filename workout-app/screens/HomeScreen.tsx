import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import data from '../data.json';
import { Workout } from '../types/data';

const renderItem = ({ item }: { item: Workout }) => (
  <View>
    <Text>{item.name}</Text>
  </View>
);

const HomeScreen = ({ navigation }: NativeStackHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <FlatList
        // data here is the WHOLE ARRAY OF OBJECTS
        // data is read from a JSON file so dont know what tah hell is the tpye
        // so we need to specify which type of array it is
        data={data as Workout[]}
        keyExtractor={(item) => item.slug} // key attribiute when you render a list in Reacr
        // WRITE INLINE WAY
        // renderItem={(
        //   { item } // remember to deconstruct "item"
        // ) => (
        //   <View>
        //     {/* render items name here */}
        //     <Text>{item.name}</Text>
        //   </View>
        // )}

        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default HomeScreen;
