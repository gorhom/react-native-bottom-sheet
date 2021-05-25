import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BottomSheet, { BottomSheetFooter } from '@gorhom/bottom-sheet';
import SearchHandle from '../../components/searchHandle';
import Button from '../../components/button';
import ContactList from '../../components/contactList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FooterExample = () => {
  // state
  const [fadeBehavior, setFadeBehavior] = useState<'none' | 'fade'>('none');
  const [slideBehavior, setSlideBehavior] = useState<'none' | 'slide'>('none');
  const [scaleBehavior, setScaleBehavior] = useState<'none' | 'scale'>('none');

  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { bottom: bottomSafeArea } = useSafeAreaInsets();

  // variables
  const snapPoints = useMemo(() => [80, 250], []);
  const appearanceBehavior = useMemo(
    () => [fadeBehavior, slideBehavior, scaleBehavior],
    [fadeBehavior, slideBehavior, scaleBehavior]
  );

  // callbacks
  const handleFadeBehavior = useCallback(() => {
    setFadeBehavior(state => (state === 'none' ? 'fade' : 'none'));
  }, []);
  const handleScaleBehavior = useCallback(() => {
    setScaleBehavior(state => (state === 'none' ? 'scale' : 'none'));
  }, []);
  const handleSlideBehavior = useCallback(() => {
    setSlideBehavior(state => (state === 'none' ? 'slide' : 'none'));
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

  // renders
  return (
    <View style={styles.container}>
      <Button
        label={`Toggle Fade Behavior: ${fadeBehavior}`}
        onPress={handleFadeBehavior}
      />
      <Button
        label={`Toggle Scale Behavior: ${scaleBehavior}`}
        onPress={handleScaleBehavior}
      />
      <Button
        label={`Toggle Slide Behavior: ${slideBehavior}`}
        onPress={handleSlideBehavior}
      />
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Collapse" onPress={handleCollapsePress} />
      <Button label="Close" onPress={handleClosePress} />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        handleComponent={SearchHandle}
      >
        <ContactList count={10} type="FlatList" />
        <BottomSheetFooter
          bottomInset={bottomSafeArea}
          appearanceBehavior={appearanceBehavior}
        >
          <View style={styles.footer}>
            <Text style={styles.footerText}>this is a footer!</Text>
          </View>
        </BottomSheetFooter>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    padding: 12,
    marginBottom: 12,
    borderRadius: 24,
    backgroundColor: '#80f',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default FooterExample;
