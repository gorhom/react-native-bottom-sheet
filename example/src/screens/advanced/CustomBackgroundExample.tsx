import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { CustomBackground } from '../../components/customBackground';
import { Button } from '../../components/button';
import { ContactList } from '../../components/contactList';
import { HeaderHandle } from '../../components/headerHandle';

const CustomBackgroundExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => [150, 450], []);

  // callbacks
  const handleSnapPress = useCallback(index => {
    bottomSheetRef.current?.snapToIndex(index);
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

  // render
  const renderHeaderHandle = useCallback(
    props => <HeaderHandle {...props} children="Custom Background Example" />,
    []
  );
  return (
    <View style={styles.container}>
      <Button label="Snap To 450" onPress={() => handleSnapPress(1)} />
      <Button label="Snap To 150" onPress={() => handleSnapPress(0)} />
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Collapse" onPress={handleCollapsePress} />
      <Button label="Close" onPress={handleClosePress} />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        animateOnMount={true}
        handleComponent={renderHeaderHandle}
        backgroundComponent={CustomBackground}
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
  contentContainerStyle: {
    paddingTop: 12,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  headerContainer: {
    backgroundColor: 'transparent',
  },
});

export default CustomBackgroundExample;
