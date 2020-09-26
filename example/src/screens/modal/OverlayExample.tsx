import React, { useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useBottomSheetModal, BottomSheetOverlay } from '@gorhom/bottom-sheet';
import Button from '../../components/button';
import ContactListContainer from '../../components/contactListContainer';
import withModalProvider from './withModalProvider';

const OverlayExample = () => {
  const { present } = useBottomSheetModal();

  // callbacks
  const handleChange = useCallback((index: number) => {
    if (index === 0) {
      Alert.alert('Modal Been Dismissed');
    }
  }, []);
  const handlePresentPress = useCallback(() => {
    present(<ContactListContainer title="Modal FlatList" type="FlatList" />, {
      snapPoints: [300, '50%'],
      animationDuration: 250,
      overlayComponent: BottomSheetOverlay,
      overlayOpacity: 0.75,
      dismissOnOverlayPress: true,
      onChange: handleChange,
    });
  }, [present, handleChange]);

  // renders
  return (
    <View style={styles.container}>
      <Button
        label="Present Modal"
        style={styles.buttonContainer}
        onPress={handlePresentPress}
      />
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

export default withModalProvider(OverlayExample);
