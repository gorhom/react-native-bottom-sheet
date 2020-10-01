import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import BottomSheet from '@gorhom/bottom-sheet';
import Button from '../components/button';
import ContactList from '../components/contactList';

const ShadowOverlayExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);
  const headerHeight = useHeaderHeight();

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
  const animatedPositionIndex = useSharedValue<number>(0);

  // styles

  const shadowOverlayAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        animatedPositionIndex.value,
        [0, 2],
        [0, 1],
        Extrapolate.CLAMP
      ),
    }),
    []
  );

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
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
        <Text style={styles.title}>Shadow Overlay Example</Text>
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
      <Animated.View
        pointerEvents="none"
        style={[styles.shadowOverlay, shadowOverlayAnimatedStyle]}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        initialSnapIndex={1}
        topInset={headerHeight}
        animatedPositionIndex={animatedPositionIndex}
        onChange={handleSheetChanges}
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

export default ShadowOverlayExample;
