import React, { memo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native-gesture-handler';
import isEqual from 'lodash.isequal';
import { useState } from 'react';
import { useCallback } from 'react';

const { width: windowWidth } = Dimensions.get('window');

const BottomSheetHandleComponent = () => {
  // state
  const [value, setValue] = useState('');

  // hooks
  const { snapTo } = useBottomSheet();

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
      <View style={styles.indicator} />
      <TextInput
        style={styles.input}
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
    </View>
  );
};

const BottomSheetHandle = memo(BottomSheetHandleComponent, isEqual);

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 5,
  },
  input: {
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 8,
    padding: 6,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
  indicator: {
    alignSelf: 'center',
    width: (7.5 * windowWidth) / 100,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default BottomSheetHandle;
