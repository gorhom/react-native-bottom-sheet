import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Button } from '../../components/button';
import { ContactItem } from '../../components/contactItem';
import { createContactListMockData } from '../../utilities/createMockData';

const CustomThemeExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const data = useMemo(() => createContactListMockData(5), []);

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
  const renderItem = useCallback(
    (item, index) => (
      <ContactItem
        key={`${item.name}.${index}`}
        title={item.name}
        subTitle={item.jobTitle}
        titleStyle={styles.titleStyle}
        subTitleStyle={styles.subTitleStyle}
        thumbnailStyle={styles.thumbnailStyle}
        iconStyle={styles.iconStyle}
      />
    ),
    []
  );
  return (
    <View style={styles.container}>
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Collapse" onPress={handleCollapsePress} />
      <Button label="Close" onPress={handleClosePress} />

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        animateOnMount={true}
        backgroundStyle={styles.backgroundContainer}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.contentContainer}>
          {data.map(renderItem)}
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
  contentContainer: {
    paddingHorizontal: 16,
    overflow: 'visible',
  },
  backgroundContainer: {
    backgroundColor: '#222',
  },
  handleIndicator: {
    backgroundColor: '#eee',
  },
  titleStyle: {
    color: '#dfdfdf',
  },
  subTitleStyle: {},
  thumbnailStyle: {
    backgroundColor: '#444',
  },
  iconStyle: {
    backgroundColor: '#292929',
  },
});

export default CustomThemeExample;
