import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { concat } from 'react-native-reanimated';
import { ReText, useValue } from 'react-native-redash';
import BottomSheet from '@gorhom/bottom-sheet';
import Button from '../../components/button';
import ContactList from '../../components/contactList';
import { useSafeArea } from 'react-native-safe-area-context';

const BasicExample = () => {
  // state
  const [enabled, setEnabled] = useState(true);
  const [dynamicSnapPoint, setDynamicSnapPoint] = useState(450);

  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { top: topSafeArea } = useSafeArea();

  // variables
  const snapPoints = useMemo(() => [150, dynamicSnapPoint], [dynamicSnapPoint]);
  const position = useValue<number>(0);

  // styles
  const containerStyle = useMemo(
    () => ({
      ...styles.container,
      paddingTop: topSafeArea,
    }),
    [topSafeArea]
  );

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const handleSnapPress = useCallback(index => {
    bottomSheetRef.current?.snapTo(index);
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);
  const handleIncreaseDynamicSnapPoint = useCallback(() => {
    setDynamicSnapPoint(state => state + 50);
  }, []);

  // renders
  return (
    <View style={containerStyle}>
      <Button
        label="Increase Dynamic Snap Point"
        style={styles.buttonContainer}
        onPress={handleIncreaseDynamicSnapPoint}
      />
      <Button
        label="Snap To 150"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(0)}
      />
      <Button
        label="Close"
        style={styles.buttonContainer}
        onPress={() => handleClosePress()}
      />

      <Button
        label={`${enabled ? 'Disable' : 'Enable'}`}
        style={styles.buttonContainer}
        onPress={() => setEnabled(state => !state)}
      />
      <ReText text={concat('Position from bottom: ', position)} />
      <BottomSheet
        ref={bottomSheetRef}
        enabled={enabled}
        snapPoints={snapPoints}
        initialSnapIndex={1}
        topInset={topSafeArea}
        animatedPosition={position}
        onChange={handleSheetChanges}
      >
        <ContactList type="View" />
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
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  shadowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  title: {
    fontSize: 46,
    lineHeight: 46,
    fontWeight: '800',
  },
  headerContainer: {
    paddingVertical: 24,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginBottom: 6,
  },
});

export default BasicExample;
