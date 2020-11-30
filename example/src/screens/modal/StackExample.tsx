import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import Button from '../../components/button';
import ContactListContainer from '../../components/contactListContainer';
import withModalProvider from '../withModalProvider';

const StackExample = () => {
  const {
    present: presentA,
    dismiss: dismissA,
    dismissAll,
  } = useBottomSheetModal();
  const { present: presentB, dismiss: dismissB } = useBottomSheetModal();
  const { present: presentC, dismiss: dismissC } = useBottomSheetModal();

  // callbacks
  const handlePresentAPress = useCallback(() => {
    presentA(<ContactListContainer title="Modal A" type="FlatList" />, {
      snapPoints: ['25%', '50%'],
      animationDuration: 250,
    });
  }, [presentA]);
  const handleDismissAPress = useCallback(() => {
    dismissA();
  }, [dismissA]);
  const handlePresentBPress = useCallback(() => {
    presentB(<ContactListContainer title="Modal B" type="ScrollView" />, {
      snapPoints: ['25%', '50%'],
      animationDuration: 250,
    });
  }, [presentB]);
  const handleDismissBPress = useCallback(() => {
    dismissB();
  }, [dismissB]);
  const handlePresentCPress = useCallback(() => {
    presentC(<ContactListContainer title="Modal C" type="SectionList" />, {
      index: 1,
      snapPoints: ['25%', '50%'],
      animationDuration: 250,
      dismissOnScrollDown: false,
    });
  }, [presentC]);
  const handleDismissCPress = useCallback(() => {
    dismissC();
  }, [dismissC]);
  const handleDismissAllPress = useCallback(() => {
    dismissAll();
  }, [dismissAll]);

  // renders
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
