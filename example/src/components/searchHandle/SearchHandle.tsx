import React, { memo, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import {
  BottomSheetTextInput,
  BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';
import { useShowcaseTheme } from '@gorhom/showcase-template';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
export const SEARCH_HANDLE_HEIGHT = 69;

interface SearchHandleProps extends BottomSheetHandleProps {
  initialValue?: string;
  onChange?: (text: string) => void;
}

const SearchHandleComponent = ({
  initialValue = '',
  onChange,
}: SearchHandleProps) => {
  // state
  const [value, setValue] = useState(initialValue);

  // hooks
  const { colors } = useShowcaseTheme();

  // callbacks
  const handleInputChange = useCallback(
    ({
      nativeEvent: { text },
    }: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setValue(text);

      if (onChange) {
        onChange(text);
      }
    },
    [onChange]
  );

  // render
  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
      <BottomSheetTextInput
        style={styles.input}
        value={value}
        textContentType="location"
        placeholderTextColor={colors.secondaryText}
        placeholder="Search for a place or address"
        onChange={handleInputChange}
      />
    </View>
  );
};

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

export const SearchHandle = memo(SearchHandleComponent);
