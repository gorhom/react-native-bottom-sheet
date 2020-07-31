import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import ScrollBottomSheet, { FlatList } from '@gorhom/bottom-sheet';
import { useSafeArea } from 'react-native-safe-area-context';
import Handle from '../components/Handle';
import Button from '../components/button';
import ContactItem from '../components/contactItem';
import { createContactListMockData } from '../utils';

const FlatListExample = () => {
  // hooks
  const sheetRef = useRef<ScrollBottomSheet>(null);
  const { bottom: bottomSafeArea } = useSafeArea();
  const headerHeight = useHeaderHeight();

  // variables
  const data = useMemo(() => createContactListMockData(), []);
  const snapPoints = useMemo(() => ['10%', '50%', '80%'], []);

  // styles
  const contentContainerStyle = useMemo(
    () => ({
      ...styles.contentContainerStyle,
      paddingBottom: bottomSafeArea,
    }),
    [bottomSafeArea]
  );

  // callbacks
  const handleSnapPress = useCallback(index => {
    sheetRef.current?.snapTo(index);
  }, []);

  // renders
  const renderHandle = useCallback(() => <Handle />, []);
  const renderItem = useCallback(
    ({ item, index }) => (
      <ContactItem title={`${item.name}.${index}`} subTitle={item.jobTitle} />
    ),
    []
  );
  return (
    <View style={styles.container}>
      <Button
        label="Extend"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(0)}
      />
      <Button
        label="Open"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(1)}
      />
      <Button
        label="Close"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(2)}
      />
      <ScrollBottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        initialSnapIndex={2}
        topInset={headerHeight}
        renderHandle={renderHandle}
      >
        <FlatList
          data={data}
          keyExtractor={i => i.name}
          renderItem={renderItem}
          contentContainerStyle={contentContainerStyle}
        />
      </ScrollBottomSheet>
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
  buttonContainer: {
    marginBottom: 6,
  },
});

export default FlatListExample;
