import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import sharedStyles from './styles/sharedStyles';

const numChars = new Set(
  Array(10)
    .fill(0)
    .map((_, i) => i.toString()),
);

const MIN_TIMER_PERIOD = 1;
const MAX_TIMER_PERIOD = 60;

const styles = StyleSheet.create({
  timerControlContainer: {
    marginHorizontal: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
  },
  timerPeriodInput: {
    color: '#fff',
    width: 32,
    fontSize: 24,
  },
});

/**
 * TimerSettings component contains all the timer setting controls, e.g:
 * - Set Working Time and Break Time lengths
 */
function TimerSettings({ workMins, breakMins, updateTimer, clickSound }) {
  console.log('!!! RENDERING TimerSettings - try to memoise?');
  const [workingPeriodInputString, setWorkPeriodString] = useState(
    workMins.toString(),
  );
  const [breakPeriodInputString, setBreakPeriodString] = useState(
    breakMins.toString(),
  );

  // Ensure Timer Mins String(s) displayed in Text Inputs matches the numerical workMins/breakMins values
  useEffect(() => {
    setWorkPeriodString(workMins.toString());
    setBreakPeriodString(breakMins.toString());
  }, [workMins, breakMins]);

  /**
   * Handles any changes to the work/break timer input boxes, ensuring only integer values are allowed
   *
   * @param {string} inputText - current value of the input text field just changed
   * @param {function} setStateFunc - the React.Dispatch function to set the state of the appropriate timer minutes
   */
  function handleTimerInputChange(inputText, setStateFunc) {
    const nums = [];

    for (const char of inputText) {
      if (numChars.has(char)) {
        nums.push(char);
      }
    }

    setStateFunc(nums.join(''));
  }

  /**
   * Handles onSubmit and onBlur events on both work/break timer input boxes (submitting a value)
   *
   * @param {boolean} workMinsInput - whether the Working Period Minutes input has been submitted;
   *                                  if false then the Break Period Minutes input has been submitted
   */
  function handleTimerInputSubmit(workMinsInput) {
    if (workMinsInput) {
      const newWorkMins = workingPeriodInputString
        ? Math.min(parseInt(workingPeriodInputString), MAX_TIMER_PERIOD)
        : workMins;

      updateTimer(newWorkMins, workMinsInput);
      setWorkPeriodString(newWorkMins.toString());
    } else {
      const newBreakMins = breakPeriodInputString
        ? Math.min(parseInt(breakPeriodInputString), MAX_TIMER_PERIOD)
        : breakMins;

      updateTimer(newBreakMins, workMinsInput);
      setBreakPeriodString(newBreakMins.toString());
    }
  }

  return (
    <View
      style={[
        sharedStyles.flexRow,
        sharedStyles.flexWrap,
        sharedStyles.fullWidth,
      ]}
    >
      <View style={[sharedStyles.flexRow, styles.timerControlContainer]}>
        <Text style={styles.label}>Working Period (mins): </Text>
        <Pressable
          style={({ pressed }) => [
            sharedStyles.button,
            pressed ? sharedStyles.buttonPressed : null,
          ]}
          accessibilityLabel="Decrement work period"
          onPress={() => {
            clickSound.playAsync();
            updateTimer(workMins - 1, true);
          }}
          disabled={workMins <= MIN_TIMER_PERIOD ? true : false}
        >
          <Text style={sharedStyles.buttonText}>-</Text>
        </Pressable>
        <TextInput
          style={styles.timerPeriodInput}
          accessibilityLabel={`Set working period in minutes. Minimum: ${MIN_TIMER_PERIOD} minute. Maximum: ${MAX_TIMER_PERIOD}`}
          value={workingPeriodInputString}
          keyboardType="numeric"
          onChangeText={(inputText) =>
            handleTimerInputChange(inputText, setWorkPeriodString)
          }
          onSubmitEditing={() => handleTimerInputSubmit(true)}
          onBlur={() => handleTimerInputSubmit(true)}
          maxLength={2}
        ></TextInput>

        <Pressable
          style={({ pressed }) => [
            sharedStyles.button,
            pressed ? sharedStyles.buttonPressed : null,
          ]}
          accessibilityLabel="Increment work period"
          onPress={() => {
            clickSound.playAsync();
            updateTimer(workMins + 1, true);
          }}
          disabled={workMins >= MAX_TIMER_PERIOD ? true : false}
        >
          <Text style={sharedStyles.buttonText}>+</Text>
        </Pressable>
      </View>
      <View style={[sharedStyles.flexRow, styles.timerControlContainer]}>
        <Text style={styles.label}>Break Period (mins): {'     '}</Text>
        <Pressable
          style={({ pressed }) => [
            sharedStyles.button,
            pressed ? sharedStyles.buttonPressed : null,
          ]}
          title="-"
          accessibilityLabel="Decrement break period"
          onPress={() => {
            clickSound.playAsync();
            updateTimer(breakMins - 1, false);
          }}
          disabled={breakMins <= MIN_TIMER_PERIOD ? true : false}
        >
          <Text style={sharedStyles.buttonText}>-</Text>
        </Pressable>
        <TextInput
          style={styles.timerPeriodInput}
          accessibilityLabel={`Set break period in minutes. Minimum: ${MIN_TIMER_PERIOD} minute. Maximum: ${MAX_TIMER_PERIOD}`}
          value={breakPeriodInputString}
          keyboardType="numeric"
          onChangeText={(inputText) =>
            handleTimerInputChange(inputText, setBreakPeriodString)
          }
          onSubmitEditing={() => handleTimerInputSubmit(false)}
          onBlur={() => handleTimerInputSubmit(false)}
          maxLength={2}
        ></TextInput>

        <Pressable
          style={({ pressed }) => [
            sharedStyles.button,
            pressed ? sharedStyles.buttonPressed : null,
          ]}
          title="+"
          accessibilityLabel="Increment break period"
          onPress={() => {
            clickSound.playAsync();
            updateTimer(breakMins + 1, false);
          }}
          disabled={breakMins >= MAX_TIMER_PERIOD ? true : false}
        >
          <Text style={sharedStyles.buttonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

TimerSettings.propTypes = {
  workMins: PropTypes.number.isRequired,
  breakMins: PropTypes.number.isRequired,
  updateTimer: PropTypes.func.isRequired,
  clickSound: PropTypes.shape({ playAsync: PropTypes.func }),
};

export default TimerSettings;
