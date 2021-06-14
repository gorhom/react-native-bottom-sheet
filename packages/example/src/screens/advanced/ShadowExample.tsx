import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useShowcaseTheme } from '@gorhom/showcase-template';
import Button from '../../components/button';
import ContactListContainer from '../../components/contactListContainer';

const ShadowExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { colors } = useShowcaseTheme();

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // styles
  const sheetStyle = useMemo(
    () => ({
      ...styles.sheetContainer,
      shadowColor: colors.secondaryText,
    }),
    [colors.secondaryText]
  );

  // callbacks
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
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Collapse" onPress={handleCollapsePress} />
      <Button label="Close" onPress={handleClosePress} />

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        style={sheetStyle}
      >
        <ContactListContainer type="View" count={4} title="Shadow Example" />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 24,
  },
  sheetContainer: {
    backgroundColor: 'white',
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
});

export default ShadowExample;
