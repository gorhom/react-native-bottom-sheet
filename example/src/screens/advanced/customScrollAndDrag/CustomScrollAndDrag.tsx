import { StyleSheet, useWindowDimensions, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Button from '../../../components/button';
import React, { useCallback, useMemo, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { createContactListMockData } from '../../../utilities';
import ContactItem from '../../../components/contactItem';
import BottomSheetCustomScrollView from './BottomSheetCustomScrollView';
import { useCustomPanGestureHandlerListeners } from './useCustomPanGestureHandlerListeners';
import { GestureTranslationProvider } from './GestureTranslationContext';
import { useSharedValue } from 'react-native-reanimated';

const count = 60;

const CustomScrollAndDrag = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);
  const gestureTranslationY = useSharedValue(0);

  const { height } = useWindowDimensions();
  // variables
  const snapPoints = useMemo(() => [150, height * 0.7, '100%'], [height]);
  const data = useMemo(() => createContactListMockData(count), []);

  // callbacks
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
          panGestureHandlerListenersHook={useCustomPanGestureHandlerListeners}
        >
          <BottomSheetCustomScrollView
            style={styles.container}
            bounces={true}
            focusHook={useFocusEffect}
            contentContainerStyle={styles.contentContainer}
          >
            {data.map(renderScrollViewItem)}
          </BottomSheetCustomScrollView>
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
  contentContainer: {
    paddingHorizontal: 16,
    overflow: 'visible',
    paddingBottom: 40,
  },
});

export default CustomScrollAndDrag;
