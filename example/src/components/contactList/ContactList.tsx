import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Text, Platform, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  createContactListMockData,
  createContactSectionsMockData,
} from '../../utils';
import ContactItem from '../contactItem';

interface ContactListProps {
  type: 'FlatList' | 'SectionList' | 'ScrollView' | 'View';
  count?: number;
  header?: (() => JSX.Element) | null;
}

const ContactList = ({ type, count = 50, header = null }: ContactListProps) => {
  // hooks
  const { bottom: bottomSafeArea } = useSafeArea();

  // variables
  const sections = useMemo(() => createContactSectionsMockData(count), [count]);
  const data = useMemo(() => createContactListMockData(count), [count]);

  // styles
  const contentContainerStyle = useMemo(
    () => ({
      ...styles.contentContainer,
      paddingBottom: bottomSafeArea,
    }),
    [bottomSafeArea]
  );

  // renders
  const renderFlatListItem = useCallback(
    ({ item, index }) => (
      <ContactItem
        key={`${type}.${item.name}.${index}`}
        title={`${index}: ${item.name}`}
        subTitle={item.jobTitle}
      />
    ),
    [type]
  );
  const renderSectionItem = useCallback(
    ({ item, index }) => (
      <ContactItem
        key={`${type}.${item.name}.${index}`}
        title={`${index}: ${item.name}`}
        subTitle={item.jobTitle}
      />
    ),
    [type]
  );
  const renderScrollViewItem = useCallback(
    (item, index) => (
      <ContactItem
        key={`${type}.${item.name}.${index}`}
        title={`${index}: ${item.name}`}
        subTitle={item.jobTitle}
      />
    ),
    [type]
  );
  const renderSectionHeader = useCallback(
    ({ section }) => (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
      </View>
    ),
    []
  );

  if (type === 'FlatList') {
    return (
      <BottomSheetFlatList
        data={data}
        keyExtractor={i => i.name}
        initialNumToRender={10}
        windowSize={20}
        maxToRenderPerBatch={5}
        renderItem={renderFlatListItem}
        {...(header && {
          stickyHeaderIndices: [0],
          ListHeaderComponent: header,
        })}
        contentContainerStyle={contentContainerStyle}
        focusHook={useFocusEffect}
      />
    );
  } else if (type === 'ScrollView') {
    return (
      <BottomSheetScrollView
        contentContainerStyle={contentContainerStyle}
        focusHook={useFocusEffect}
      >
        {header && header()}
        {data.map(renderScrollViewItem)}
      </BottomSheetScrollView>
    );
  } else if (type === 'SectionList') {
    return (
      <BottomSheetSectionList
        contentContainerStyle={contentContainerStyle}
        stickySectionHeadersEnabled
        initialNumToRender={10}
        windowSize={20}
        maxToRenderPerBatch={5}
        sections={sections}
        keyExtractor={i => i.name}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderSectionItem}
        {...(header && {
          stickyHeaderIndices: [0],
          ListHeaderComponent: header,
        })}
        focusHook={useFocusEffect}
        removeClippedSubviews={Platform.OS === 'android' && sections.length > 0}
      />
    );
  } else if (type === 'View') {
    return (
      <BottomSheetView style={styles.contentContainer}>
        {header && header()}
        {data.map(renderScrollViewItem)}
      </BottomSheetView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  sectionHeaderContainer: {
    paddingTop: 24,
    paddingBottom: 6,
    backgroundColor: 'white',
  },
  sectionHeaderTitle: {
    fontSize: 16,
    textTransform: 'uppercase',
  },
  contentContainer: {
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
});

export default ContactList;
