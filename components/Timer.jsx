import React, { useState, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { Audio } from 'expo-av';

import TimerSettings from './TimerSettings';
import TimerClock from './TimerClock';

import vibrate from '../utils/vibrate';

import sharedStyles from './styles/sharedStyles';

const DEFAULT_WORK_MINS = 25;
const DEFAULT_BREAK_MINS = 5;
const MIN_TIMER_PERIOD = 1;
const MAX_TIMER_PERIOD = 60;

const unloadedSound = {
  playAsync: () => {
    console.log('No sounds loaded');
  },
  unloadAsync: () => {
    console.log('No sounds loaded to be unloaded');
  },
};

export default function Timer() {
  const [workMins, setWorkMins] = useState(DEFAULT_WORK_MINS);
  const [breakMins, setBreakMins] = useState(DEFAULT_BREAK_MINS);

  const [currentTimerSecs, setCurrentTimerSecs] = useState(workMins * 60);
  const [workPhase, setWorkPhase] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);

  const currentTimerSecsRef = useRef(currentTimerSecs);
  const currentTimeoutRef = useRef();

  const [clickSound, setClickSound] = useState(unloadedSound);
  const [alarmSound, setAlarmSound] = useState(unloadedSound);

  const resetTimer = () => {
    setTimerRunning(false);
    setWorkPhase(true);
    setWorkMins(DEFAULT_WORK_MINS);
    setBreakMins(DEFAULT_BREAK_MINS);
    setCurrentTimerSecs(DEFAULT_WORK_MINS * 60);
    currentTimerSecsRef.current = DEFAULT_WORK_MINS * 60;
  };

  const updateTimer = (value, updateWorkTimer) => {
    const validTime = Math.min(
      Math.max(MIN_TIMER_PERIOD, value),
      MAX_TIMER_PERIOD,
    );
    if (updateWorkTimer) {
      setWorkMins(validTime);
    } else {
      setBreakMins(validTime);
    }

    if (
      !timerRunning &&
      ((updateWorkTimer && workPhase) || (!updateWorkTimer && !workPhase))
    ) {
      setCurrentTimerSecs(validTime * 60);
      currentTimerSecsRef.current = validTime * 60;
    }
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
        const { sound: alarm } = await Audio.Sound.createAsync(
          require('../assets/sounds/watch_alarm.mp3'),
        );

        console.log('Sounds Loaded!');
        setClickSound(click);
        setAlarmSound(alarm);
      } catch (err) {
        console.error('Error when trying to load sounds: ', err);
      }
    })();

    return () => {
      clickSound.unloadAsync();
      alarmSound.unloadAsync();
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

          // Time is going to reach 0, play alarm and vibrate
          if (currentTimerSecsRef.current === 0) {
            alarmSound.playAsync();
            vibrate();
          }

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
      clearTimeout(currentTimeoutRef.current);
      currentTimeoutRef.current = null;
    };
  }, [timerRunning, workPhase]);

  return (
    <View
      style={[
        sharedStyles.container,
        workPhase ? sharedStyles.workPhase : sharedStyles.breakPhase,
      ]}
    >
      <Text style={sharedStyles.header}>Pomo-do-it</Text>
      <View style={sharedStyles.hr} />
      <TimerSettings
        workMins={workMins}
        breakMins={breakMins}
        updateTimer={updateTimer}
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
