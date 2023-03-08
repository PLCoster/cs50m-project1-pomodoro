import React, { memo } from 'react';
import { StyleSheet, Text, View, Pressable, SectionList } from 'react-native';
import PropTypes from 'prop-types';

import sharedStyles from './styles/sharedStyles';

/**
 * Returns array containing [minutes, seconds, tenths of seconds] for the clock display, calculated from given milliseconds (ms)
 *
 * @param {number} ms - an integer number of milliseconds for clock display
 * @returns {number[]} - [minutes, seconds, tenths of seconds]
 */
function msToClockVals(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor(ms / 1000) % 60;
  const tenths = Math.floor(ms / 100) % 10;

  return [min, sec, tenths];
}

const styles = StyleSheet.create({
  timerClockContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  clockDisplay: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 600,
  },
  tenthsDisplay: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 500,
  },
});

function TimerClock({ currentTimerMilliSecs, showTenths }) {
  const [mins, secs, tenths] = msToClockVals(currentTimerMilliSecs);

  return (
    <View style={[styles.timerClockContainer, styles.flexRow]}>
      <Text
        style={styles.clockDisplay}
        accessibilityLabel={`
        Clock Time: ${Math.floor(currentTimerMilliSecs / 60)} minutes and ${
          currentTimerMilliSecs % 60
        } seconds`}
      >
        {`${mins}:${secs.toString().padStart(2, '0')}`}
      </Text>
      <Text style={styles.tenthsDisplay}>
        {showTenths ? `${tenths}` : null}
      </Text>
    </View>
  );
}

TimerClock.propTypes = {
  currentTimerMilliSecs: PropTypes.number.isRequired,
  showTenths: PropTypes.bool,
};

export default memo(TimerClock);
