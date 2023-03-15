import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Timer from './Timer';

import sharedStyles from './styles/sharedStyles';

const getUniqueIdStr = () => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const selected = [];
  for (let i = 0; i < 16; i += 1) {
    selected.push(chars[Math.floor(Math.random() * 62)]);
  }
  return selected.join('');
};

const styles = StyleSheet.create({
  timerContainer: { backgroundColor: '#333' },
});

function TimerHome({ timers, updateTimer }) {
  const timerComponents = Object.values(timers).map((props) => (
    <Timer key={props.id} {...props} updateTimer={updateTimer} />
  ));

  return (
    <View style={[sharedStyles.container, styles.timerContainer]}>
      <Text style={sharedStyles.header}>Timers</Text>
      <View style={sharedStyles.hr} />
      {timerComponents.length ? (
        timerComponents
      ) : (
        <Text>No Timers yet, try adding one!</Text>
      )}
    </View>
  );
}

const Stack = createNativeStackNavigator();

function TimerNav() {
  // !!! Remove placeholder timers
  const t1 = {
    id: getUniqueIdStr(),
    timerName: 'Test Timer 1',
    initialTimerSeconds: 300,
    currentTimerSeconds: 300,
    timerRunning: true,
  };
  const [timers, setTimers] = useState({ [t1.id]: t1 });

  // Adds a new timer to the timer object
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
      currentTimerSeconds: initialTimerSeconds,
      timerRunning: false,
    };

    setTimers({ ...timers, [id]: timerDetails });
  };

  // Allows updating a Timer's Details
  const updateTimer = (timerId, timerDetails) => {
    setTimers({ ...timers, [timerId]: { ...timerDetails } });
  };

  return (
    <Stack.Navigator
      initialRouteName="Timer"
      screenOptions={({ route }) => ({
        headerShown: route.name === 'Timer' ? false : true,
      })}
    >
      <Stack.Screen name="Timer">
        {(props) => (
          <TimerHome {...props} timers={timers} updateTimer={updateTimer} />
        )}
      </Stack.Screen>
      {/* <Stack.Screen name="Add Timer">
        {(props) => <AddTimer {...props} addTimer={addTimer} />}
      </Stack.Screen> */}
    </Stack.Navigator>
  );
}

export default TimerNav;
