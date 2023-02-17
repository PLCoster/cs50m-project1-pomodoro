import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

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
export default function TimerSettings({
  workMins,
  setWorkMins,
  breakMins,
  setBreakMins,
}) {
  function handleTimerInputChange(inputText, setStateFunc) {
    // !!! Might need something more complex here to handle the input state to prevent weird behaviour when trying to get single-digit time vales
    const nums = [];

    for (const char of inputText) {
      if (numChars.has(char)) {
        nums.push(char);
      }
    }

    if (!nums.length) {
      setStateFunc(MIN_TIMER_PERIOD);
    } else {
      const newMins = Math.min(parseInt(nums.join('')), MAX_TIMER_PERIOD);
      setStateFunc(newMins);
    }
  }

  return (
    <View>
      <Text>
        Working Period (mins):{' '}
        <TextInput
          accessibilityLabel={`Set working period in minutes. Minimum: ${MIN_TIMER_PERIOD} minute. Maximum: ${MAX_TIMER_PERIOD}`}
          value={workMins}
          keyboardType="numeric"
          onChangeText={(inputText) =>
            handleTimerInputChange(inputText, setWorkMins)
          }
          onSubmitEditing={() => console.log('SUBMITTED')}
          maxLength={2}
        ></TextInput>
      </Text>
      <Button
        title="+"
        accessibilityLabel="Increment work period"
        onPress={() => {
          console.log('CLICKED');
          setWorkMins((prevWorkMins) =>
            Math.min(prevWorkMins + 1, MAX_TIMER_PERIOD),
          );
        }}
        disabled={workMins === MAX_TIMER_PERIOD ? true : false}
      ></Button>
      <Button
        title="-"
        accessibilityLabel="Decrement work period"
        onPress={() =>
          setWorkMins((prevWorkMins) =>
            Math.max(prevWorkMins - 1, MIN_TIMER_PERIOD),
          )
        }
        disabled={workMins === MIN_TIMER_PERIOD ? true : false}
      ></Button>
      <Text>
        Break Period (mins):{' '}
        <TextInput
          accessibilityLabel={`Set break period in minutes. Minimum: ${MIN_TIMER_PERIOD} minute. Maximum: ${MAX_TIMER_PERIOD}`}
          value={breakMins}
          keyboardType="numeric"
          onChangeText={(inputText) =>
            handleTimerInputChange(inputText, setBreakMins)
          }
          onSubmitEditing={() => console.log('SUBMITTED')}
          maxLength={2}
        ></TextInput>
      </Text>
      <Button
        title="+"
        accessibilityLabel="Increment break period"
        onPress={() =>
          setBreakMins((breakMins) => Math.min(breakMins + 1, MAX_TIMER_PERIOD))
        }
        disabled={breakMins === MAX_TIMER_PERIOD ? true : false}
      ></Button>
      <Button
        title="-"
        accessibilityLabel="Decrement break period"
        onPress={() =>
          setBreakMins((breakMins) => Math.max(breakMins - 1, MIN_TIMER_PERIOD))
        }
        disabled={breakMins === MIN_TIMER_PERIOD ? true : false}
      ></Button>
    </View>
  );
}
