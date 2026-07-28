import { Dimensions, Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer' as const,
      },
      default: {},
    }),
  },

  indicator: {
    alignSelf: 'center',
    width: (7.5 * Dimensions.get('window').width) / 100,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
});
