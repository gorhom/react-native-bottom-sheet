import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/button';
import withModalProvider from '../withModalProvider';

const DynamicSnapPointExample = () => {
  // state
  const [count, setCount] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  // hooks
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { bottom: safeBottomArea } = useSafeAreaInsets();

  // variables
  const snapPoints = useMemo(() => [contentHeight], [contentHeight]);

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
      >
        <BottomSheetView
          style={contentContainerStyle}
          onLayout={handleOnLayout}
        >
          <Text style={styles.message}>
            Could this sheet modal resize to its content height ?
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
            label="Maybe"
            style={styles.buttonContainer}
            onPress={handleDecreaseContentPress}
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
    overflow: 'hidden',
    justifyContent: 'center',
  },
});

export default withModalProvider(DynamicSnapPointExample);
