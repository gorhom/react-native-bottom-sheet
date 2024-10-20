import {
  BottomSheetFooter,
  type BottomSheetFooterProps,
  type BottomSheetHandleProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/button';
import { ContactItem } from '../../components/contactItem';
import { HeaderHandle } from '../../components/headerHandle';
import type { Contact } from '../../types';
import { createContactListMockData } from '../../utilities/createMockData';
import { withModalProvider } from './withModalProvider';

const DATA = createContactListMockData(4);

const DetachedExample = () => {
  // refs
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // state
  const [count, setCount] = useState(2);

  // variables
  const data = useMemo(() => DATA.slice(0, count), [count]);

  // hooks
  const { bottom: safeBottomArea } = useSafeAreaInsets();

  // callbacks
  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleDismissPress = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);
  const handleResizePress = useCallback(() => {
    setCount(state => (state === 2 ? 4 : 2));
  }, []);

  // renders
  const renderHeaderHandle = useCallback(
    (props: BottomSheetHandleProps) => (
      <HeaderHandle {...props}>Detached Example</HeaderHandle>
    ),
    []
  );
  const renderItem = useCallback(
    (item: Contact, index: number) => (
      <ContactItem
        key={`${item.name}.${index}`}
        title={`${index}: ${item.name}`}
        subTitle={item.jobTitle}
      />
    ),
    []
  );
  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <Button
          label="Resize"
          style={styles.footer}
          labelStyle={styles.footerText}
          onPress={handleResizePress}
        />
      </BottomSheetFooter>
    ),
    [handleResizePress]
  );
  return (
    <View style={styles.container}>
      <Button label="Present" onPress={handlePresentPress} />
      <Button label="Dismiss" onPress={handleDismissPress} />
      <Button label="Close" onPress={handleClosePress} />
      <BottomSheetModal
        ref={bottomSheetRef}
        bottomInset={safeBottomArea + 16}
        enablePanDownToClose={true}
        style={styles.sheetContainer}
        backgroundComponent={null}
        footerComponent={renderFooter}
        handleComponent={renderHeaderHandle}
        detached={true}
      >
        <BottomSheetView
          style={styles.contentContainerStyle}
          enableFooterMarginAdjustment={true}
        >
          {data.map(renderItem)}
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
  sheetContainer: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16.0,

    elevation: 24,
  },
  contentContainerStyle: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    padding: 6,
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

export default withModalProvider(DetachedExample);
