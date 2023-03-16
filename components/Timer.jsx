import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import ClockDisplay from './ClockDisplay';

import sharedStyles from './styles/sharedStyles';

const styles = StyleSheet.create({
  timerContainer: {
    width: '80%',
    maxWidth: 200,
    minWidth: '40%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#fff',
    borderRadius: 5,
    marginTop: 8,
    padding: 8,
  },
  timerDetailsContainer: {
    padding: 4,
    justifyContent: 'space-between',
  },
  timerDetailsText: {
    fontSize: 16,
    color: '#fff',
  },
  timerControlButton: {
    marginRight: 0,
    paddingHorizontal: 8,
  },
  timerResetButton: {
    marginTop: 16,
  },
  timerLargeButtonContainer: {
    justifyContent: 'flex-end',
  },
  timerLargeButton: {
    marginRight: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  timerRemainingLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#fff',
  },
  timerElapsedLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'red',
  },
});

// A single Timer to be displayed on the TimerHome Screen
function Timer({
  navigation,
  id,
  timerName,
  initialTimerSeconds,
  currentTimerMilliSeconds,
  currentTimerSeconds,
  timerRunning,
  updateTimer,
  deleteTimer,
}) {
  const percentTimerRemaining =
    Math.round(
      Math.max(currentTimerMilliSeconds / (initialTimerSeconds * 1000), 0) *
        1000,
    ) / 1000;

  const toggleTimerRunning = () => {
    updateTimer(id, {
      id,
      timerName,
      initialTimerSeconds,
      currentTimerMilliSeconds,
      currentTimerSeconds,
      timerRunning: !timerRunning,
    });
  };

  const resetTimer = () => {
    updateTimer(id, {
      id,
      timerName,
      initialTimerSeconds,
      currentTimerMilliSeconds: initialTimerSeconds * 1000,
      currentTimerSeconds: initialTimerSeconds,
      timerRunning: false,
    });
  };

  return (
    <View style={styles.timerContainer}>
      {/* TIMER NAME, INITIAL TIME AND EDIT/DELETE CONTROLS */}
      <View style={[sharedStyles.flexRow, styles.timerDetailsContainer]}>
        <View>
          <Text style={styles.timerDetailsText}>{timerName}</Text>
          <Text style={styles.timerDetailsText}>
            (
            <ClockDisplay
              currentTimerMilliSecs={initialTimerSeconds * 1000}
              showTenths={false}
              fontSize={16}
            />
            )
          </Text>
        </View>
        <View style={sharedStyles.flexRow}>
          <Pressable
            style={({ pressed }) => [
              sharedStyles.button,
              styles.timerControlButton,
              pressed ? sharedStyles.buttonPressed : null,
            ]}
            accessibilityLabel={`Edit this Timer`}
            onPress={() =>
              navigation.navigate('AddTimerScreen', {
                timerID: id,
                initTimerName: timerName,
                initTimerSecs: initialTimerSeconds,
              })
            }
          >
            <FontAwesome name="edit" size={16} color="#fff" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              sharedStyles.button,
              styles.timerControlButton,
              pressed ? sharedStyles.buttonPressed : null,
            ]}
            accessibilityLabel={`Delete this Timer`}
            onPress={() => deleteTimer(id)}
          >
            <FontAwesome name="trash-o" size={16} color="#fff" />
          </Pressable>
        </View>
      </View>

      <View style={[sharedStyles.flexRow, styles.timerDetailsContainer]}>
        {/* TIMER CLOCK AND RESET BUTTON */}
        <View style={[sharedStyles.flexRow, sharedStyles.flexJustifyBetween]}>
          <ClockDisplay
            currentTimerMilliSecs={currentTimerSeconds * 1000}
            showTenths={false}
            fontSize={54}
          />
          {currentTimerSeconds < initialTimerSeconds ? (
            <Pressable
              style={({ pressed }) => [
                sharedStyles.button,
                styles.timerResetButton,
                pressed ? sharedStyles.buttonPressed : null,
              ]}
              accessibilityLabel={`Reset the Timer`}
              onPress={resetTimer}
            >
              <FontAwesome name="repeat" size={24} color="white" />
            </Pressable>
          ) : null}
        </View>

        {/* PAUSE / START / STOP BUTTON */}
        <View style={styles.largeButtonContainer}>
          {currentTimerSeconds > 0 ? (
            <Pressable
              style={({ pressed }) => [
                sharedStyles.button,
                styles.timerLargeButton,
                pressed ? sharedStyles.buttonPressed : null,
              ]}
              accessibilityLabel={`${
                timerRunning ? 'Pause' : 'Start'
              } the timer`}
              onPress={toggleTimerRunning}
            >
              {timerRunning ? (
                <FontAwesome name="pause" size={32} color="white" />
              ) : (
                <FontAwesome name="play" size={32} color="white" />
              )}
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [
                sharedStyles.button,
                styles.timerLargeButton,
                pressed ? sharedStyles.buttonPressed : null,
              ]}
              accessibilityLabel={`${
                timerRunning ? 'Pause' : 'Start'
              } the timer`}
              onPress={resetTimer}
            >
              <FontAwesome name="stop" size={32} color="white" />
            </Pressable>
          )}
        </View>
      </View>

      {/* GRAPHICAL TIMER DISPLAY */}
      <View style={[sharedStyles.flexRow, sharedStyles.fullWidth]}>
        <View
          style={[
            styles.timerRemainingLine,
            {
              flex: percentTimerRemaining,
            },
          ]}
        />
        <View
          style={[
            styles.timerElapsedLine,
            {
              flex: 1 - percentTimerRemaining,
            },
          ]}
        />
      </View>
    </View>
  );
}

export default Timer;
