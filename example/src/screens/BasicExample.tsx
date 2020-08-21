import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import Animated, {
  useValue,
  interpolate,
  concat,
  Extrapolate,
} from 'react-native-reanimated';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Handle from '../components/handle';
import Button from '../components/button';
import { ReText } from 'react-native-redash';

const BasicExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);
  const headerHeight = useHeaderHeight();

  // variables
  const snapPoints = useMemo(() => [150, 300, 450], []);
  const position = useValue<number>(0);

  // styles
  const shadowOverlayStyle = useMemo(
    () => ({
      ...styles.shadowOverlay,
      opacity: interpolate(position, {
        inputRange: [300, 450],
        outputRange: [0, 1],
        extrapolate: Extrapolate.CLAMP,
      }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const handleSnapPress = useCallback(index => {
    bottomSheetRef.current?.snapTo(index);
  }, []);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // renders
  // const renderHeader = useCallback(() => {
  //   return (
  //     <View style={styles.headerContainer}>
  //       <Text style={styles.title}>Basic Screen</Text>
  //     </View>
  //   );
  // }, []);

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
      <ReText text={concat('Position from bottom: ', position)} />
      <Animated.View pointerEvents="none" style={shadowOverlayStyle} />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        initialSnapIndex={1}
        handleComponent={Handle}
        topInset={headerHeight}
        animatedPosition={position}
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
        {/* <ContactList type="ScrollView" header={renderHeader} /> */}
        <View style={{ height: 100, backgroundColor: 'blue' }} />
        <BottomSheetFlatList
          contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}
          data={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
          renderItem={() => (
            <View
              style={{ backgroundColor: 'red', height: 100, marginBottom: 20 }}
            />
          )}
        />
        <View style={{ height: 100, backgroundColor: 'green' }} />
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

export default BasicExample;
