import React, { useState, useCallback } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TimerHomeScreen from './TimerHomeScreen';
import AddTimerScreen from './AddTimerScreen';
import useAccurateInterval from '../hooks/useAccurateInterval';

const getUniqueIdStr = () => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const selected = [];
  for (let i = 0; i < 16; i += 1) {
    selected.push(chars[Math.floor(Math.random() * 62)]);
  }
  return selected.join('');
};

const Stack = createNativeStackNavigator();

function TimerNav() {
  const [timers, setTimers] = useState({});

  useAccurateInterval(
    Object.values(timers).reduce((anyTimerRunning, timer) => {
      if (anyTimerRunning || timer.timerRunning) {
        return true;
      }
      return anyTimerRunning;
    }, false),
    useCallback(
      () =>
        setTimers((currTimers) => {
          const updatedTimers = Object.keys(currTimers).reduce(
            (updatedTimers, timerId) => {
              const timerDetails = currTimers[timerId];
              if (!timerDetails.timerRunning) {
                updatedTimers[timerDetails.id] = timerDetails;
              } else {
                updatedTimers[timerDetails.id] = timerDetails;
                updatedTimers[timerDetails.id].currentTimerMilliSeconds -= 100;
                updatedTimers[timerDetails.id].currentTimerSeconds = Math.ceil(
                  updatedTimers[timerDetails.id].currentTimerMilliSeconds /
                    1000,
                );
              }
              return updatedTimers;
            },
            {},
          );
          return updatedTimers;
        }),
      [],
    ),
    100,
  );

  // Adds a new, running timer to the timer object, with unique timerId
  const addTimer = (initialTimerSeconds, timerName) => {
    // Create a unique ID for this timer
    let id = getUniqueIdStr();
    while (Object.hasOwnProperty.call(timers, id)) {
      id = getUniqueIdStr();
    }

    const timerDetails = {
      id,
      timerName,
      initialTimerSeconds,
      currentTimerMilliSeconds: initialTimerSeconds * 1000,
      currentTimerSeconds: initialTimerSeconds,
      timerRunning: true,
    };

    setTimers({ ...timers, [id]: timerDetails });
  };

  // Allows updating a Timer's Details by its unique timerId
  const updateTimer = (timerId, timerDetails) => {
    setTimers({ ...timers, [timerId]: { ...timerDetails } });
  };

  // Allows deleting a specific Timer by its unique timerId
  const deleteTimer = (timerId) => {
    const timerCopy = { ...timers };
    delete timerCopy[timerId];
    setTimers({ ...timerCopy });
  };

  return (
    <Stack.Navigator
      initialRouteName="TimerHomeScreen"
      screenOptions={({ route }) => ({
        headerShown: route.name === 'TimerHomeScreen' ? false : true,
      })}
    >
      <Stack.Screen name="TimerHomeScreen">
        {(props) => (
          <TimerHomeScreen
            {...props}
            timers={timers}
            updateTimer={updateTimer}
            deleteTimer={deleteTimer}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="AddTimerScreen"
        options={{ title: 'Create a New Timer' }}
      >
        {(props) => <AddTimerScreen {...props} addTimer={addTimer} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default TimerNav;
