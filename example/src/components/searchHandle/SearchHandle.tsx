import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import isEqual from 'lodash.isequal';
import { useAppearance } from '../../hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
export const SEARCH_HANDLE_HEIGHT = 69;

const BottomSheetHandleComponent = () => {
  // state
  const [value, setValue] = useState('');

  // hooks
  const { appearance } = useAppearance();

  // styles
  const indicatorStyle = useMemo(
    () => [
      styles.indicator,
      {
        backgroundColor:
          appearance === 'light'
            ? 'rgba(0, 0, 0, 0.25)'
            : 'rgba(255, 255, 255, 0.25)',
      },
    ],
    [appearance]
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

  // render
  return (
    <View style={styles.container}>
      <View style={indicatorStyle} />
      <BottomSheetTextInput
        style={styles.input}
        value={value}
        textContentType="location"
        placeholder="Search for a place or address"
        onChange={handleInputChange}
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
