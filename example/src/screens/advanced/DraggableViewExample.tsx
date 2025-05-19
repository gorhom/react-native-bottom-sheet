import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BottomSheet, { BottomSheetDraggableView, BottomSheetView } from '@gorhom/bottom-sheet';
import { Button } from '../../components/button';

const DraggableViewExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

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
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
      >
        <BottomSheetView style={styles.row}>
          <BottomSheetDraggableView style={styles.leftView}>
            <Text>Draggable</Text>
          </BottomSheetDraggableView>
          <View style={styles.rightView}>
            <Text>Not draggable</Text>
          </View>
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
  row: {
    flexDirection: 'row',
    height: '100%',
  },
  leftView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  rightView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
});

export default DraggableViewExample;
