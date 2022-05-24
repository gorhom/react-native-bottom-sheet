import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import BottomSheet, {
  BottomSheetScrollView,
  SCROLLABLE_STATE,
  useBottomSheetInternal,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../../components/button';
import { ContactItem } from '../../../components/contactItem';
import { createContactListMockData } from '../../../utilities/createMockData';
import { GestureTranslationProvider } from './GestureTranslationContext';
import { useCustomGestureEventsHandlers } from './useCustomGestureEventsHandlers';
import { useCustomScrollEventsHandlers } from './useCustomScrollEventsHandlers';

const count = 60;

const CustomGestureHandling = () => {
  // refs
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '75%', '100%'], []);
  const gestureTranslationY = useSharedValue(0);

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

  return (
    <View style={styles.container}>
      <Button label="Snap To 100%" onPress={() => handleSnapPress(2)} />
      <Button label="Snap To 75%" onPress={() => handleSnapPress(1)} />
      <Button label="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Collapse" onPress={handleCollapsePress} />
      <Button label="Close" onPress={handleClosePress} />
      <GestureTranslationProvider value={gestureTranslationY}>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          gestureEventsHandlersHook={useCustomGestureEventsHandlers}
        >
          <BottomSheetContent />
        </BottomSheet>
      </GestureTranslationProvider>
    </View>
  );
};

const BottomSheetContent = () => {
  const { bottom: bottomSafeArea } = useSafeAreaInsets();
  const data = useMemo(() => createContactListMockData(count), []);

  const listContentContainerStyle = useMemo(
    () => [styles.listContentContainer, { paddingBottom: bottomSafeArea }],
    [bottomSafeArea]
  );

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

  const { animatedScrollableState } = useBottomSheetInternal();

  const scrollableAnimatedProps = useAnimatedProps(() => ({
    showsVerticalScrollIndicator:
      animatedScrollableState.value === SCROLLABLE_STATE.UNLOCKED,
  }));

  return (
    <BottomSheetScrollView
      style={styles.listContainer}
      bounces={true}
      contentContainerStyle={listContentContainerStyle}
      scrollEventsHandlersHook={useCustomScrollEventsHandlers}
      animatedProps={scrollableAnimatedProps}
    >
      {data.map(renderScrollViewItem)}
    </BottomSheetScrollView>
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

export default CustomGestureHandling;
