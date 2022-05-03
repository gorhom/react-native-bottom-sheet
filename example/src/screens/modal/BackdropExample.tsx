import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Alert, useWindowDimensions } from 'react-native';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import Button from '../../components/button';
import ContactList from '../../components/contactList';
import HeaderHandle from '../../components/headerHandle';
import withModalProvider from '../withModalProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { print } from '../../../../src/utilities';

export const BackdropExample = () => {
  // state
  const [backdropPressBehavior, setBackdropPressBehavior] = useState<
    'none' | 'close' | 'collapse'
  >('collapse');
  // refs
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  //#region callbacks
  const handleDismiss = useCallback(() => {
    Alert.alert('Modal Been Dismissed');
  }, []);
  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleTogglePressBehavior = useCallback(() => {
    setBackdropPressBehavior(state => {
      switch (state) {
        case 'none':
          return 'close';
        case 'close':
          return 'collapse';
        case 'collapse':
          return 'none';
      }
    });
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
  //#endregion

  const { top: topInsets } = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const modalHeight = screenHeight - topInsets - 80;
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 500,
  });

  // renders
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} opacity={0.7} />
    ),
    []
  );

  const renderHeaderHandle = useCallback(
    props => <HeaderHandle {...props} children="Modal With Backdrop Example" />,
    []
  );
  return (
    <View style={styles.container}>
      <Button label="Expand" onPress={handleExpandPress} />
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose
        snapPoints={[0.1, modalHeight]}
        containerHeight={modalHeight}
        handleComponent={renderHeaderHandle}
        backdropComponent={renderBackdrop}
        animationConfigs={animationConfigs}
        onChange={(index: number) => {
          print({
            component: BottomSheet.name,
            method: 'onChange',
            params: {
              index: index,
            },
          });
        }}
        onClose={() => {
          print({
            component: BottomSheet.name,
            method: 'onClose',
          });
        }}
      >
        <ContactList type="View" count={5} />
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

export default withModalProvider(BackdropExample);
