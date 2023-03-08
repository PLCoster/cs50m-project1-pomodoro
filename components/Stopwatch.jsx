import React, { useState, useCallback } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';

import useAccurateInterval from '../hooks/useAccurateInterval';
import TimerClock from './TimerClock';

import sharedStyles from './styles/sharedStyles';

const styles = StyleSheet.create({
  stopwatchContainer: { backgroundColor: '#333' },
});

function Stopwatch({}) {
  const [currentTimerMilliSecs, setCurrentTimerMilliSecs] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const resetTimer = () => {
    setCurrentTimerMilliSecs(0);
    setTimerRunning(false);
  };

  useAccurateInterval(
    timerRunning,
    useCallback(
      (timeElapsed) => {
        setCurrentTimerMilliSecs((t) => t + timeElapsed);
      },
      [setCurrentTimerMilliSecs],
    ),
    100,
  );

  return (
    <View style={[sharedStyles.container, styles.stopwatchContainer]}>
      <Text style={sharedStyles.header}>Stopwatch</Text>
      <View style={sharedStyles.hr} />
      <TimerClock
        currentTimerMilliSecs={currentTimerMilliSecs}
        showTenths={true}
      />
      <View style={sharedStyles.flexRow}>
        <Pressable
          style={({ pressed }) => [
            sharedStyles.button,
            pressed ? sharedStyles.buttonPressed : null,
          ]}
          accessibilityLabel={`${
            timerRunning ? 'Pause' : 'Start'
          } the pomodoro timer`}
          onPress={() => {
            setTimerRunning(!timerRunning);
          }}
        >
          <Text
            style={[sharedStyles.buttonText, styles.timerControlButtonText]}
          >
            {timerRunning ? 'Pause' : 'Start'}
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            sharedStyles.button,
            pressed ? sharedStyles.buttonPressed : null,
          ]}
          accessibilityLabel="Reset the timer to initial settings"
          title="Reset"
          onPress={() => {
            resetTimer();
          }}
        >
          <Text
            style={[sharedStyles.buttonText, styles.timerControlButtonText]}
          >
            Reset
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Stopwatch;
