import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import PlannerScreen from '../screens/PlannerScreen';

const Stack = createNativeStackNavigator();

export default function NavigationBar() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Planner">
        <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
        <Stack.Screen name="Planner" component={PlannerScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
