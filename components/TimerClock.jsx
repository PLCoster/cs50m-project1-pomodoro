import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import PropTypes from 'prop-types';

import sharedStyles from './styles/sharedStyles';

/**
 * Returns a string of 'MM:SS' from a given number of seconds for the Timer Clock
 *
 * @param {number} seconds - an integer
 * @returns {string} - 'MM:SS' string representation of the given seconds
 */
function secondsToClockString(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${min}:${sec.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  timerClockContainer: {
    alignItems: 'center',
  },
  clockDisplay: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 600,
  },
  phaseDisplay: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 600,
  },
  timerControlContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  timerControlButtonText: {
    fontSize: 20,
  },
});

function TimerClock({
  currentTimerSecs,
  timerRunning,
  setTimerRunning,
  setWorkPhase,
  workPhase,
  resetTimer,
  clickSound,
}) {
  return (
    <View style={styles.timerClockContainer}>
      <Text style={styles.clockDisplay}>
        {secondsToClockString(currentTimerSecs)}
      </Text>
      <Text style={styles.phaseDisplay}>
        {workPhase ? 'WORKING' : 'RESTING'}
      </Text>
      <View style={styles.timerControlContainer}>
        <Pressable
          style={({ pressed }) => [
            sharedStyles.button,
            pressed ? sharedStyles.buttonPressed : null,
          ]}
          onPress={() => {
            clickSound.playAsync();
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
          onPress={() => {
            clickSound.playAsync();
            setWorkPhase(!workPhase);
          }}
        >
          <Text
            style={[sharedStyles.buttonText, styles.timerControlButtonText]}
          >
            {workPhase ? 'Skip to Break' : 'Skip Break'}
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            sharedStyles.button,
            pressed ? sharedStyles.buttonPressed : null,
          ]}
          title="Reset"
          onPress={() => {
            clickSound.playAsync();
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

TimerClock.propTypes = {
  currentTimerSecs: PropTypes.number.isRequired,
  timerRunning: PropTypes.bool.isRequired,
  setTimerRunning: PropTypes.func.isRequired,
  setWorkPhase: PropTypes.func.isRequired,
  workPhase: PropTypes.bool.isRequired,
  resetTimer: PropTypes.func.isRequired,
  clickSound: PropTypes.shape({ playAsync: PropTypes.func }),
};

export default TimerClock;
