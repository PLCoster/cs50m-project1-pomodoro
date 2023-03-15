import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import ClockDisplay from './ClockDisplay';
import useAccurateInterval from '../hooks/useAccurateInterval';

import sharedStyles from './styles/sharedStyles';

const styles = StyleSheet.create({
  timerContainer: {
    minWidth: '40%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#fff',
    borderRadius: 5,
    marginTop: 8,
    padding: 8,
  },
  timerDetailsContainer: {
    justifyContent: 'space-between',
    padding: 8,
  },
  timerDetailsText: {
    fontSize: 20,
    color: '#fff',
  },
  timerLargeButtonContainer: {
    justifyContent: 'flex-end',
  },
  timerLargeButton: {
    marginLeft: 24,
    marginRight: 0,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
});

// A single Timer to be displayed on the TimerHome Screen
function Timer({
  id,
  timerName,
  initialTimerSeconds,
  currentTimerSeconds,
  timerRunning,
  updateTimer,
  deleteTimer,
}) {
  console.log('TIMER COMPONENT: ', id);
  useAccurateInterval(
    timerRunning,
    () => {
      console.log('running update for: ', id);
      updateTimer(id, {
        id,
        timerName,
        initialTimerSeconds,
        currentTimerSeconds: currentTimerSeconds - 1,
        timerRunning,
      });
    },
    1000,
  );

  const toggleTimerRunning = () => {
    updateTimer(id, {
      id,
      timerName,
      initialTimerSeconds,
      currentTimerSeconds,
      timerRunning: !timerRunning,
    });
  };

  const resetTimer = () => {
    updateTimer(id, {
      id,
      timerName,
      initialTimerSeconds,
      currentTimerSeconds: initialTimerSeconds,
      timerRunning: false,
    });
  };

  return (
    <View style={styles.timerContainer}>
      <View style={[sharedStyles.flexRow, styles.timerDetailsContainer]}>
        <Text style={styles.timerDetailsText}>{timerName}</Text>
        <Text style={styles.timerDetailsText}>
          (
          <ClockDisplay
            currentTimerMilliSecs={initialTimerSeconds * 1000}
            showTenths={false}
            fontSize={20}
          />
          )
        </Text>
      </View>
      <View style={[sharedStyles.flexRow, styles.timerDetailsContainer]}>
        <View style={[sharedStyles.flexRow, sharedStyles.flexJustifyBetween]}>
          <ClockDisplay
            currentTimerMilliSecs={currentTimerSeconds * 1000}
            showTenths={false}
          />
          {currentTimerSeconds < initialTimerSeconds ? (
            <Pressable
              style={({ pressed }) => [
                sharedStyles.button,
                pressed ? sharedStyles.buttonPressed : null,
              ]}
              accessibilityLabel={`Reset the Timer`}
              onPress={resetTimer}
            >
              <FontAwesome name="repeat" size={24} color="white" />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.largeButtonContainer}>
          {currentTimerSeconds > 0 ? (
            <Pressable
              style={({ pressed }) => [
                sharedStyles.button,
                styles.timerLargeButton,
                pressed ? sharedStyles.buttonPressed : null,
              ]}
              accessibilityLabel={`${
                timerRunning ? 'Pause' : 'Start'
              } the timer`}
              onPress={toggleTimerRunning}
            >
              {timerRunning ? (
                <FontAwesome name="pause" size={40} color="white" />
              ) : (
                <FontAwesome name="play" size={40} color="white" />
              )}
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [
                sharedStyles.button,
                styles.timerLargeButton,
                pressed ? sharedStyles.buttonPressed : null,
              ]}
              accessibilityLabel={`${
                timerRunning ? 'Pause' : 'Start'
              } the timer`}
              onPress={resetTimer}
            >
              <FontAwesome name="stop" size={40} color="white" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

export default Timer;
