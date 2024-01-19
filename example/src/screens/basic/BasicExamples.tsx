import React, { useCallback, memo, useRef, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, { useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import { ContactList } from '../../components/contactList';
import { Button } from '../../components/button';

interface ExampleScreenProps {
  title: string;
  type: 'FlatList' | 'SectionList' | 'ScrollView' | 'View' | 'VirtualizedList';
  count?: number;
}

const createExampleScreen = ({ type, count = 25 }: ExampleScreenProps) =>
  memo(() => {
    //#region state
    const [enableContentPanningGesture, setEnableContentPanningGesture] =
      useState(true);
    const [enableHandlePanningGesture, setEnableHandlePanningGesture] =
      useState(true);
    //#endregion

    //#region refs
    const bottomSheetRef = useRef<BottomSheet>(null);
    //#endregion

    //#region variables
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
    const enableContentPanningGestureButtonText = useMemo(
      () =>
        enableContentPanningGesture
          ? 'Disable Content Panning Gesture'
          : 'Enable Content Panning Gesture',
      [enableContentPanningGesture]
    );
    const enableHandlePanningGestureButtonText = useMemo(
      () =>
        enableHandlePanningGesture
          ? 'Disable Handle Panning Gesture'
          : 'Enable Handle Panning Gesture',
      [enableHandlePanningGesture]
    );
    const animationConfigs = useBottomSheetSpringConfigs({
      damping: 80,
      overshootClamping: true,
      restDisplacementThreshold: 0.1,
      restSpeedThreshold: 0.1,
      stiffness: 500,
    });
    //#endregion

    //#region callbacks
    const handleSheetChange = useCallback((index: number) => {
      // eslint-disable-next-line no-console
      console.log('handleSheetChange', index);
    }, []);
    const handleSheetAnimate = useCallback(
      (fromIndex: number, toIndex: number) => {
        // eslint-disable-next-line no-console
        console.log('handleSheetAnimate', `from ${fromIndex} to ${toIndex}`);
      },
      []
    );
    const handleSnapPress = useCallback((index: number) => {
      bottomSheetRef.current?.snapToIndex(index);
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
    const handleEnableContentPanningGesturePress = useCallback(() => {
      setEnableContentPanningGesture(state => !state);
    }, []);
    const handleEnableHandlePanningGesturePress = useCallback(() => {
      setEnableHandlePanningGesture(state => !state);
    }, []);
    //#endregion

    return (
      <View style={styles.container}>
        <Button label="Snap To 90%" onPress={() => handleSnapPress(2)} />
        <Button label="Snap To 50%" onPress={() => handleSnapPress(1)} />
        <Button label="Snap To 25%" onPress={() => handleSnapPress(0)} />
        <Button label="Expand" onPress={handleExpandPress} />
        <Button label="Collapse" onPress={handleCollapsePress} />
        <Button label="Close" onPress={handleClosePress} />
        <Button
          label={enableContentPanningGestureButtonText}
          onPress={handleEnableContentPanningGesturePress}
        />
        <Button
          label={enableHandlePanningGestureButtonText}
          onPress={handleEnableHandlePanningGesturePress}
        />
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          animationConfigs={animationConfigs}
          animateOnMount={true}
          enableContentPanningGesture={enableContentPanningGesture}
          enableHandlePanningGesture={enableHandlePanningGesture}
          enableDynamicSizing={false}
          onChange={handleSheetChange}
          onAnimate={handleSheetAnimate}
        >
          <ContactList key={`${type}.list`} type={type} count={count} />
        </BottomSheet>
      </View>
    );
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});

export const FlatListExampleScreen = createExampleScreen({
  title: 'FlatList Example',
  type: 'FlatList',
});

export const VirtualizedListExampleScreen = createExampleScreen({
  title: 'VirtualizedList Example',
  type: 'VirtualizedList',
});

export const ScrollViewExampleScreen = createExampleScreen({
  title: 'Title',
  type: 'ScrollView',
});

export const SectionListExampleScreen = createExampleScreen({
  title: 'Title',
  type: 'SectionList',
});

export const ViewExampleScreen = createExampleScreen({
  title: 'Title',
  type: 'View',
  count: 8,
});
