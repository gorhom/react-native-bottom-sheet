import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import Button from '../../components/button';
import ContactListContainer from '../../components/contactListContainer';
import withModalProvider from '../withModalProvider';

const BackdropExample = () => {
  // refs
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handleDismiss = useCallback(() => {
    Alert.alert('Modal Been Dismissed');
  }, []);
  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  // renders
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={2} />
    ),
    []
  );
  return (
    <View style={styles.container}>
      <Button
        label="Present Modal"
        style={styles.buttonContainer}
        onPress={handlePresentPress}
      />
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onDismiss={handleDismiss}
        backdropComponent={renderBackdrop}
      >
        <ContactListContainer title="Modal FlatList" type="FlatList" />
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  buttonContainer: {
    marginBottom: 6,
  },
});

export default withModalProvider(BackdropExample);
