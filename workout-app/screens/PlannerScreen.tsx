import { View, Text, Button } from 'react-native';

const PlannerScreen = ({ navigation }: any) => {
  return (
    <View>
      <Text>PlannerScreen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default PlannerScreen;
