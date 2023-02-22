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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    color: '#fff',
    fontSize: 30,
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
    margin: 20,
    width: '80%',
    borderBottomColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    backgroundColor: 'red',
  },
});

export default sharedStyles;
