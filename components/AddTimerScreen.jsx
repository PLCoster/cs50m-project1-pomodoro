import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';

import sharedStyles from './styles/sharedStyles';

function AddTimerScreen({ navigation, addTimer }) {
  return (
    <View>
      <Text>ADD TIMER SCREEN!!</Text>
      <Pressable
        style={({ pressed }) => [
          sharedStyles.button,
          pressed ? sharedStyles.buttonPressed : null,
        ]}
        accessibilityLabel={`Create a new Timer`}
        onPress={() => {
          addTimer(300, 'New Timer From Button');
          navigation.navigate('TimerHomeScreen');
        }}
      >
        <Text>ADD A DEFAULT TIMER!</Text>
      </Pressable>
    </View>
  );
}

export default AddTimerScreen;
