import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/button';

const DynamicSnapPointExample = () => {
  // state
  const [count, setCount] = useState(0);
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  // hooks
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
    childViewMaxHeightStyle,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints, '70%');

  // callbacks
  const handleIncreaseContentPress = useCallback(() => {
    setCount(state => state + 1);
  }, []);
  const handleDecreaseContentPress = useCallback(() => {
    setCount(state => Math.max(state - 1, 0));
  }, []);
  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // styles
  const contentContainerStyle = useMemo(
    () => [
      styles.contentContainerStyle,
      childViewMaxHeightStyle,
      { paddingBottom: safeBottomArea || 6 },
    ],
    [safeBottomArea, childViewMaxHeightStyle]
  );
  const emojiContainerStyle = useMemo(
    () => ({
      ...styles.emojiContainer,
      height: 50 * count,
    }),
    [count]
  );

  // renders
  return (
    <View style={styles.container}>
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Close" onPress={handleClosePress} />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        enablePanDownToClose={true}
        animateOnMount={true}
      >
        <BottomSheetScrollView
          style={contentContainerStyle}
          onLayout={handleContentLayout}
        >
          <Text style={styles.message}>
            Could this sheet resize to its content height ?
          </Text>
          <View style={emojiContainerStyle}>
            <Text style={styles.emoji}>😍</Text>
          </View>
          <Button label="Yes" onPress={handleIncreaseContentPress} />
          <Button label="Maybe" onPress={handleDecreaseContentPress} />
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
  message: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    color: 'black',
  },
  emoji: {
    fontSize: 156,
    textAlign: 'center',
    alignSelf: 'center',
  },
  emojiContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
});

export default DynamicSnapPointExample;
