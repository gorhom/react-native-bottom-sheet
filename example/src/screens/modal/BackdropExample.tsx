import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Button } from '../../components/button';
import { ContactList } from '../../components/contactList';
import { HeaderHandle } from '../../components/headerHandle';
import { withModalProvider } from './withModalProvider';

export const BackdropExample = () => {
  // state
  const [backdropPressBehavior, setBackdropPressBehavior] = useState<
    'none' | 'close' | 'collapse'
  >('collapse');
  // refs
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  //#region callbacks
  const handleDismiss = useCallback(() => {
    Alert.alert('Modal Been Dismissed');
  }, []);
  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleTogglePressBehavior = useCallback(() => {
    setBackdropPressBehavior(state => {
      switch (state) {
        case 'none':
          return 'close';
        case 'close':
          return 'collapse';
        case 'collapse':
          return 'none';
      }
    });
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
  //#endregion

  // renders
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} pressBehavior={backdropPressBehavior} />
    ),
    [backdropPressBehavior]
  );

  const renderHeaderHandle = useCallback(
    props => <HeaderHandle {...props} children="Modal With Backdrop Example" />,
    []
  );
  return (
    <View style={styles.container}>
      <Button label="Present Modal" onPress={handlePresentPress} />
      <Button
        label={`Toggle Press Behavior: ${backdropPressBehavior}`}
        onPress={handleTogglePressBehavior}
      />
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Collapse" onPress={handleCollapsePress} />
      <Button label="Close" onPress={handleClosePress} />
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onDismiss={handleDismiss}
        handleComponent={renderHeaderHandle}
        backdropComponent={renderBackdrop}
      >
        <ContactList type="View" count={5} />
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

export default withModalProvider(BackdropExample);
