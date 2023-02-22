import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Math.max(Constants.statusBarHeight, 20),
    transition: 'background-color 0.5s',
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
  workPhase: {
    backgroundColor: '#d95550',
  },
  breakPhase: {
    backgroundColor: '#457ca3',
  },
  hr: {
    width: '80%',
    borderBottomColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
  },
  button: {
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 5,
    width: 32,

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
  timerPeriodInput: {
    color: '#fff',
    width: 32,
    fontSize: 24,
  },
});

export default sharedStyles;
