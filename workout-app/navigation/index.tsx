import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import PlannerScreen from '../screens/PlannerScreen';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();
const RootNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Root"
      component={BottomTabNavigator}
      // headerShown to false to hide to header part
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="WorkoutDetails"
      component={WorkoutDetailScreen}
      options={{ title: 'Workout Info' }}
    />
  </Stack.Navigator>
);

const BottomTab = createBottomTabNavigator();
const BottomTabNavigator = () => (
  <BottomTab.Navigator>
    <BottomTab.Screen
      name="Home"
      component={HomeScreen}
      // unmountOnBlur to unmount other page in nav when jump to another page
      // print out msg in useEffect of the screens to see if needed
      options={{
        unmountOnBlur: true,
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="home" size={size} color={color} />
        ),
      }}
    />
    <BottomTab.Screen
      name="Planner"
      component={PlannerScreen}
      options={{
        unmountOnBlur: true,
        tabBarIcon: ({ color, size }) => (
          <Entypo name="add-to-list" size={size} color={color} />
        ),
      }}
    />
  </BottomTab.Navigator>
);
