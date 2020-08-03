import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import BottomSheet from '@gorhom/bottom-sheet';
import Handle from '../components/Handle';
import Button from '../components/button';

const BasicExample = () => {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);
  const headerHeight = useHeaderHeight();

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // styles

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const handleSnapPress = useCallback(index => {
    sheetRef.current?.snapTo(index);
  }, []);

  // renders
  const renderHandle = useCallback(() => <Handle />, []);

  return (
    <View style={styles.container}>
      <Button
        label="Extend"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(0)}
      />
      <Button
        label="Open"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(1)}
      />
      <Button
        label="Close"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(2)}
      />
      <BottomSheet
        snapPoints={snapPoints}
        initialSnapIndex={1}
        topInset={headerHeight}
        onChange={handleSheetChanges}
      >
        {/* <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: (25 * sheetHeight) / 100,
            backgroundColor: 'rgba(0,0,0,0.25)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: (50 * sheetHeight) / 100,
            backgroundColor: 'rgba(0,0,0,0.50)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: windowWidth / 2 - 25,
            width: 50,
            height: 10,
            backgroundColor: 'red',
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: windowWidth / 2 - 25,
            bottom: 0,
            width: 50,
            height: 10,
            backgroundColor: 'red',
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: sheetHeight / 2 - 25,
            width: 10,
            height: 50,
            backgroundColor: 'red',
          }}
        />

        <View
          style={{
            position: 'absolute',
            bottom: sheetHeight / 2 - 25,
            right: 0,
            width: 10,
            height: 50,
            backgroundColor: 'red',
          }}
        /> */}

        {/* <Button
          label="Open"
          style={styles.buttonContainer}
          onPress={() => handleSnapPress(1)}
        /> */}
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
  buttonContainer: {
    marginBottom: 6,
  },
});

export default BasicExample;
