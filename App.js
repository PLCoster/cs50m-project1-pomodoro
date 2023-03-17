import 'react-native-gesture-handler';

import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

import Stopwatch from './components/Stopwatch';
import TimerNav from './components/TimerNav';
import PomoTimer from './components/PomoTimer';

const STOPWATCH_NAME = 'Stopwatch';
const TIMER_NAME = 'Timer';
const POMO_NAME = 'Pomodoro Timer';

const unloadedSound = {
  playAsync: () => {
    console.log('No sounds loaded');
  },
  unloadAsync: () => {
    console.log('No sounds loaded to be unloaded');
  },
};

export const AudioContext = React.createContext({
  clickSound: unloadedSound,
  alarmSound: unloadedSound,
});

const Tab = createBottomTabNavigator();

export default function App() {
  const [audio, setAudio] = useState({
    clickSound: unloadedSound,
    alarmSound: unloadedSound,
  });

  // Effect to load sounds on initial App mount
  useEffect(() => {
    (async function loadClickSound() {
      try {
        const { sound: click } = await Audio.Sound.createAsync(
          require('./assets/sounds/fingersnap.mp3'),
        );
        const { sound: alarm } = await Audio.Sound.createAsync(
          require('./assets/sounds/watch_alarm.mp3'),
        );

        console.log('Sounds Loaded!');
        setAudio({ clickSound: click, alarmSound: alarm });
      } catch (err) {
        console.error('Error when trying to load sounds: ', err);
      }
    })();

    return () => {
      audio.clickSound.unloadAsync();
      audio.alarmSound.unloadAsync();
    };
  }, []);

  return (
    <AudioContext.Provider value={audio}>
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
                  <FontAwesome
                    name="hourglass-2"
                    size={size - 4}
                    color={color}
                  />
                );
              } else if (route.name === POMO_NAME) {
                return (
                  <FontAwesome name="edit" size={size - 4} color={color} />
                );
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
    </AudioContext.Provider>
  );
}
