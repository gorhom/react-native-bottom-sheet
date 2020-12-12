import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Button from '../../components/button';
import ContactListContainer from '../../components/contactListContainer';
import withModalProvider from '../withModalProvider';

const BackdropExample = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handleDismiss = useCallback(() => {
    Alert.alert('Modal Been Dismissed');
  }, []);
  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  // renders
  return (
    <View style={styles.container}>
      <Button
        label="Present Modal"
        style={styles.buttonContainer}
        onPress={handlePresentPress}
      />
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['25%', '50%']}
        animationDuration={250}
        onDismiss={handleDismiss}
        backdropComponent={BottomSheetBackdrop}
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
