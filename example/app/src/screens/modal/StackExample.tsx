import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { Button } from '../../components/button';
import { ContactList } from '../../components/contactList';
import { HeaderHandle } from '../../components/headerHandle';
import { withModalProvider } from './withModalProvider';

const StackExample = () => {
  // hooks
  const { dismiss, dismissAll } = useBottomSheetModal();

  // refs
  const bottomSheetModalARef = useRef<BottomSheetModal>(null);
  const bottomSheetModalBRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalCRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
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
    (title: string) => (props: any) =>
      <HeaderHandle {...props} children={title} />,
    []
  );
  const renderBottomSheetContent = useCallback(
    onPress => <ContactList type="FlatList" onItemPress={onPress} count={6} />,
    []
  );
  return (
    <View style={styles.container}>
      <Button label="Present Modal A" onPress={handlePresentAPress} />
      <Button label="Dismiss Modal A" onPress={handleDismissAPress} />
      <Button label="Present Modal B" onPress={handlePresentBPress} />
      <Button label="Dismiss Modal B" onPress={handleDismissBPress} />
      <Button label="Present Modal C" onPress={handlePresentCPress} />
      <Button label="Dismiss Modal C" onPress={handleDismissCPress} />
      <Button label="Dismiss All Modal" onPress={handleDismissAllPress} />
      <Button label="Dismiss A By Hook" onPress={handleDismissByHookPress} />

      <BottomSheetModal
        name="A"
        ref={bottomSheetModalARef}
        snapPoints={snapPoints}
        handleComponent={renderHeaderHandle('Modal A')}
        children={renderBottomSheetContent(handlePresentBPress)}
      />

      <BottomSheetModal
        name="B"
        ref={bottomSheetModalBRef}
        snapPoints={snapPoints}
        handleComponent={renderHeaderHandle('Modal B')}
        children={renderBottomSheetContent(handlePresentCPress)}
      />

      <BottomSheetModal
        name="C"
        ref={bottomSheetModalCRef}
        index={1}
        snapPoints={snapPoints}
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
});

export default withModalProvider(StackExample);
