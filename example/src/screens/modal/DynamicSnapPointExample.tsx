import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/button';
import { withModalProvider } from './withModalProvider';

const DynamicSnapPointExample = () => {
  // state
  const [count, setCount] = useState(0);
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  // hooks
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  // callbacks
  const handleIncreaseContentPress = useCallback(() => {
    setCount(state => state + 1);
  }, []);
  const handleDecreaseContentPress = useCallback(() => {
    setCount(state => Math.max(state - 1, 0));
  }, []);

  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleDismissPress = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  // styles
  const contentContainerStyle = useMemo(
    () => ({
      ...styles.contentContainerStyle,
      paddingBottom: safeBottomArea || 6,
    }),
    [safeBottomArea]
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
      <Button label="Present" onPress={handlePresentPress} />
      <Button label="Dismiss" onPress={handleDismissPress} />
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        enablePanDownToClose={true}
      >
        <BottomSheetView
          style={contentContainerStyle}
          onLayout={handleContentLayout}
        >
          <Text style={styles.message}>
            Could this sheet modal resize to its content height ?
          </Text>
          <View style={emojiContainerStyle}>
            <Text style={styles.emoji}>😍</Text>
          </View>
          <Button label="Yes" onPress={handleIncreaseContentPress} />
          <Button label="Maybe" onPress={handleDecreaseContentPress} />
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
  contentContainerStyle: {
    paddingTop: 12,
    paddingHorizontal: 24,
    backgroundColor: 'white',
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

export default withModalProvider(DynamicSnapPointExample);
