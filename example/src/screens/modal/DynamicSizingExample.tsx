import {
  BottomSheetFooter,
  type BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetScrollView,
  type SNAP_POINT_TYPE,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/button';
import { ContactItem } from '../../components/contactItem';
import { createContactListMockData } from '../../utilities/createMockData';
import { withModalProvider } from './withModalProvider';

const DATA = createContactListMockData(20);

const DynamicSizingExample = () => {
  //#region state
  const [count, setCount] = useState(1);
  const [maxHeight, setMaxHeight] = useState<undefined | number>();
  //#endregion

  //#region variable
  const data = useMemo(() => DATA.slice(0, count), [count]);
  //#endregion

  //#region hooks
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  //#endregion

  //#region callbacks
  const handleIncreaseContentPress = useCallback(() => {
    setCount(state => state + 1);
  }, []);
  const handleDecreaseContentPress = useCallback(() => {
    setCount(state => Math.max(state - 1, 1));
  }, []);
  const handleSetMaxHeight = useCallback(() => {
    setMaxHeight(state => (state ? undefined : 500));
  }, []);
  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleDismissPress = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);
  const handleSheetChange = useCallback(
    (index: number, position: number, type: SNAP_POINT_TYPE) => {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.log('handleSheetChange', { index, position, type });
    },
    []
  );
  //#endregion

  //#region styles
  const footerContainerStyle = useMemo(
    () => ({
      ...styles.footerContainer,
      paddingBottom: safeBottomArea || 6,
    }),
    [safeBottomArea]
  );
  //#endregion

  //#region renders
  const footerComponent = useMemo(
    () => (props: BottomSheetFooterProps) => (
      <BottomSheetFooter style={footerContainerStyle} {...props}>
        <Button
          label="Add Item"
          style={styles.footerButton}
          onPress={handleIncreaseContentPress}
        />
        <Button
          label="Remove Item"
          style={styles.footerButton}
          onPress={handleDecreaseContentPress}
        />
      </BottomSheetFooter>
    ),
    [
      footerContainerStyle,
      handleIncreaseContentPress,
      handleDecreaseContentPress,
    ]
  );
  return (
    <View style={styles.container}>
      <Button label="Present" onPress={handlePresentPress} />
      <Button label="Dismiss" onPress={handleDismissPress} />
      <Button
        label={`Max Dynamic Size: ${maxHeight}`}
        onPress={handleSetMaxHeight}
      />
      <BottomSheetModal
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        maxDynamicContentSize={maxHeight}
        footerComponent={footerComponent}
        onChange={handleSheetChange}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.contentContainerStyle}
          enableFooterMarginAdjustment={true}
        >
          {data.map(item => (
            <ContactItem
              key={item.name}
              title={item.name}
              subTitle={item.jobTitle}
            />
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
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
  message: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    color: 'black',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 24,
  },
  footerButton: {
    flex: 1,
  },
});

export default withModalProvider(DynamicSizingExample);
