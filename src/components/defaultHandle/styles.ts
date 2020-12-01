import { Dimensions, StyleSheet } from 'react-native';

const { width: windowWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    padding: 10,
  },

  indicator: {
    alignSelf: 'center',
    width: (7.5 * windowWidth) / 100,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
});
