import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';

import TimerSettings from './TimerSettings';
import TimerClock from './TimerClock';

const DEFAULT_WORK_MINS = 25;
const DEFAULT_BREAK_MINS = 5;

export default function Timer() {
  const [workMins, setWorkMins] = useState(DEFAULT_WORK_MINS);
  const [breakMins, setBreakMins] = useState(DEFAULT_BREAK_MINS);

  const [currentTimerSecs, setCurrentTimerSecs] = useState(workMins * 60);
  const [workPhase, setWorkPhase] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);

  const currentTimerSecsRef = useRef(currentTimerSecs);
  const currentTimeoutRef = useRef();

  const [clickSound, setClickSound] = useState({
    playAsync: () => {
      console.log('No sounds loaded');
    },
  });

  console.log(clickSound);

  const resetTimer = () => {
    setTimerRunning(false);
    setWorkPhase(true);
    setWorkMins(DEFAULT_WORK_MINS);
    setBreakMins(DEFAULT_BREAK_MINS);
    setCurrentTimerSecs(DEFAULT_WORK_MINS * 60);
    currentTimerSecsRef.current = DEFAULT_WORK_MINS * 60;
  };

  // Helper function that repeatedly sets an interval that should tick
  // every ~1s, and adjusts the next tick based on the time of the previous one
  const getAccurateInterval = (callback, delay) => {
    let nextTimer = Date.now();

    return function getNextTimeout() {
      nextTimer += delay;
      currentTimeoutRef.current = setTimeout(() => {
        callback();
        getNextTimeout();
      }, nextTimer - Date.now());
    };
  };

  // Effect to load sounds on initial Timer mount
  useEffect(() => {
    (async function loadClickSound() {
      try {
        const { sound: click } = await Audio.Sound.createAsync(
          require('../assets/sounds/fingersnap.mp3'),
        );
        console.log('Sounds Loaded!');
        setClickSound(click);
      } catch (err) {
        console.error('Error when trying to load sounds: ', err);
      }
    })();

    return () => {
      clickSound ? clickSound.unloadAsync() : null;
    };
  }, []);

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
    if (timerRunning && currentTimeoutRef.current === null) {
      getAccurateInterval(() => {
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
    }

    // Effect Cleanup when Timer Stops or Component Unmounts
    return () => {
      console.log('CLEARING TIMEOUT');
      clearTimeout(currentTimeoutRef.current);
      currentTimeoutRef.current = null;
    };
  }, [timerRunning, workPhase]);

  return (
    <View style={styles.container}>
      <Text>Pomo-do-it</Text>
      <View style={styles.hr} />
      <TimerSettings
        workMins={workMins}
        setWorkMins={setWorkMins}
        breakMins={breakMins}
        setBreakMins={setBreakMins}
        workPhase={workPhase}
        timerRunning={timerRunning}
        setCurrentTimerSecs={setCurrentTimerSecs}
        clickSound={clickSound}
      />
      <TimerClock
        currentTimerSecs={currentTimerSecs}
        timerRunning={timerRunning}
        setTimerRunning={setTimerRunning}
        workPhase={workPhase}
        setWorkPhase={setWorkPhase}
        resetTimer={resetTimer}
        clickSound={clickSound}
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
