import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import Button from '../../components/button';
import ContactItem from '../../components/contactItem';
import HeaderHandle from '../../components/headerHandle';
import withModalProvider from '../withModalProvider';
import { createContactListMockData } from '../../utilities';

const DetachedExample = () => {
  // refs
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // variables
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const data = useMemo(() => createContactListMockData(2), []);

  // hooks
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);
  const { bottom: safeBottomArea } = useSafeAreaInsets();

  // callbacks
  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current!.present();
  }, []);
  const handleDismissPress = useCallback(() => {
    bottomSheetRef.current!.dismiss();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // renders
  const renderHeaderHandle = useCallback(
    props => <HeaderHandle {...props} children="Detached Example" />,
    []
  );
  const renderItem = useCallback(
    (item, index) => (
      <ContactItem
        key={`${item.name}.${index}`}
        title={`${index}: ${item.name}`}
        subTitle={item.jobTitle}
      />
    ),
    []
  );
  return (
    <View style={styles.container}>
      <Button label="Present" onPress={handlePresentPress} />
      <Button label="Dismiss" onPress={handleDismissPress} />
      <Button label="Close" onPress={handleClosePress} />
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        bottomInset={safeBottomArea + 34}
        enablePanDownToClose={true}
        style={{ marginHorizontal: 12 }}
        handleComponent={renderHeaderHandle}
        detached={true}
      >
        <BottomSheetView
          style={styles.contentContainerStyle}
          onLayout={handleContentLayout}
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
  contentContainerStyle: {
    paddingTop: 12,
    paddingBottom: 6,
    paddingHorizontal: 24,
  },
});

export default withModalProvider(DetachedExample);
