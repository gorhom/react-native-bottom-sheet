import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Button from '../../components/button';
import ContactListContainer from '../../components/contactListContainer';

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
  return (
    <View style={styles.container}>
      <Button
        label="Snap To 90%"
        style={styles.button}
        onPress={() => handleSnapPress(2)}
      />
      <Button
        label="Snap To 50%"
        style={styles.button}
        onPress={() => handleSnapPress(1)}
      />
      <Button
        label="Snap To 25%"
        style={styles.button}
        onPress={() => handleSnapPress(0)}
      />
      <Button
        label="Expand"
        style={styles.button}
        onPress={() => handleExpandPress()}
      />
      <Button
        label="Collapse"
        style={styles.button}
        onPress={() => handleCollapsePress()}
      />
      <Button
        label="Close"
        style={styles.button}
        onPress={() => handleClosePress()}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        style={styles.sheetContainer}
        backdropComponent={BottomSheetBackdrop}
        backgroundComponent={null}
      >
        <ContactListContainer type="View" count={4} title="Backdrop Example" />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  sheetContainer: {
    shadowColor: '#000',
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.55,
    shadowRadius: 14.78,

    elevation: 22,
  },
  button: {
    marginBottom: 6,
  },
});

export default BackdropExample;
