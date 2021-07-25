import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Button from '../../../components/button';
import ContactItem from '../../../components/contactItem';
import { createContactListMockData } from '../../../utilities';
import { GestureTranslationProvider } from './GestureTranslationContext';
import { useCustomGestureEventsHandlers } from './useCustomGestureEventsHandlers';
import { useCustomScrollEventsHandlers } from './useCustomScrollEventsHandlers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const count = 60;

const CustomScrollAndDrag = () => {
  // refs
  const bottomSheetRef = useRef<BottomSheet>(null);

  // hooks
  const { height } = useWindowDimensions();
  const { bottom: bottomSafeArea } = useSafeAreaInsets();

  // variables
  const snapPoints = useMemo(() => [150, height * 0.7, '100%'], [height]);
  const data = useMemo(() => createContactListMockData(count), []);
  const gestureTranslationY = useSharedValue(0);

  // styles
  const listContentContainerStyle = useMemo(
    () => [styles.listContentContainer, { paddingBottom: bottomSafeArea }],
    [bottomSafeArea]
  );

  //#region callbacks
  const handleSnapPress = useCallback(index => {
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
  //#endregion

  // renders
  const renderScrollViewItem = useCallback(
    (item, index) => (
      <ContactItem
        key={`${item.name}.${index}`}
        title={`${index}: ${item.name}`}
        subTitle={item.jobTitle}
      />
    ),
    []
  );

  return (
    <View style={styles.container}>
      <Button label="Snap To top point" onPress={() => handleSnapPress(2)} />
      <Button label="Snap To mid-point" onPress={() => handleSnapPress(1)} />
      <Button label="Snap To 150" onPress={() => handleSnapPress(0)} />
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Collapse" onPress={handleCollapsePress} />
      <Button label="Close" onPress={handleClosePress} />
      <GestureTranslationProvider value={gestureTranslationY}>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          gestureEventsHandlersHook={useCustomGestureEventsHandlers}
        >
          <BottomSheetScrollView
            style={styles.listContainer}
            bounces={true}
            contentContainerStyle={listContentContainerStyle}
            scrollEventsHandlersHook={useCustomScrollEventsHandlers}
          >
            {data.map(renderScrollViewItem)}
          </BottomSheetScrollView>
        </BottomSheet>
      </GestureTranslationProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  listContainer: {},
  listContentContainer: {
    overflow: 'visible',
    paddingHorizontal: 16,
  },
});

export default CustomScrollAndDrag;
