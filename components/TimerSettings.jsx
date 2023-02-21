import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import PropTypes from 'prop-types';

const MIN_TIMER_PERIOD = 1;
const MAX_TIMER_PERIOD = 60;
const numChars = new Set(
  Array(10)
    .fill(0)
    .map((_, i) => i.toString()),
);

/**
 * TimerSettings component contains all the timer setting controls, e.g:
 * - Set Working Time and Break Time lengths
 */
function TimerSettings({
  workMins,
  setWorkMins,
  breakMins,
  setBreakMins,
  workPhase,
  timerRunning,
  setCurrentTimerSecs,
}) {
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

      setWorkMins(newWorkMins);
      setWorkPeriodString(newWorkMins.toString());
      if (!timerRunning && workPhase) {
        setCurrentTimerSecs(newWorkMins * 60);
      }
    } else {
      const newBreakMins = breakPeriodInputString
        ? Math.min(parseInt(breakPeriodInputString), MAX_TIMER_PERIOD)
        : breakMins;

      setBreakMins(newBreakMins);
      setBreakPeriodString(newBreakMins.toString());
      if (!timerRunning && !workPhase) {
        setCurrentTimerSecs(newBreakMins * 60);
      }
    }
  }

  return (
    <View>
      <Text>
        Working Period (mins):{' '}
        <TextInput
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
      </Text>
      <Button
        title="+"
        accessibilityLabel="Increment work period"
        onPress={() =>
          setWorkMins((prevWorkMins) => {
            const updatedWorkMins = Math.min(
              prevWorkMins + 1,
              MAX_TIMER_PERIOD,
            );

            if (!timerRunning && workPhase) {
              setCurrentTimerSecs(updatedWorkMins * 60);
            }

            return updatedWorkMins;
          })
        }
        disabled={workMins >= MAX_TIMER_PERIOD ? true : false}
      ></Button>
      <Button
        title="-"
        accessibilityLabel="Decrement work period"
        onPress={() =>
          setWorkMins((prevWorkMins) => {
            const updatedWorkMins = Math.max(
              prevWorkMins - 1,
              MIN_TIMER_PERIOD,
            );

            if (!timerRunning && workPhase) {
              setCurrentTimerSecs(updatedWorkMins * 60);
            }

            return updatedWorkMins;
          })
        }
        disabled={workMins <= MIN_TIMER_PERIOD ? true : false}
      ></Button>
      <Text>
        Break Period (mins):{' '}
        <TextInput
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
      </Text>
      <Button
        title="+"
        accessibilityLabel="Increment break period"
        onPress={() =>
          setBreakMins((prevBreakMins) => {
            const updatedBreakMins = Math.min(
              prevBreakMins + 1,
              MAX_TIMER_PERIOD,
            );

            if (!timerRunning && !workPhase) {
              setCurrentTimerSecs(updatedBreakMins * 60);
            }

            return updatedBreakMins;
          })
        }
        disabled={breakMins >= MAX_TIMER_PERIOD ? true : false}
      ></Button>
      <Button
        title="-"
        accessibilityLabel="Decrement break period"
        onPress={() =>
          setBreakMins((prevBreakMins) => {
            const updatedBreakMins = Math.max(
              prevBreakMins - 1,
              MIN_TIMER_PERIOD,
            );

            if (!timerRunning && !workPhase) {
              setCurrentTimerSecs(updatedBreakMins * 60);
            }

            return updatedBreakMins;
          })
        }
        disabled={breakMins <= MIN_TIMER_PERIOD ? true : false}
      ></Button>
    </View>
  );
}

TimerSettings.propTypes = {
  workMins: PropTypes.number.isRequired,
  setWorkMins: PropTypes.func.isRequired,
  breakMins: PropTypes.number.isRequired,
  setBreakMins: PropTypes.func.isRequired,
  workPhase: PropTypes.bool.isRequired,
  timerRunning: PropTypes.bool.isRequired,
  setCurrentTimerSecs: PropTypes.func.isRequired,
};

export default TimerSettings;
