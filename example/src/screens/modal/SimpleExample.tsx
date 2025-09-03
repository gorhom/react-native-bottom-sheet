import {
  type BottomSheetHandleProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
      <HeaderHandle {...props} children="Modal Example" />
    ),
    []
  );
  return (
    <View style={styles.container}>
      <Button label="Present Modal" onPress={handlePresentPress} />
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
      >
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
});

export default withModalProvider(SimpleExample);
