import type { FlatList, ScrollView, SectionList } from 'react-native';

export type Scrollable = FlatList | ScrollView | SectionList;

export type ScrollableRef = {
  id: number;
  node: Scrollable;
  type: 'FlatList' | 'ScrollView' | 'SectionList';
};
