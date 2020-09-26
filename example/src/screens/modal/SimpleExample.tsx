import React, { useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import Button from '../../components/button';
import ContactListContainer from '../../components/contactListContainer';
import withModalProvider from './withModalProvider';

const SimpleExample = () => {
  const { present, dismiss, expand, collapse } = useBottomSheetModal();

  // callbacks
  const handleDismissPress = useCallback(() => {
    dismiss();
  }, [dismiss]);
  const handleExpandPress = useCallback(() => {
    expand();
  }, [expand]);
  const handleCollapsePress = useCallback(() => {
    collapse();
  }, [collapse]);
  const handleChange = useCallback((index: number) => {
    if (index === 0) {
      Alert.alert('Modal Been Dismissed');
    }
  }, []);
  const handlePresentPress = useCallback(() => {
    present(<ContactListContainer title="Modal FlatList" type="FlatList" />, {
      snapPoints: [300, '50%'],
      animationDuration: 250,
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
      <Button
        label="Dismiss Modal"
        style={styles.buttonContainer}
        onPress={handleDismissPress}
      />
      <Button
        label="Expand"
        style={styles.buttonContainer}
        onPress={handleExpandPress}
      />
      <Button
        label="Collapse"
        style={styles.buttonContainer}
        onPress={handleCollapsePress}
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

export default withModalProvider(SimpleExample);
