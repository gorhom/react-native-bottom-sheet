import {
  type BottomSheetHandleProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/button';
import { ContactList } from '../../components/contactList';
import { HeaderHandle } from '../../components/headerHandle';
import { withModalProvider } from './withModalProvider';

export const SimpleExample = () => {
  //#region state
  const [enablePanDownToClose, setEnablePanDownToClose] = useState(true);
  const [enableDismissOnClose, setEnableDismissOnClose] = useState(true);
  //#endregion

  // refs
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openerRef = useRef<View>(null);
  const titleRef = useRef<View>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  //#region callbacks
  const handleChange = useCallback((index: number) => {
    console.log('handleChange', index);
  }, []);
  const handleAnimate = useCallback((fromIndex: number, toIndex: number) => {
    console.log('handleAnimate', fromIndex, '>', toIndex);
  }, []);
  const handleDismiss = useCallback(() => {
    console.log('on dismiss');
  }, []);
  const handleDismissPress = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);
  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleCollapsePress = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);
  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleEnablePanDownToClosePress = useCallback(() => {
    setEnablePanDownToClose(state => !state);
  }, []);
  const handleEnableDismissOnClosePress = useCallback(() => {
    setEnableDismissOnClose(state => !state);
  }, []);
  //#endregion

  // renders
  const renderHeaderHandle = useCallback(
    (props: BottomSheetHandleProps) => (
      <HeaderHandle {...props} titleRef={titleRef} children="Modal Example" />
    ),
    []
  );
  return (
    <View style={styles.container}>
      <Pressable
        ref={openerRef}
        accessibilityRole="button"
        onPress={handlePresentPress}
        style={styles.action}
      >
        <Text>Present Modal</Text>
      </Pressable>
      <Button label="Dismiss Modal" onPress={handleDismissPress} />
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Collapse" onPress={handleCollapsePress} />
      <Button label="Close" onPress={handleClosePress} />
      <Button
        label={`${
          enablePanDownToClose ? 'Disable' : 'Enable'
        } Pan Down To Close`}
        onPress={handleEnablePanDownToClosePress}
      />
      <Button
        label={`${
          enableDismissOnClose ? 'Disable' : 'Enable'
        } Dismiss On Close`}
        onPress={handleEnableDismissOnClosePress}
      />
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        enableDismissOnClose={enableDismissOnClose}
        enableDynamicSizing={false}
        onDismiss={handleDismiss}
        onChange={handleChange}
        onAnimate={handleAnimate}
        handleComponent={renderHeaderHandle}
        initialAccessibilityFocusRef={titleRef}
        restoreAccessibilityFocusRef={openerRef}
      >
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={handleExpandPress}
            style={styles.action}
          >
            <Text>Expand</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={handleCollapsePress}
            style={styles.action}
          >
            <Text>Collapse</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close modal"
            onPress={handleDismissPress}
            style={styles.action}
          >
            <Text>Close</Text>
          </Pressable>
        </View>
        <ContactList count={5} type="ScrollView" />
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  action: {
    minHeight: 48,
    minWidth: 48,
    justifyContent: 'center',
    padding: 12,
  },
});

export default withModalProvider(SimpleExample);
