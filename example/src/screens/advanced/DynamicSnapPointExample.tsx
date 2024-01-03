import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  SNAP_POINT_TYPE,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/button';

const DynamicSnapPointExample = () => {
  // state
  const [count, setCount] = useState(0);

  // hooks
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);

  //#region callbacks
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
  const handleSheetChange = useCallback(
    (index: number, position: number, type: SNAP_POINT_TYPE) => {
      // eslint-disable-next-line no-console
      console.log('handleSheetChange', { index, position, type });
    },
    []
  );
  //#endregion

  //#region styles
  const contentContainerStyle = useMemo(
    () => [
      styles.contentContainerStyle,
      { paddingBottom: safeBottomArea || 6 },
    ],
    [safeBottomArea]
  );
  const emojiContainerStyle = useMemo(
    () => ({
      ...styles.emojiContainer,
      height: 50 * count,
    }),
    [count]
  );
  //#endregion

  // renders
  return (
    <View style={styles.container}>
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Close" onPress={handleClosePress} />
      <BottomSheet
        ref={bottomSheetRef}
        enableDynamicSizing={true}
        enablePanDownToClose={true}
        animateOnMount={true}
        onChange={handleSheetChange}
      >
        <BottomSheetView style={contentContainerStyle}>
          <Text style={styles.message}>
            Could this sheet resize to its content height ?
          </Text>
          <View style={emojiContainerStyle}>
            <Text style={styles.emoji}>😍</Text>
          </View>
          <Button label="Yes" onPress={handleIncreaseContentPress} />
          <Button label="Maybe" onPress={handleDecreaseContentPress} />
        </BottomSheetView>
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
