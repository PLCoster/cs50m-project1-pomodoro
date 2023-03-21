import React, { useContext } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { FontAwesome } from '@expo/vector-icons';

import ClockDisplay from './ClockDisplay';
import { AudioContext } from '../App';

import sharedStyles from './styles/sharedStyles';

const DEFAULT_COLOR = '#fff';
const TIMER_ELAPSED_COLOR = '#e98b1e';

const styles = StyleSheet.create({
  timerContainer: {
    width: '60%',
    minWidth: 200,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DEFAULT_COLOR,
    borderRadius: 5,
    marginVertical: 8,
    padding: 8,
  },
  timerDetailsContainer: {
    padding: 4,
    justifyContent: 'space-between',
  },
  timerDetailsText: {
    fontSize: 16,
    color: DEFAULT_COLOR,
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
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: DEFAULT_COLOR,
  },
  timerElapsedLine: {
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: TIMER_ELAPSED_COLOR,
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
  const { clickSound } = useContext(AudioContext);

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
            onPress={() => {
              navigation.navigate('AddTimerScreen', {
                timerID: id,
                initTimerName: timerName,
                initTimerSecs: initialTimerSeconds,
              });
            }}
          >
            <FontAwesome name="edit" size={16} color={DEFAULT_COLOR} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              sharedStyles.button,
              styles.timerControlButton,
              pressed ? sharedStyles.buttonPressed : null,
            ]}
            accessibilityLabel={`Delete this Timer`}
            onPress={() => {
              clickSound.playAsync();
              deleteTimer(id);
            }}
          >
            <FontAwesome name="trash-o" size={16} color={DEFAULT_COLOR} />
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
            fontColor={currentTimerSeconds <= 0 ? TIMER_ELAPSED_COLOR : null}
          />
          <Pressable
            style={({ pressed }) => [
              sharedStyles.button,
              styles.timerResetButton,
              pressed ? sharedStyles.buttonPressed : null,
              // {display: }
            ]}
            accessibilityLabel={`Reset the Timer`}
            onPress={() => resetTimer()}
          >
            <FontAwesome name="repeat" size={24} color={DEFAULT_COLOR} />
          </Pressable>
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
              onPress={() => {
                clickSound.playAsync();
                toggleTimerRunning();
              }}
            >
              {timerRunning ? (
                <FontAwesome name="pause" size={32} color={DEFAULT_COLOR} />
              ) : (
                <FontAwesome name="play" size={32} color={DEFAULT_COLOR} />
              )}
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [
                sharedStyles.button,
                styles.timerLargeButton,
                pressed ? sharedStyles.buttonPressed : null,
              ]}
              accessibilityLabel={`Stop the timer`}
              onPress={() => {
                resetTimer();
              }}
            >
              <FontAwesome name="stop" size={32} color={DEFAULT_COLOR} />
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

Timer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
  id: PropTypes.string.isRequired,
  timerName: PropTypes.string.isRequired,
  initialTimerSeconds: PropTypes.number.isRequired,
  currentTimerMilliSeconds: PropTypes.number.isRequired,
  currentTimerSeconds: PropTypes.number.isRequired,
  timerRunning: PropTypes.bool.isRequired,
  updateTimer: PropTypes.func.isRequired,
  deleteTimer: PropTypes.func.isRequired,
};

export default Timer;
