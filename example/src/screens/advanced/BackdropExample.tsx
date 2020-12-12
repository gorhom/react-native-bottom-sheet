import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Button from '../../components/button';
import ContactList from '../../components/contactList';

const BackdropExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // callbacks
  const handleSnapPress = useCallback(index => {
    bottomSheetRef.current?.snapTo(index);
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
  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Backdrop Example</Text>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <Button
        label="Snap To 90%"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(2)}
      />
      <Button
        label="Snap To 50%"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(1)}
      />
      <Button
        label="Snap To 25%"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(0)}
      />
      <Button
        label="Expand"
        style={styles.buttonContainer}
        onPress={() => handleExpandPress()}
      />
      <Button
        label="Collapse"
        style={styles.buttonContainer}
        onPress={() => handleCollapsePress()}
      />
      <Button
        label="Close"
        style={styles.buttonContainer}
        onPress={() => handleClosePress()}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={BottomSheetBackdrop}
      >
        <ContactList type="View" count={3} header={renderHeader} />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  contentContainerStyle: {
    paddingTop: 12,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  shadowBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  title: {
    fontSize: 46,
    lineHeight: 46,
    fontWeight: '800',
  },
  headerContainer: {
    paddingVertical: 24,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginBottom: 6,
  },
});

export default BackdropExample;
