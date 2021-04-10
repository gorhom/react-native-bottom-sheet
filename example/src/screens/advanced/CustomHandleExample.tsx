import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Handle from '../../components/handle';
import Button from '../../components/button';
import ContactListContainer from '../../components/contactListContainer';

const CustomHandleExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => [150, 300, 450], []);

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

  // renders
  return (
    <View style={styles.container}>
      <Button label="Snap To 450" onPress={() => handleSnapPress(2)} />
      <Button label="Snap To 300" onPress={() => handleSnapPress(1)} />
      <Button label="Snap To 150" onPress={() => handleSnapPress(0)} />
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Collapse" onPress={handleCollapsePress} />
      <Button label="Close" onPress={handleClosePress} />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        handleComponent={Handle}
      >
        <ContactListContainer
          count={10}
          type="FlatList"
          title="Custom Handle Example"
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
});

export default CustomHandleExample;
