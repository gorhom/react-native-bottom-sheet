import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Text, Platform, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
} from '../../utilities';
import ContactItem from '../contactItem';

export interface ContactListProps {
  type: 'FlatList' | 'SectionList' | 'ScrollView' | 'View';
  count?: number;
  style?: ViewStyle;
  header?: (() => JSX.Element) | null;
  onItemPress?: () => void;
}

const keyExtractor = (item: any, index: number) => `${item.name}.${index}`;

const ContactList = ({
  type,
  count = 25,
  header = null,
  style,
  onItemPress,
}: ContactListProps) => {
  // hooks
  const { bottom: bottomSafeArea } = useSafeAreaInsets();

  // variables
  const sections = useMemo(() => createContactSectionsMockData(count), [count]);
  const data = useMemo(() => createContactListMockData(count), [count]);
  const stickyHeaderIndices = useMemo(() => [0], []);

  // styles
  const contentContainerStyle = useMemo(
    () => ({
      ...styles.contentContainer,
      ...style,
      paddingBottom: bottomSafeArea,
    }),
    [style, bottomSafeArea]
  );

  // renders
  const renderFlatListItem = useCallback(
    ({ item, index }) => (
      <ContactItem
        key={`${type}.${item.name}.${index}`}
        title={`${index}: ${item.name}`}
        subTitle={item.jobTitle}
        onPress={onItemPress}
      />
    ),
    [type, onItemPress]
  );
  const renderSectionItem = useCallback(
    ({ item, index }) => (
      <ContactItem
        key={`${type}.${item.name}.${index}`}
        title={`${index}: ${item.name}`}
        subTitle={item.jobTitle}
        onPress={onItemPress}
      />
    ),
    [type, onItemPress]
  );
  const renderScrollViewItem = useCallback(
    (item, index) => (
      <ContactItem
        key={`${type}.${item.name}.${index}`}
        title={`${index}: ${item.name}`}
        subTitle={item.jobTitle}
        onPress={onItemPress}
      />
    ),
    [type, onItemPress]
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
        keyExtractor={keyExtractor}
        initialNumToRender={5}
        bounces={true}
        windowSize={10}
        maxToRenderPerBatch={5}
        renderItem={renderFlatListItem}
        {...(header && {
          stickyHeaderIndices: stickyHeaderIndices,
          ListHeaderComponent: header,
        })}
        style={styles.container}
        keyboardDismissMode="interactive"
        contentContainerStyle={contentContainerStyle}
        focusHook={useFocusEffect}
      />
    );
  } else if (type === 'ScrollView') {
    return (
      <BottomSheetScrollView
        style={styles.container}
        contentContainerStyle={contentContainerStyle}
        bounces={true}
        focusHook={useFocusEffect}
      >
        {header && header()}
        {data.map(renderScrollViewItem)}
      </BottomSheetScrollView>
    );
  } else if (type === 'SectionList') {
    return (
      <BottomSheetSectionList
        style={styles.container}
        contentContainerStyle={contentContainerStyle}
        stickySectionHeadersEnabled
        initialNumToRender={5}
        windowSize={10}
        maxToRenderPerBatch={5}
        bounces={true}
        sections={sections}
        keyExtractor={keyExtractor}
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
  container: {
    overflow: 'visible',
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    overflow: 'visible',
  },
});

export default ContactList;
