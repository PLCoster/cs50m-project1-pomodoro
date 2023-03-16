import 'react-native-gesture-handler';

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from '@expo/vector-icons';

import Stopwatch from './components/Stopwatch';
import TimerNav from './components/TimerNav';
import PomoTimer from './components/PomoTimer';

const STOPWATCH_NAME = 'Stopwatch';
const TIMER_NAME = 'Timer';
const POMO_NAME = 'Pomodoro Timer';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Hide display of Tab Navigator Top Banner
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === STOPWATCH_NAME) {
              return (
                <MaterialIcons
                  name="timer"
                  size={size}
                  color={color}
                ></MaterialIcons>
              );
            } else if (route.name === TIMER_NAME) {
              return (
                <FontAwesome name="hourglass-2" size={size - 4} color={color} />
              );
            } else if (route.name === POMO_NAME) {
              return <FontAwesome name="edit" size={size - 4} color={color} />;
            }
          },

          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name={STOPWATCH_NAME} component={Stopwatch} />
        <Tab.Screen name={TIMER_NAME} component={TimerNav} />
        <Tab.Screen name={POMO_NAME} component={PomoTimer} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
