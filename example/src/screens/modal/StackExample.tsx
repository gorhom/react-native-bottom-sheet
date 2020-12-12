import React, { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import Button from '../../components/button';
import ContactListContainer from '../../components/contactListContainer';
import withModalProvider from '../withModalProvider';

const StackExample = () => {
  const { dismiss, dismissAll } = useBottomSheetModal();
  const bottomSheetModalARef = useRef<BottomSheetModal>(null);
  const bottomSheetModalBRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalCRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentAPress = useCallback(() => {
    if (bottomSheetModalARef.current) {
      bottomSheetModalARef.current.present();
    }
  }, []);
  const handleDismissAPress = useCallback(() => {
    if (bottomSheetModalARef.current) {
      bottomSheetModalARef.current.dismiss();
    }
  }, []);
  const handlePresentBPress = useCallback(() => {
    if (bottomSheetModalBRef.current) {
      bottomSheetModalBRef.current.present();
    }
  }, []);
  const handleDismissBPress = useCallback(() => {
    if (bottomSheetModalBRef.current) {
      bottomSheetModalBRef.current.dismiss();
    }
  }, []);
  const handlePresentCPress = useCallback(() => {
    if (bottomSheetModalCRef.current) {
      bottomSheetModalCRef.current.present();
    }
  }, []);
  const handleDismissCPress = useCallback(() => {
    if (bottomSheetModalCRef.current) {
      bottomSheetModalCRef.current.dismiss();
    }
  }, []);
  const handleDismissAllPress = useCallback(() => {
    dismissAll();
  }, [dismissAll]);
  const handleDismissByHookPress = useCallback(() => {
    dismiss('A');
  }, [dismiss]);

  // renders

  const renderBottomSheetContent = useCallback(
    title => <ContactListContainer title={title} type="FlatList" />,
    []
  );
  return (
    <View style={styles.container}>
      <Button
        label="Present Modal A"
        style={styles.buttonContainer}
        onPress={handlePresentAPress}
      />
      <Button
        label="Dismiss Modal A"
        style={styles.buttonContainer}
        onPress={handleDismissAPress}
      />
      <Button
        label="Present Modal B"
        style={styles.buttonContainer}
        onPress={handlePresentBPress}
      />
      <Button
        label="Dismiss Modal B"
        style={styles.buttonContainer}
        onPress={handleDismissBPress}
      />
      <Button
        label="Present Modal C"
        style={styles.buttonContainer}
        onPress={handlePresentCPress}
      />
      <Button
        label="Dismiss Modal C"
        style={styles.buttonContainer}
        onPress={handleDismissCPress}
      />

      <Button
        label="Dismiss All Modal"
        style={styles.buttonContainer}
        onPress={handleDismissAllPress}
      />

      <Button
        label="Dismiss A By Hook"
        style={styles.buttonContainer}
        onPress={handleDismissByHookPress}
      />

      <BottomSheetModal
        name="A"
        ref={bottomSheetModalARef}
        snapPoints={['25%', '50%']}
        children={renderBottomSheetContent('Modal A')}
      />

      <BottomSheetModal
        name="B"
        ref={bottomSheetModalBRef}
        snapPoints={['25%', '50%']}
        children={renderBottomSheetContent('Modal B')}
      />

      <BottomSheetModal
        name="C"
        ref={bottomSheetModalCRef}
        index={1}
        snapPoints={['25%', '50%']}
        dismissOnPanDown={false}
        children={renderBottomSheetContent('Modal C')}
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

export default withModalProvider(StackExample);
