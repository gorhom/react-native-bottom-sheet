import { Platform, StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from '../../constants';


export const styles = StyleSheet.create({
  container: {
    padding: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer' as const
      },
      default: {}
    }),
  },

  indicator: {
    alignSelf: 'center',
    width: (7.5 * WINDOW_WIDTH) / 100,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
});
