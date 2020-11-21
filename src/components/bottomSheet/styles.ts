import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  contentContainer: {
    flex: 1,
  },
  debug: {
    position: 'absolute',
    left: 20,
    top: 100,
    backgroundColor: 'rgba(0, 0,0,0.5)',
  },
  debugText: {
    fontSize: 24,
    color: 'white',
  },
});
