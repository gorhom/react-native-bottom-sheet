import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import { useHeaderHeight } from '@react-navigation/elements';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import BlurredBackground from './BlurredBackground';
import BlurredHandle from './BlurredHandle';
import { LocationItem } from './LocationItem';
import { createLocationListMockData } from '../../../utilities/createMockData';
import { Location } from '../../../types';

interface LocationListBottomSheetProps {
  index: SharedValue<number>;
  position: SharedValue<number>;
  onItemPress: (location: Location) => void;
}

export const MIDDLE_SNAP_POINT = 300;

const SNAP_POINTS = [64, MIDDLE_SNAP_POINT, '100%'];
const DATA = createLocationListMockData(15);

export const LocationListBottomSheet = forwardRef<
  BottomSheetModal,
  LocationListBottomSheetProps
>(({ index, position, onItemPress }, ref) => {
  //#region hooks
  const headerHeight = useHeaderHeight();
  const { bottom: bottomSafeArea } = useSafeAreaInsets();
  //#endregion

  //#region styles
  const scrollViewAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: index.value,
    }),
    [index.value]
  );
  const scrollViewStyle = useMemo(
    () => [styles.scrollView, scrollViewAnimatedStyle],
    [scrollViewAnimatedStyle]
  );
  const scrollViewContentContainer = useMemo(
    () => [
      styles.scrollViewContentContainer,
      { paddingBottom: bottomSafeArea },
    ],
    [bottomSafeArea]
  );
  //#endregion

  //#region render
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={true}
        pressBehavior="none"
        appearsOnIndex={2}
        disappearsOnIndex={1}
      />
    ),
    []
  );

  const renderItem = useCallback(
    (item: Location, index: number) => (
      <TouchableOpacity
        key={`${item.name}.${index}`}
        onPress={() => onItemPress(item)}
      >
        <LocationItem title={item.name} subTitle={item.address} />
      </TouchableOpacity>
    ),
    [onItemPress]
  );

  return (
    <BottomSheetModal
      ref={ref}
      key="PoiListSheet"
      name="PoiListSheet"
      index={1}
      snapPoints={SNAP_POINTS}
      topInset={headerHeight}
      enableDismissOnClose={false}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      animatedPosition={position}
      animatedIndex={index}
      backdropComponent={renderBackdrop}
      handleComponent={BlurredHandle}
      backgroundComponent={BlurredBackground}
    >
      <BottomSheetScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="never"
        style={scrollViewStyle}
        contentContainerStyle={scrollViewContentContainer}
      >
        {DATA.map(renderItem)}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 16,
  },
});
