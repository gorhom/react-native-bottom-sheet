import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  debug: {
    position: 'absolute',
    left: 20,
    top: 25,
    backgroundColor: 'rgba(0, 0,0,0.5)',
  },
  debugText: {
    fontSize: 24,
    color: 'white',
  },
});
