import React, { useContext, useEffect } from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import Timer from './Timer';
import { TimerContext } from './TimerNav';

import sharedStyles from './styles/sharedStyles';

const DEFAULT_NEW_TIMER_PARAMS = {
  timerID: null,
  initTimerName: 'New Timer - 5m00s',
  initTimerSecs: 300,
};

const styles = StyleSheet.create({
  addTimerButton: {
    position: 'absolute',
    right: 40,
    bottom: 40,
  },
});

function TimerHomeScreen({ navigation }) {
  const { timers, updateTimer, deleteTimer } = useContext(TimerContext);

  const timerComponents = Object.values(timers).map((timerProps) => (
    <Timer
      key={timerProps.id}
      navigation={navigation}
      {...timerProps}
      updateTimer={updateTimer}
      deleteTimer={deleteTimer}
      timers={timers}
    />
  ));

  // If we have no timers, navigate immediately to the Add timer screen
  useEffect(() => {
    if (Object.keys(timers).length === 0) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'AddTimerScreen', params: DEFAULT_NEW_TIMER_PARAMS }],
      });
    }
  }, [navigation, timers]);

  return (
    <View style={[sharedStyles.timerBackground, { flex: 1 }]}>
      <ScrollView
        contentContainerStyle={[sharedStyles.container, sharedStyles.fullWidth]}
      >
        <Text style={sharedStyles.header}>Timers</Text>
        <View style={sharedStyles.hr} />

        {timerComponents.length ? (
          timerComponents
        ) : (
          <Text style={sharedStyles.text}>No Timers yet, try adding one!</Text>
        )}
        <View style={{ padding: 16 }} />
      </ScrollView>
      <Pressable
        style={({ pressed }) => [
          styles.addTimerButton,
          sharedStyles.button,
          pressed ? sharedStyles.buttonPressed : null,
        ]}
        accessibilityLabel={`Create a new Timer`}
        onPress={() =>
          navigation.navigate('AddTimerScreen', DEFAULT_NEW_TIMER_PARAMS)
        }
      >
        <FontAwesome name="plus" size={40} color="white" />
      </Pressable>
    </View>
  );
}

export default TimerHomeScreen;
