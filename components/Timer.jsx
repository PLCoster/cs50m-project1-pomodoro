import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import useAccurateInterval from '../hooks/useAccurateInterval';

import sharedStyles from './styles/sharedStyles';

// A single Timer to be displayed on the TimerHome Screen
function Timer({
  id,
  timerName,
  initialTimerSeconds,
  currentTimerSeconds,
  timerRunning,
  updateTimer,
}) {
  useAccurateInterval(
    timerRunning,
    () =>
      updateTimer(id, {
        id,
        timerName,
        initialTimerSeconds,
        currentTimerSeconds: currentTimerSeconds - 1,
        timerRunning,
      }),
    1000,
  );

  return (
    <Text style={sharedStyles.header}>
      This is a timer: {timerName} - {currentTimerSeconds}
    </Text>
  );
}

export default Timer;
