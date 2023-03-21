import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const sharedStyles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    paddingBottom: 64,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Math.max(Constants.statusBarHeight, 20),
    transition: 'background-color 0.5s',
  },
  fullWidth: {
    width: '100%',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  flexJustifyBetween: {
    justifyContent: 'space-between',
  },
  flexAlignEnd: {
    alignItems: 'flex-end',
  },
  header: {
    marginBottom: 10,
    color: '#fff',
    fontSize: 32,
    lineHeight: 30,
    letterSpacing: 1,
    transform: 'scale(1, 1.2)',
  },
  text: {
    color: '#fff',
  },
  hr: {
    width: '80%',
    borderBottomColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 12,

    backgroundColor: 'rgba(255, 255, 255, 0.2)',

    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 700,
    userSelect: 'none',
  },

  // Timer Styles
  timerBackground: {
    backgroundColor: '#4e7a76',
  },

  // Pomodoro Timer Styles
  workPhase: {
    backgroundColor: '#d95550',
  },
  breakPhase: {
    backgroundColor: '#457ca3',
  },
});

export default sharedStyles;
