import React, { useState, useContext } from 'react';
import { Text, View, Pressable, TextInput, StyleSheet } from 'react-native';

import { AudioContext } from '../App';
import { TimerContext } from './TimerNav';

import { FontAwesome } from '@expo/vector-icons';

import sharedStyles from './styles/sharedStyles';

const styles = StyleSheet.create({
  timerNameInput: {
    textAlign: 'center',
    fontSize: 40,
    color: '#fff',
  },
  timerValueInput: {
    textAlign: 'right',
    fontSize: 64,
    width: 72,
    justifyContent: 'flex-end',
  },
  timerInputLabel: {
    fontSize: 32,
    marginRight: 16,
  },
});

const NUM_CHARS = new Set(
  Array(10)
    .fill(0)
    .map((_, i) => i.toString()),
);

/**
 * Validates values input for the Timer minutes / seconds
 * @param {string} valueStr
 * @param {function} setterFunc
 * @param {boolean} secondInput
 */
function validateTimeInput(valueStr, setterFunc, secondInput = false) {
  const nums = [];
  for (const char of valueStr) {
    if (NUM_CHARS.has(char)) {
      nums.push(char);
    }
  }
  const numVal = nums.length > 0 ? parseInt(nums.join('')) : 0;
  secondInput ? setterFunc(Math.min(numVal, 99)) : setterFunc(numVal);
}

/**
 * Small helper function that returns the number of digits of given number
 * @param {number} num
 * @returns {number} The number of decimal digits in num
 */
function numDigits(num) {
  let digits = 0;
  while (num > 0) {
    num = Math.floor(num / 10);
    digits += 1;
  }
  return Math.max(digits, 2);
}

function AddTimerScreen({ route, navigation }) {
  const { addTimer, updateTimer } = useContext(TimerContext);
  const { clickSound } = useContext(AudioContext);

  const { timerID, initTimerName, initTimerSecs } = route.params;

  const [timerName, setTimerName] = useState(initTimerName);
  const [timerNameChanged, setTimerNameChanged] = useState(false);

  const [timerMins, setTimerMins] = useState(Math.floor(initTimerSecs / 60));
  const [timerSecs, setTimerSecs] = useState(initTimerSecs % 60);

  const totalTimerSecs = timerMins * 60 + timerSecs;

  function handleAddOrEditTimerSubmit() {
    const name =
      (timerNameChanged || timerID !== null) && timerName !== ''
        ? timerName
        : `${timerMins.toString()}m${timerSecs
            .toString()
            .padStart(2, 0)}s Timer`;

    const initialTimerSeconds = timerMins * 60 + timerSecs;
    if (!timerID) {
      // Create a brand new timer
      addTimer(timerMins * 60 + timerSecs, name);
    } else {
      // Edit an existing timer
      updateTimer(timerID, {
        id: timerID,
        timerName,
        initialTimerSeconds,
        currentTimerMilliSeconds: initialTimerSeconds * 1000,
        currentTimerSeconds: initialTimerSeconds,
        timerRunning: true,
      });
    }

    // Navigate back to the TimerHomeScreen, ensuring it is the bottom screen on the stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'TimerHomeScreen' }],
    });
  }

  return (
    <View style={[sharedStyles.container, sharedStyles.timerBackground]}>
      <TextInput
        style={styles.timerNameInput}
        accessibilityLabel={`Set Timer Name`}
        value={timerName}
        onChangeText={(inputText) => {
          console.log(inputText);
          setTimerNameChanged(true);
          setTimerName(inputText);
        }}
      />
      <View style={[sharedStyles.flexRow, sharedStyles.flexAlignEnd]}>
        <TextInput
          style={[
            sharedStyles.text,
            styles.timerValueInput,
            { width: numDigits(timerMins) * 36 },
          ]}
          accessibilityLabel={`Set Timer Minutes`}
          value={timerMins.toString().padStart(2, 0)}
          keyboardType="numeric"
          onChangeText={(inputText) =>
            validateTimeInput(inputText, setTimerMins)
          }
          maxLength={3}
        />
        <Text style={[sharedStyles.text, styles.timerInputLabel]}>m</Text>
        <TextInput
          style={[sharedStyles.text, styles.timerValueInput]}
          accessibilityLabel={`Set Timer Seconds`}
          value={timerSecs.toString().padStart(2, 0)}
          keyboardType="numeric"
          onChangeText={(inputText) =>
            validateTimeInput(inputText, setTimerSecs, true)
          }
        />
        <Text style={[sharedStyles.text, styles.timerInputLabel]}>s</Text>
      </View>

      {/* CAN ONLY CREATE A TIMER WHEN IT HAS A TOTAL TIMER OF >= 1 SECOND */}
      {totalTimerSecs > 0 ? (
        <Pressable
          style={({ pressed }) => [
            sharedStyles.button,
            pressed ? sharedStyles.buttonPressed : null,
          ]}
          accessibilityLabel={`Create a new Timer`}
          onPress={() => {
            clickSound.playAsync();
            handleAddOrEditTimerSubmit();
          }}
        >
          <FontAwesome name="play" size={32} color="white" />
        </Pressable>
      ) : null}
    </View>
  );
}

export default AddTimerScreen;
