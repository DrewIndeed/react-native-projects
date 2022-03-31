import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import data from '../data.json';

const HomeScreen = ({ navigation }: NativeStackHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <FlatList
        data={data} // data here is the WHOLE ARRAY OF OBJECTS
        keyExtractor={(item) => item.slug} // key attribiute when you render a list in Reacr
        renderItem={(
          { item } // remember to deconstruct "item"
        ) => (
          <View>
            {/* render items name here */}
            <Text>{item.name}</Text>
          </View>
        )}
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
