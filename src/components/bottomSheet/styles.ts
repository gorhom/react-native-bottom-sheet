import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column-reverse',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    /**
     * added safe area to prevent the sheet from floating above
     * the bottom of the screen, when sheet being over dragged.
     */
    paddingBottom: 50,
    overflow: 'hidden',
  },
  contentContainer: {},
});
