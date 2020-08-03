import { Dimensions, StyleSheet } from 'react-native';

const { width: windowWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    left: 15,
    right: 15,
    top: 0,
    height: 15,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  container: {
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: 'white',
  },

  indicator: {
    alignSelf: 'center',
    width: (7.5 * windowWidth) / 100,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
});
