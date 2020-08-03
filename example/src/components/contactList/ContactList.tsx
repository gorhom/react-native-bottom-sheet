import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, ScrollView, SectionList } from '@gorhom/bottom-sheet';
import {
  createContactListMockData,
  createContactSectionsMockData,
} from '../../utils';
import ContactItem from '../contactItem';

interface ContactListProps {
  type: 'FlatList' | 'SectionList' | 'ScrollView';
  header?: React.ReactElement;
}

const ContactList = ({ type, header = null }: ContactListProps) => {
  // hooks
  const { bottom: bottomSafeArea } = useSafeArea();

  // variables
  const sections = useMemo(() => createContactSectionsMockData(), []);
  const data = useMemo(() => createContactListMockData(), []);

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
        subTitle={item.address}
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
      <FlatList
        data={data}
        keyExtractor={i => i.name}
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
      <ScrollView
        contentContainerStyle={contentContainerStyle}
        focusHook={useFocusEffect}
      >
        {header}
        {data.map(renderScrollViewItem)}
      </ScrollView>
    );
  } else if (type === 'SectionList') {
    return (
      <SectionList
        contentContainerStyle={contentContainerStyle}
        stickySectionHeadersEnabled
        sections={sections}
        keyExtractor={i => i.name}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderSectionItem}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={header}
        removeClippedSubviews={Platform.OS === 'android' && sections.length > 0}
      />
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
    paddingTop: 12,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
});

export default ContactList;
