import React, { useCallback, useMemo, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import ScrollBottomSheet, { SectionList } from '@gorhom/bottom-sheet';
import { useSafeArea } from 'react-native-safe-area-context';
import Handle from '../components/Handle';
import Button from '../components/button';
import ContactItem from '../components/contactItem';
import { createContactSectionsMockData } from '../utils';

const SectionListExample = () => {
  // hooks
  const sheetRef = useRef<ScrollBottomSheet>(null);
  const { bottom: bottomSafeArea } = useSafeArea();
  const headerHeight = useHeaderHeight();

  // variables
  const sections = useMemo(() => createContactSectionsMockData(), []);
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
  const renderSectionHeader = useCallback(
    ({ section }) => (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
      </View>
    ),
    []
  );

  const renderItem = useCallback(
    ({ item }) => <ContactItem title={item.name} subTitle={item.address} />,
    []
  );

  const renderHandle = useCallback(() => {
    return <Handle />;
  }, []);

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
        <SectionList
          contentContainerStyle={contentContainerStyle}
          stickySectionHeadersEnabled
          sections={sections}
          keyExtractor={i => i.name}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          removeClippedSubviews={
            Platform.OS === 'android' && sections.length > 0
          }
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
    paddingVertical: 0,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  sectionHeaderContainer: {
    paddingTop: 24,
    paddingBottom: 6,
    backgroundColor: 'white',
  },
  sectionHeaderTitle: {
    fontSize: 16,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    marginBottom: 6,
  },
});

export default SectionListExample;
