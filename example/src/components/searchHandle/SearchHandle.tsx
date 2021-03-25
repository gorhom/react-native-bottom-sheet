import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useShowcaseTheme } from '@gorhom/showcase-template';
import { TextInput } from 'react-native-gesture-handler';
import isEqual from 'lodash.isequal';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
export const SEARCH_HANDLE_HEIGHT = 69;

const BottomSheetHandleComponent = () => {
  // state
  const [value, setValue] = useState('');

  // hooks
  const { snapTo } = useBottomSheet();
  const { dark } = useShowcaseTheme();

  // styles
  const indicatorStyle = useMemo(
    () => [
      styles.indicator,
      {
        backgroundColor: !dark
          ? 'rgba(0, 0, 0, 0.25)'
          : 'rgba(255, 255, 255, 0.25)',
      },
    ],
    [dark]
  );

  // callbacks
  const handleInputChange = useCallback(
    ({
      nativeEvent: { text },
    }: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setValue(text);
    },
    []
  );
  const handleInputFocus = useCallback(() => {
    snapTo(2);
  }, [snapTo]);

  // render
  return (
    <View style={styles.container}>
      <View style={indicatorStyle} />
      <TextInput
        style={styles.input}
        value={value}
        textContentType="location"
        placeholder="Search for a place or address"
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
    </View>
  );
};

const BottomSheetHandle = memo(BottomSheetHandleComponent, isEqual);

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  indicator: {
    alignSelf: 'center',
    width: (8 * SCREEN_WIDTH) / 100,
    height: 5,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
});

export default BottomSheetHandle;
