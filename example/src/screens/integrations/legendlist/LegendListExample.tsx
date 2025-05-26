import BottomSheet, {
  useBottomSheetScrollableCreator,
} from '@gorhom/bottom-sheet';
import { LegendList, type LegendListRef } from '@legendapp/list';
import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../../components/button';
import renderItem from './renderItem';

export const DRAW_DISTANCE = 200;
export const ESTIMATED_ITEM_LENGTH = 200;

const snapPoints = ['50%', '85%'];
const data = new Array(500).fill(0).map((_, i) => ({
  id: i.toString(),
  type: 'item',
}));

const keyExtractor = (item: (typeof data)[0]) => `id${item.id}`;

const LegendListExample = () => {
  //#region refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  //#endregion

  //#region callbacks
  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleCollapsePress = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);
  //#endregion

  //#region renders
  const BottomSheetLegendListScrollable = useBottomSheetScrollableCreator();
  //#endregion

  return (
    <View style={styles.container}>
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Collapse" onPress={handleCollapsePress} />
      <Button label="Close" onPress={handleClosePress} />
      <BottomSheet
        ref={bottomSheetRef}
        enableDynamicSizing={false}
        snapPoints={snapPoints}
      >
        <LegendList
          style={styles.scrollContainer}
          contentContainerStyle={styles.listContainer}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          indicatorStyle="black"
          estimatedItemSize={ESTIMATED_ITEM_LENGTH}
          drawDistance={DRAW_DISTANCE}
          maintainVisibleContentPosition
          renderScrollComponent={BottomSheetLegendListScrollable}
          recycleItems
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
  scrollContainer: {
    flex: 1,
    height: 0.1,
  },
  listContainer: {},
});

export default LegendListExample;
