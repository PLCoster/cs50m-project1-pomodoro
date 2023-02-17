import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import TimerSettings from './TimerSettings';

export default function Timer() {
  const [workMins, setWorkMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);

  const [currentTimerSecs, setCurrentTimeSecs] = useState(25 * 60);
  const [workPhase, setWorkPhase] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);

  return (
    <View style={styles.container}>
      <Text>Pomo-do-it</Text>
      <View style={styles.hr} />
      <TimerSettings
        workMins={workMins}
        setWorkMins={setWorkMins}
        breakMins={breakMins}
        setBreakMins={setBreakMins}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hr: {
    width: '80%',
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
