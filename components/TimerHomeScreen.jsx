import React, { useEffect } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import Timer from './Timer';

import sharedStyles from './styles/sharedStyles';

function TimerHomeScreen({ navigation, timers, updateTimer, deleteTimer }) {
  console.log('CALLING TIMER HOME SCREEN', timers);

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
        routes: [{ name: 'AddTimerScreen' }],
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

        <Pressable
          style={({ pressed }) => [
            sharedStyles.button,
            pressed ? sharedStyles.buttonPressed : null,
          ]}
          accessibilityLabel={`Create a new Timer`}
          onPress={() => navigation.navigate('AddTimerScreen')}
        >
          <FontAwesome name="plus" size={40} color="white" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default TimerHomeScreen;
