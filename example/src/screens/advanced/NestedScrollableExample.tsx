import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  FlatListProps,
  ListRenderItem,
} from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/button';
import withModalProvider from '../withModalProvider';

type Item = { id: string; text: string; color: string };

const data: Item[] = [
  { id: '1', text: 'Screen 1', color: 'green' },
  { id: '2', text: 'Screen 2', color: 'orange' },
  { id: '3', text: 'Screen 3', color: 'red' },
  { id: '4', text: 'Screen 4', color: 'green' },
  { id: '5', text: 'Screen 5', color: 'orange' },
  { id: '6', text: 'Screen 6', color: 'red' },
  { id: '7', text: 'Screen 7', color: 'green' },
  { id: '8', text: 'Screen 8', color: 'orange' },
  { id: '9', text: 'Screen 9', color: 'red' },
  { id: '10', text: 'Screen 10', color: 'green' },
  { id: '11', text: 'Screen 11', color: 'orange' },
  { id: '12', text: 'Screen 12', color: 'red' },
];

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<Item>>(
  FlatList
);

const NestedScrollableExample = () => {
  // state
  const [contentHeight, setContentHeight] = useState(0);

  // hooks
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const flatlistRef = useAnimatedRef();
  const { bottom: safeBottomArea } = useSafeAreaInsets();

  // variables
  const snapPoints = useMemo(() => [contentHeight], [contentHeight]);

  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleDismissPress = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      setContentHeight(height);
    },
    []
  );

  // styles
  const contentContainerStyle = useMemo(
    () => ({
      ...styles.contentContainerStyle,
      paddingBottom: safeBottomArea,
    }),
    [safeBottomArea]
  );

  const getItemStyles = useCallback((item: Item) => {
    return [
      styles.itemStyle,
      {
        backgroundColor: item.color,
      },
    ];
  }, []);

  // renders
  const renderBackground = useCallback(
    () => <View style={styles.background} />,
    []
  );

  const renderItem: ListRenderItem<Item> = useCallback(
    item => {
      const itemStyles = getItemStyles(item.item);
      return (
        <View style={itemStyles}>
          <Text>{item.item.text}</Text>
        </View>
      );
    },
    [getItemStyles]
  );

  const keyExtractor = useCallback((item: Item) => item.id, []);

  return (
    <View style={styles.container}>
      <Button
        label="Present"
        style={styles.buttonContainer}
        onPress={handlePresentPress}
      />
      <Button
        label="Dismiss"
        style={styles.buttonContainer}
        onPress={handleDismissPress}
      />
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundComponent={renderBackground}
        waitFor={flatlistRef}
        // activeOffsetY={[-20, 20]}
      >
        <BottomSheetView
          style={contentContainerStyle}
          onLayout={handleOnLayout}
        >
          <AnimatedFlatList
            // @ts-ignore
            ref={flatlistRef}
            horizontal={true}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginBottom: 6,
  },
  contentContainerStyle: {
    paddingTop: 12,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  itemStyle: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withModalProvider(NestedScrollableExample);
