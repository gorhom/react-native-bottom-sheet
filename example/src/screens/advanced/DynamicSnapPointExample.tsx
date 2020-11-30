import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeArea } from 'react-native-safe-area-context';
import { Easing } from 'react-native-reanimated';
import Button from '../../components/button';

const DynamicSnapPointExample = () => {
  // state
  const [count, setCount] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { bottom: safeBottomArea } = useSafeArea();

  // variables
  const snapPoints = useMemo(() => [0, contentHeight], [contentHeight]);

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
  const handleOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      // console.log('SCREEN \t\t', 'handleOnLayout', height);
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
  const emojiContainerStyle = useMemo(
    () => ({
      ...styles.emojiContainer,
      height: 50 * count,
    }),
    [count]
  );

  // renders
  const renderBackground = useCallback(
    () => <View style={styles.background} />,
    []
  );

  // console.log('SCREEN \t\t', 'render \t');
  return (
    <View style={styles.container}>
      <Button
        label="Expand"
        style={styles.buttonContainer}
        onPress={handleExpandPress}
      />
      <Button
        label="Close"
        style={styles.buttonContainer}
        onPress={handleClosePress}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        animateOnMount={true}
        animationEasing={Easing.out(Easing.quad)}
        animationDuration={250}
        backgroundComponent={renderBackground}
      >
        <BottomSheetView
          style={contentContainerStyle}
          onLayout={handleOnLayout}
        >
          <Text style={styles.message}>
            Could this sheet resize to its content height ?
          </Text>
          <View style={emojiContainerStyle}>
            <Text style={styles.emoji}>😍</Text>
          </View>
          <Button
            label="Yes"
            style={styles.buttonContainer}
            onPress={handleIncreaseContentPress}
          />
          <Button
            label="Mayby"
            style={styles.buttonContainer}
            onPress={handleDecreaseContentPress}
          />
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
  message: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 156,
    textAlign: 'center',
    alignSelf: 'center',
  },
  emojiContainer: {
    justifyContent: 'center',
  },
});

export default DynamicSnapPointExample;
