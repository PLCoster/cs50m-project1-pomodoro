import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

import PomoSettings from './PomoSettings';
import ClockDisplay from './ClockDisplay';
import useAccurateInterval from '../hooks/useAccurateInterval';

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

const styles = StyleSheet.create({
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

export default function Timer() {
  const [workMins, setWorkMins] = useState(DEFAULT_WORK_MINS);
  const [breakMins, setBreakMins] = useState(DEFAULT_BREAK_MINS);

  const [currentTimerSecs, setCurrentTimerSecs] = useState(workMins * 60);
  const [workPhase, setWorkPhase] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);

  const currentTimerSecsRef = useRef(currentTimerSecs);

  const [clickSound, setClickSound] = useState(unloadedSound);
  const [alarmSound, setAlarmSound] = useState(unloadedSound);
  const [playAlarm, setPlayAlarm] = useState(true);
  const [vibrationOn, setVibrationOn] = useState(true);

  const playAlarmRef = useRef(true);
  const vibrationOnRef = useRef(true);

  const togglePlayAlarm = useCallback(() => {
    const nextPlayAlarm = !playAlarm;
    setPlayAlarm(nextPlayAlarm);
    playAlarmRef.current = nextPlayAlarm;
  }, [playAlarm]);

  const toggleVibration = useCallback(() => {
    const nextVibration = !vibrationOn;
    setVibrationOn(nextVibration);
    vibrationOnRef.current = nextVibration;
  }, [vibrationOn]);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setWorkPhase(true);
    setWorkMins(DEFAULT_WORK_MINS);
    setBreakMins(DEFAULT_BREAK_MINS);
    setCurrentTimerSecs(DEFAULT_WORK_MINS * 60);
    currentTimerSecsRef.current = DEFAULT_WORK_MINS * 60;
  }, []);

  const updateTimer = useCallback(
    (value, updateWorkTimer) => {
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
    },
    [timerRunning, workPhase],
  );

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

  // Custom hook which calls callback at given interval
  // Clears timeout when timer is no longer running
  // See info on React Hooks with setInterval here:
  // https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  useAccurateInterval(
    timerRunning,
    useCallback(() => {
      if (currentTimerSecsRef.current >= 1) {
        // Continue current timer countdown
        currentTimerSecsRef.current -= 1;

        // Time is going to reach 0, play alarm and vibrate
        if (currentTimerSecsRef.current === 0) {
          playAlarmRef.current ? alarmSound.playAsync() : null;
          vibrationOnRef.current ? vibrate() : null;
        }

        setCurrentTimerSecs(Math.max(currentTimerSecsRef.current, 0));
      } else {
        // Timer has reached 0, switch timer phase
        setWorkPhase((workPhase) => !workPhase);
      }
    }, [alarmSound]),
    1000,
  );

  return (
    <View
      style={[
        sharedStyles.container,
        workPhase ? sharedStyles.workPhase : sharedStyles.breakPhase,
      ]}
    >
      <Text style={sharedStyles.header}>Pomo-do-it</Text>
      <View style={sharedStyles.hr} />
      <PomoSettings
        workMins={workMins}
        breakMins={breakMins}
        workPhase={workPhase}
        updateTimer={updateTimer}
        clickSound={clickSound}
        playAlarm={playAlarm}
        togglePlayAlarm={togglePlayAlarm}
        vibrationOn={vibrationOn}
        toggleVibration={toggleVibration}
      />
      <View style={sharedStyles.hr} />

      {/* CLOCK AND PHASE DISPLAY */}
      <ClockDisplay currentTimerMilliSecs={currentTimerSecs * 1000} />
      <Text style={styles.phaseDisplay}>
        {workPhase ? 'WORKING' : 'RESTING'}
      </Text>

      {/* TIMER CONTROLS */}
      <View style={styles.timerControlContainer}>
        <Pressable
          style={({ pressed }) => [
            sharedStyles.button,
            pressed ? sharedStyles.buttonPressed : null,
          ]}
          accessibilityLabel={`${
            timerRunning ? 'Pause' : 'Start'
          } the pomodoro timer`}
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
          accessibilityLabel={`Skip the remaining ${
            workPhase ? 'Work' : 'Break'
          } timer and skip to the ${workPhase ? 'Break' : 'Work'} phase`}
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
          accessibilityLabel="Reset the timer to initial settings"
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
