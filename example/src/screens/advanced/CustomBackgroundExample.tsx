import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomBackground from '../../components/customBackground';
import Button from '../../components/button';
import ContactListContainer from '../../components/contactListContainer';

const CustomBackgroundExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => [150, 450], []);

  // styles

  // callbacks
  const handleSnapPress = useCallback(index => {
    bottomSheetRef.current?.snapTo(index);
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
  return (
    <View style={styles.container}>
      <Button
        label="Snap To 450"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(1)}
      />
      <Button
        label="Snap To 150"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(0)}
      />
      <Button
        label="Expand"
        style={styles.buttonContainer}
        onPress={() => handleExpandPress()}
      />
      <Button
        label="Collapse"
        style={styles.buttonContainer}
        onPress={() => handleCollapsePress()}
      />
      <Button
        label="Close"
        style={styles.buttonContainer}
        onPress={() => handleClosePress()}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        animateOnMount={true}
        backgroundComponent={CustomBackground}
      >
        <ContactListContainer
          type="View"
          count={3}
          title="Custom Background Example"
          headerStyle={styles.headerContainer}
        />
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
  headerContainer: {
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    marginBottom: 6,
  },
});

export default CustomBackgroundExample;
