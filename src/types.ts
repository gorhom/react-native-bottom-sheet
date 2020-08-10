import type { FlatList, ScrollView, SectionList } from 'react-native';

export type Scrollable = FlatList | ScrollView | SectionList;

export type ScrollableType = 'FlatList' | 'ScrollView' | 'SectionList' | 'View';

export type ScrollableRef = {
  id: number;
  node: Scrollable;
  type: ScrollableType;
};
