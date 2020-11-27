import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Handle from '../../components/handle';
import Button from '../../components/button';
import ContactList from '../../components/contactList';

const CustomHandleExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => [150, 300, 450], []);

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
        <Text style={styles.title}>Custom Handle Example</Text>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <Button
        label="Snap To 450"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(2)}
      />
      <Button
        label="Snap To 300"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(1)}
      />
      <Button
        label="Snap To 150"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(0)}
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
      <Button
        label="Close"
        style={styles.buttonContainer}
        onPress={handleClosePress}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        initialSnapIndex={1}
        handleComponent={Handle}
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
  shadowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
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

export default CustomHandleExample;
