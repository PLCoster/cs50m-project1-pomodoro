import React from 'react';
import { Text, View, Button } from 'react-native';
import PropTypes from 'prop-types';

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
    <View>
      <Text>{secondsToClockString(currentTimerSecs)}</Text>
      <Button
        title={timerRunning ? 'Pause' : 'Start'}
        onPress={() => {
          clickSound.playAsync();
          setTimerRunning(!timerRunning);
        }}
      ></Button>
      <Button
        title={workPhase ? 'Skip to Break' : 'Skip Break'}
        onPress={() => {
          clickSound.playAsync();
          setWorkPhase(!workPhase);
        }}
      ></Button>
      <Button
        title="Reset"
        onPress={() => {
          clickSound.playAsync();
          resetTimer();
        }}
      ></Button>
      <Text>{workPhase ? 'WORKING' : 'RESTING'}</Text>
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
