import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import TimerSettings from './TimerSettings';
import TimerClock from './TimerClock';

export default function Timer() {
  const [workMins, setWorkMins] = useState(1);
  const [breakMins, setBreakMins] = useState(1);

  const [currentTimerSecs, setCurrentTimerSecs] = useState(15);
  const [workPhase, setWorkPhase] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);

  const currentTimerSecsRef = useRef(currentTimerSecs);
  const currentTimeoutRef = useRef(false);

  const toggleTimerRunning = () => setTimerRunning(!timerRunning);

  const getAccurateTimeout = (callback, delay) => {
    let nextTimer = Date.now();

    return function getNextTimeout() {
      nextTimer += delay;
      currentTimeoutRef.current = setTimeout(() => {
        callback();
        getNextTimeout();
      }, nextTimer - Date.now());
    };
  };

  // Effect to update timer countdown when phase switches work <-> break
  useEffect(() => {
    workPhase
      ? setCurrentTimerSecs(workMins * 60)
      : setCurrentTimerSecs(breakMins * 60);
    currentTimerSecsRef.current = workPhase ? workMins * 60 : breakMins * 60;
  }, [workPhase]);

  // Effect to Start / Stop Timer Clock Countdown
  // See info on React Hooks with setInterval here:
  // https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  useEffect(() => {
    if (timerRunning) {
      getAccurateTimeout(() => {
        if (currentTimerSecsRef.current > 0) {
          // Continue current timer countdown
          currentTimerSecsRef.current -= 1;
          setCurrentTimerSecs((prevSeconds) => {
            return prevSeconds - 1;
          });
        } else {
          // Timer has reached 0, switch timer phase
          setWorkPhase((workPhase) => !workPhase);
        }
      }, 1000)();
    } else {
      // We have stopped the timer running, clear any Timeout
      clearTimeout(currentTimeoutRef.current);
    }

    // Effect Cleanup
    return () => clearTimeout(currentTimeoutRef.current);
  }, [timerRunning]);

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
      <TimerClock
        currentTimerSecs={currentTimerSecs}
        timerRunning={timerRunning}
        toggleTimerRunning={toggleTimerRunning}
        workPhase={workPhase}
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
