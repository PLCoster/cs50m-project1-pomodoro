import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FontAwesome } from '@expo/vector-icons';

import Timer from './Timer';
import AddTimerScreen from './AddTimerScreen';
import useAccurateInterval from '../hooks/useAccurateInterval';

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

function TimerHomeScreen({ navigation, timers, setTimers, updateTimer }) {
  useAccurateInterval(
    true,
    () =>
      setTimers((currTimers) => {
        const updatedTimers = Object.keys(currTimers).reduce(
          (updatedTimers, timerId) => {
            const timerDetails = currTimers[timerId];
            if (!timerDetails.timerRunning) {
              updatedTimers[timerDetails.id] = timerDetails;
            } else {
              updatedTimers[timerDetails.id] = timerDetails;
              updatedTimers[timerDetails.id].currentTimerSeconds -= 1;
            }
            return updatedTimers;
          },
          {},
        );
        return updatedTimers;
      }),
    1000,
  );

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
      <Pressable
        style={({ pressed }) => [
          sharedStyles.button,
          pressed ? sharedStyles.buttonPressed : null,
        ]}
        accessibilityLabel={`Create a new Timer`}
        onPress={() => navigation.navigate('AddTimer')}
      >
        <FontAwesome name="plus" size={40} color="white" />
      </Pressable>
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
    currentTimerSeconds: 1,
    timerRunning: true,
  };
  const [timers, setTimers] = useState({ [t1.id]: t1 });

  // Adds a new timer to the timer object, with unique timerId
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
            setTimers={setTimers}
            updateTimer={updateTimer}
            deleteTimer={deleteTimer}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddTimer" options={{ title: 'Create a New Timer' }}>
        {(props) => <AddTimerScreen {...props} addTimer={addTimer} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default TimerNav;
