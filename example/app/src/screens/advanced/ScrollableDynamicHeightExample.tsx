import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  useMaxHeightScrollableBottomSheet,
} from '@gorhom/bottom-sheet';
import { Button } from '../../components/button';
type CSSHeight = `${number}%` | number;

const DynamicSnapPointExample = () => {
  // state
  const [count, setCount] = useState(3);
  const [maxHeight, setMaxHeight] = useState<CSSHeight>();
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
    innerScrollViewAnimatedStyles,
  } = useMaxHeightScrollableBottomSheet(maxHeight);
  // callbacks

  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const changeItemsCount = useCallback((direction: 1 | -1) => {
    setCount(state => state + direction);
  }, []);

  // styles

  // renders
  return (
    <View style={styles.container}>
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Close" onPress={handleClosePress} />
      <View style={styles.buttonGroup}>
        <Button
          style={styles.button}
          label="Add Item"
          onPress={() => changeItemsCount(1)}
        />
        <View style={styles.gap} />
        <Button
          style={styles.button}
          label="Remove Item"
          onPress={() => changeItemsCount(-1)}
        />
      </View>
      <View style={styles.buttonGroup}>
        <Button
          style={styles.button}
          label="Fill To the brim"
          onPress={() => setCount(100)}
        />

        <View style={styles.gap} />
        <Button
          style={styles.button}
          label="Remove all"
          onPress={() => setCount(0)}
        />
      </View>
      <View style={styles.buttonGroup}>
        <Button
          label="default (50%)"
          onPress={() => {
            setMaxHeight(undefined);
            handleExpandPress();
          }}
        />
        <Button
          label="75%"
          onPress={() => {
            setMaxHeight('75%');
            handleExpandPress();
          }}
        />
        <Button
          label="100%"
          onPress={() => {
            setMaxHeight('100%');
            handleExpandPress();
          }}
        />
        <Button
          label="150px"
          onPress={() => {
            setMaxHeight(150);
            handleExpandPress();
          }}
        />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        enablePanDownToClose={true}
        animateOnMount={true}
      >
        <BottomSheetScrollView
          style={innerScrollViewAnimatedStyles}
          onLayout={handleContentLayout}
          scrollEnabled={true}
        >
          {Array.from({ length: count }).map((_, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemText}>👋 I am a item 👋</Text>
            </View>
          ))}
        </BottomSheetScrollView>
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
    paddingBottom: 6,
    paddingHorizontal: 24,
  },
  item: {
    alignContent: 'center',
    height: 50,
    width: '100%',
  },
  itemText: {
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
  },
  button: {
    flex: 1,
    flexShrink: 1,
  },
  buttonGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gap: {
    width: 12,
    height: '100%',
  },
});

export default DynamicSnapPointExample;
