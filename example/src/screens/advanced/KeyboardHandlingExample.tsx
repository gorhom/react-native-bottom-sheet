import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../components/button';
import { ContactList } from '../../components/contactList';
import {
  SEARCH_HANDLE_HEIGHT,
  SearchHandle,
} from '../../components/searchHandle';

const KeyboardHandlingExample = () => {
  // state
  const [keyboardBehavior, setKeyboardBehavior] = useState<
    'extend' | 'fillParent' | 'interactive'
  >('interactive');
  const [keyboardBlurBehavior, setKeyboardBlurBehavior] = useState<
    'none' | 'restore'
  >('none');
  const [blurKeyboardOnGesture, setBlurKeyboardOnGesture] = useState(false);

  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => [SEARCH_HANDLE_HEIGHT + 34, 450], []);

  // callbacks
  const handleToggleKeyboardBehavior = useCallback(() => {
    setKeyboardBehavior(state => {
      switch (state) {
        case 'interactive':
          return 'extend';
        case 'extend':
          return 'fillParent';
        case 'fillParent':
          return 'interactive';
      }
    });
  }, []);
  const handleToggleKeyboardBlurBehavior = useCallback(() => {
    setKeyboardBlurBehavior(state => {
      switch (state) {
        case 'none':
          return 'restore';
        case 'restore':
          return 'none';
      }
    });
  }, []);
  const handleToggleBlurKeyboardOnGesture = useCallback(() => {
    setBlurKeyboardOnGesture(state => !state);
  }, []);
  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleCollapsePress = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // renders
  return (
    <View style={styles.container}>
      <Button
        label={`Toggle Keyboard Behavior: ${keyboardBehavior}`}
        onPress={handleToggleKeyboardBehavior}
      />
      <Button
        label={`Toggle Keyboard Blur Behavior: ${keyboardBlurBehavior}`}
        onPress={handleToggleKeyboardBlurBehavior}
      />
      <Button
        label={`Toggle Blur Keyboard On Gesture: ${blurKeyboardOnGesture}`}
        onPress={handleToggleBlurKeyboardOnGesture}
      />
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Collapse" onPress={handleCollapsePress} />
      <Button label="Close" onPress={handleClosePress} />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior={keyboardBlurBehavior}
        enableBlurKeyboardOnGesture={blurKeyboardOnGesture}
        handleComponent={SearchHandle}
      >
        <ContactList count={12} type="FlatList" />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});

export default KeyboardHandlingExample;
