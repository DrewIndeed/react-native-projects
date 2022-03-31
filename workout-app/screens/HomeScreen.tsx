import { View, Text, Button } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

const HomeScreen = ({ navigation }: NativeStackHeaderProps) => {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button
        title="Go to Planner"
        onPress={() => navigation.navigate('Planner')}
      />
    </View>
  );
};

export default HomeScreen;
