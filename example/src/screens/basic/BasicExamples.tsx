import React, { useCallback, memo, useRef, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import ContactList from '../../components/contactList';
import Button from '../../components/button';

interface ExampleScreenProps {
  title: string;
  type: 'FlatList' | 'SectionList' | 'ScrollView' | 'View';
  count?: number;
}

const createExampleScreen = ({ type, count = 25 }: ExampleScreenProps) =>
  memo(() => {
    //#region state
    const [
      enableContentPanningGesture,
      setEnableContentPanningGesture,
    ] = useState(true);
    const [
      enableHandlePanningGesture,
      setEnableHandlePanningGesture,
    ] = useState(true);
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
    //#endregion

    //#region callbacks
    const handleSheetChange = useCallback(index => {
      console.log('handleSheetChange', index);
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
    const handleEnableContentPanningGesturePress = useCallback(() => {
      setEnableContentPanningGesture(state => !state);
    }, []);
    const handleEnableHandlePanningGesturePress = useCallback(() => {
      setEnableHandlePanningGesture(state => !state);
    }, []);
    //#endregion

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
        <Button
          label={enableContentPanningGestureButtonText}
          style={styles.buttonContainer}
          onPress={handleEnableContentPanningGesturePress}
        />
        <Button
          label={enableHandlePanningGestureButtonText}
          style={styles.buttonContainer}
          onPress={handleEnableHandlePanningGesturePress}
        />
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          animateOnMount={true}
          enableContentPanningGesture={enableContentPanningGesture}
          enableHandlePanningGesture={enableHandlePanningGesture}
          onChange={handleSheetChange}
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

export const FlatListExampleScreen = createExampleScreen({
  title: 'FlatList Example',
  type: 'FlatList',
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
