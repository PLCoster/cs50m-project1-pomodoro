import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

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

export default function TimerClock({
  currentTimerSecs,
  timerRunning,
  toggleTimerRunning,
  workPhase,
}) {
  return (
    <View>
      <Text>{secondsToClockString(currentTimerSecs)}</Text>
      <Button
        title={timerRunning ? 'Pause' : 'Start'}
        onPress={toggleTimerRunning}
      ></Button>
      <Text>{workPhase ? 'WORKING' : 'RESTING'}</Text>
      {/* !!! Add buttons to skip to the next phase, and reset the timer completely here */}
    </View>
  );
}
