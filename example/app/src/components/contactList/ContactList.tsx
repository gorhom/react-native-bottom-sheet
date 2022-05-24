import React, { useMemo, useCallback, ComponentProps, memo } from 'react';
import { Text, Platform, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetVirtualizedList,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  createContactListMockData,
  createContactSectionsMockData,
} from '../../utilities/createMockData';
import { ContactItem } from '../contactItem';
import { styles } from './styles';

export interface ContactListProps
  extends Pick<
    ComponentProps<typeof BottomSheetFlatList>,
    'enableFooterMarginAdjustment'
  > {
  type: 'FlatList' | 'SectionList' | 'ScrollView' | 'View' | 'VirtualizedList';
  count?: number;
  style?: ViewStyle;
  onItemPress?: () => void;
  onRefresh?: () => void;
}

const keyExtractor = (item: any, index: number) => `${item.name}.${index}`;
const handleGetItem = (data: any[], index: number) => data[index];
const handleGetCount = (data: any[]) => data.length;

const ContactListComponent = ({
  type,
  count = 25,
  style,
  onRefresh,
  onItemPress,
  ...rest
}: ContactListProps) => {
  // hooks
  const { bottom: bottomSafeArea } = useSafeAreaInsets();

  //#region variables
  const sections = useMemo(() => createContactSectionsMockData(count), [count]);
  const data = useMemo(() => createContactListMockData(count), [count]);
  //#endregion

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
        {...rest}
        data={data}
        refreshing={false}
        onRefresh={onRefresh}
        keyExtractor={keyExtractor}
        initialNumToRender={5}
        bounces={true}
        windowSize={10}
        maxToRenderPerBatch={5}
        renderItem={renderFlatListItem}
        style={styles.container}
        keyboardDismissMode="interactive"
        indicatorStyle="black"
        contentContainerStyle={contentContainerStyle}
        focusHook={useFocusEffect}
      />
    );
  } else if (type === 'VirtualizedList') {
    return (
      <BottomSheetVirtualizedList
        {...rest}
        data={data}
        keyExtractor={keyExtractor}
        initialNumToRender={5}
        getItem={handleGetItem}
        getItemCount={handleGetCount}
        bounces={true}
        windowSize={10}
        maxToRenderPerBatch={5}
        renderItem={renderFlatListItem}
        style={styles.container}
        keyboardDismissMode="interactive"
        contentContainerStyle={contentContainerStyle}
        focusHook={useFocusEffect}
      />
    );
  } else if (type === 'ScrollView') {
    return (
      <BottomSheetScrollView
        {...rest}
        style={styles.container}
        contentContainerStyle={contentContainerStyle}
        bounces={true}
        focusHook={useFocusEffect}
      >
        {data.map(renderScrollViewItem)}
      </BottomSheetScrollView>
    );
  } else if (type === 'SectionList') {
    return (
      <BottomSheetSectionList
        {...rest}
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
        focusHook={useFocusEffect}
        removeClippedSubviews={Platform.OS === 'android' && sections.length > 0}
      />
    );
  } else if (type === 'View') {
    return (
      <BottomSheetView style={styles.contentContainer} {...rest}>
        {data.map(renderScrollViewItem)}
      </BottomSheetView>
    );
  }

  return null;
};

export const ContactList = memo(ContactListComponent);
