import React, { useState } from 'react';
import { Text, View, Pressable, TextInput, StyleSheet } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import sharedStyles from './styles/sharedStyles';

const styles = StyleSheet.create({
  timerValueInput: {
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

function AddTimerScreen({ navigation, addTimer }) {
  const [timerMins, setTimerMins] = useState(5);
  const [timerSecs, setTimerSecs] = useState(0);

  const numDigits = (num) => {
    let digits = 0;

    while (num > 0) {
      num = Math.floor(num / 10);
      digits += 1;
    }

    return Math.max(digits, 2);
  };

  const totalTimerSecs = timerMins * 60 + timerSecs;

  return (
    <View style={[sharedStyles.container, sharedStyles.timerBackground]}>
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
        ></TextInput>
        <Text style={[sharedStyles.text, styles.timerInputLabel]}>m</Text>
        <TextInput
          style={[sharedStyles.text, styles.timerValueInput]}
          accessibilityLabel={`Set Timer Seconds`}
          value={timerSecs.toString().padStart(2, 0)}
          keyboardType="numeric"
          onChangeText={(inputText) =>
            validateTimeInput(inputText, setTimerSecs, true)
          }
        ></TextInput>
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
            addTimer(timerMins * 60 + timerSecs, 'New Timer From Button');
            // Navigate back to the TimerHomeScreen, ensuring it is the bottom screen on the stack
            navigation.reset({
              index: 0,
              routes: [{ name: 'TimerHomeScreen' }],
            });
          }}
        >
          <FontAwesome name="play" size={32} color="white" />
        </Pressable>
      ) : null}
    </View>
  );
}

export default AddTimerScreen;
