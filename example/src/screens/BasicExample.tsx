import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import BottomSheet from '@gorhom/bottom-sheet';
import Button from '../components/button';
import ContactList from '../components/contactList';

const BasicExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);
  const headerHeight = useHeaderHeight();

  // variables
  const snapPoints = useMemo(() => [150, 300, 450], []);

  // styles
  // callbacks
  const handleSnapPress = useCallback(index => {
    bottomSheetRef.current?.snapTo(index);
  }, []);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // renders
  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Basic Screen</Text>
      </View>
    );
  }, []);

  const renderSheetContent = useCallback(
    () => <ContactList type="FlatList" count={50} header={renderHeader} />,
    [renderHeader]
  );

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
        label="Close"
        style={styles.buttonContainer}
        onPress={() => handleClosePress()}
      />
      {/* <ReText text={concat('Position from bottom: ', position)} /> */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        initialSnapIndex={0}
        // handleComponent={Handle}
        topInset={headerHeight}
        children={renderSheetContent}
      />
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
        /> 
      </BottomSheet>*/}
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

export default BasicExample;
