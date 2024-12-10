import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetHandle,
  BottomSheetHandleProps,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

export const SimpleExample = () => {
  const [backdropPressBehavior, setBackdropPressBehavior] = useState<
    'none' | 'close' | 'collapse'
  >('collapse');
  const [enablePanDownToClose, setEnablePanDownToClose] = useState(true);
  const [enableDismissOnClose, setEnableDismissOnClose] = useState(true);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleTogglePressBehavior = useCallback(() => {
    setBackdropPressBehavior(state => {
      switch (state) {
        case 'none':
          return 'close';
        case 'close':
          return 'collapse';
        case 'collapse':
          return 'none';
      }
    });
  }, []);

  const handleChange = useCallback((index: number) => {
    // eslint-disable-next-line no-console
    console.log('index', index);
  }, []);

  const handleDismiss = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('on dismiss');
  }, []);

  const handleDismissPress = useCallback(() => {
    bottomSheetRef.current!.dismiss();
  }, []);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current!.close();
  }, []);

  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current!.expand();
  }, []);

  const handleCollapsePress = useCallback(() => {
    bottomSheetRef.current!.collapse();
  }, []);

  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current!.present();
  }, []);

  const handleEnablePanDownToClosePress = useCallback(() => {
    setEnablePanDownToClose(state => !state);
  }, []);

  const handleEnableDismissOnClosePress = useCallback(() => {
    setEnableDismissOnClose(state => !state);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} pressBehavior={backdropPressBehavior} />
    ),
    [backdropPressBehavior]
  );

  const renderHeaderHandle = useCallback(
    (props: BottomSheetHandleProps) => (
      <BottomSheetHandle
        style={styles.headerContainer}
        indicatorStyle={styles.headerIndicator}
        {...props}
      >
        <Text style={styles.headerTitle}>Modal Example</Text>
      </BottomSheetHandle>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <Button title="Present Modal" onPress={handlePresentPress} />
      <Button title="Dismiss Modal" onPress={handleDismissPress} />
      <Button title="Expand" onPress={handleExpandPress} />
      <Button title="Collapse" onPress={handleCollapsePress} />
      <Button title="Close" onPress={handleClosePress} />
      <Button
        title={`${
          enablePanDownToClose ? 'Disable' : 'Enable'
        } Pan Down To Close`}
        onPress={handleEnablePanDownToClosePress}
      />
      <Button
        title={`${
          enableDismissOnClose ? 'Disable' : 'Enable'
        } Dismiss On Close`}
        onPress={handleEnableDismissOnClosePress}
      />
      <Button
        title={`Toggle Press Behavior: ${backdropPressBehavior}`}
        onPress={handleTogglePressBehavior}
      />
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        enableDismissOnClose={enableDismissOnClose}
        onDismiss={handleDismiss}
        onChange={handleChange}
        backdropComponent={renderBackdrop}
        handleComponent={renderHeaderHandle}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.itemContainer}>
            <View style={styles.itemThumbnail} />
            <View style={styles.itemContentContainer}>
              <Text style={styles.itemTitle}>Jane Doe</Text>
              <Text style={styles.itemSubtitle}>UX Designer</Text>
            </View>
            <View style={styles.itemIcon} />
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.itemThumbnail} />
            <View style={styles.itemContentContainer}>
              <Text style={styles.itemTitle}>Jane Doe</Text>
              <Text style={styles.itemSubtitle}>UX Designer</Text>
            </View>
            <View style={styles.itemIcon} />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    padding: 24,
  },
  headerContainer: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.075)',
    zIndex: 99999,
  },
  headerTitle: {
    marginTop: 16,
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  headerIndicator: {
    height: 4,
    opacity: 0.5,
  },
  contentContainer: {
    paddingHorizontal: 16,
    overflow: 'visible',
  },
  itemContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    marginVertical: 12,
  },
  itemContentContainer: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: 12,
  },
  itemThumbnail: {
    width: 46,
    height: 46,
    borderRadius: 46,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  itemIcon: {
    alignSelf: 'center',
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.125)',
  },
  itemTitle: {
    color: '#111',
    fontSize: 16,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  itemSubtitle: {
    color: '#666',
    fontSize: 14,
    textTransform: 'capitalize',
  },
});

export default SimpleExample;
