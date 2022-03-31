import { View, Text, Button } from 'react-native';

const HomeScreen = ({navigation}: any) => {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button title="Go to Planner" onPress={() => navigation.navigate("Planner")}/>
    </View>
  );
};

export default HomeScreen;
