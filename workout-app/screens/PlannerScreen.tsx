import { View, Text, Button } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

const PlannerScreen = ({ navigation }: NativeStackHeaderProps) => {
  return (
    <View>
      <Text>PlannerScreen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default PlannerScreen;
