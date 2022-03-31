import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import PlannerScreen from '../screens/PlannerScreen';

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator/>
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();
const RootNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Root" component={BottomTabNavigator}></Stack.Screen>
  </Stack.Navigator>
);

const BottomTab = createBottomTabNavigator();
const BottomTabNavigator = () => (
  <BottomTab.Navigator>
    <BottomTab.Screen name="Home" component={HomeScreen} />
    <BottomTab.Screen name="Planner" component={PlannerScreen} />
  </BottomTab.Navigator>
);
