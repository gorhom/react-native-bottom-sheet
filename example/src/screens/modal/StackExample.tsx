import {
  type BottomSheetHandleProps,
  BottomSheetModal,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, { ForwardedRef, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../components/button';
import { ContactList } from '../../components/contactList';
import { HeaderHandle } from '../../components/headerHandle';
import { withModalProvider } from './withModalProvider';

const StackExample = () => {
  // hooks
  const { dismiss, dismissAll } = useBottomSheetModal();

  // refs
  const bottomSheetModalARef = useRef<BottomSheetModal | null>(null);
  const bottomSheetModalBRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalCRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const assignBottomSheetModalARef = useCallback((ref: BottomSheetModal | null) => {
    if(ref){
      bottomSheetModalARef.current = ref
    }
  }, [])
  const handlePresentAPress = useCallback(() => {
    if (bottomSheetModalARef.current) {
      bottomSheetModalARef.current.present();
    }
  }, []);
  const handleDismissAPress = useCallback(() => {
    if (bottomSheetModalARef.current) {
      bottomSheetModalARef.current.dismiss();
    }
  }, []);
  const handlePresentBPress = useCallback(() => {
    if (bottomSheetModalBRef.current) {
      bottomSheetModalBRef.current.present();
    }
  }, []);
  const handleDismissBPress = useCallback(() => {
    if (bottomSheetModalBRef.current) {
      bottomSheetModalBRef.current.dismiss();
    }
  }, []);
  const handlePresentCPress = useCallback(() => {
    if (bottomSheetModalCRef.current) {
      bottomSheetModalCRef.current.present();
    }
  }, []);
  const handleDismissCPress = useCallback(() => {
    if (bottomSheetModalCRef.current) {
      bottomSheetModalCRef.current.dismiss();
    }
  }, []);
  const handleDismissAllPress = useCallback(() => {
    dismissAll();
  }, [dismissAll]);
  const handleDismissByHookPress = useCallback(() => {
    dismiss('A');
  }, [dismiss]);

  // renders
  const renderHeaderHandle = useCallback(
    (title: string) => (props: BottomSheetHandleProps) => (
      <HeaderHandle {...props} children={title} />
    ),
    []
  );
  const renderBottomSheetContent = useCallback(
    (onPress: () => void) => (
      <ContactList type="FlatList" onItemPress={onPress} count={6} />
    ),
    []
  );
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Button label="Present Modal A" onPress={handlePresentAPress} />
        </View>
        <View style={styles.rowItem}>
          <Button label="Dismiss Modal A" onPress={handleDismissAPress} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Button label="Present Modal B" onPress={handlePresentBPress} />
        </View>
        <View style={styles.rowItem}>
          <Button label="Dismiss Modal B" onPress={handleDismissBPress} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Button label="Present Modal C" onPress={handlePresentCPress} />
        </View>
        <View style={styles.rowItem}>
          <Button label="Dismiss Modal C" onPress={handleDismissCPress} />
        </View>
      </View>
      <Button label="Dismiss All Modals" onPress={handleDismissAllPress} />
      <Button label="Dismiss All By Hook" onPress={handleDismissByHookPress} />

      <BottomSheetModal
        name="A"
        ref={assignBottomSheetModalARef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        handleComponent={renderHeaderHandle('Modal A')}
        children={renderBottomSheetContent(handlePresentBPress)}
      />

      <BottomSheetModal
        name="B"
        ref={bottomSheetModalBRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        handleComponent={renderHeaderHandle('Modal B')}
        children={renderBottomSheetContent(handlePresentCPress)}
      />

      <BottomSheetModal
        name="C"
        ref={bottomSheetModalCRef}
        index={1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        handleComponent={renderHeaderHandle('Modal C')}
        children={renderBottomSheetContent(handleDismissCPress)}
      />
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
    justifyContent: 'space-between',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
});

export default withModalProvider(StackExample);
