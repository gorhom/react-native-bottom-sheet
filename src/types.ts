import type { FlatList, ScrollView, SectionList } from 'react-native';

export type BottomSheetMethods = {
  /**
   * Snap to one of the provided points from `snapPoints`.
   * @type (index: number) => void
   */
  snapTo: (index: number) => void;
  /**
   * Snap to the maximum provided point from `snapPoints`.
   * @type () => void
   */
  expand: () => void;
  /**
   * Snap to the minimum provided point from `snapPoints`.
   * @type () => void
   */
  collapse: () => void;
  /**
   * Close the bottom sheet.
   * @type () => void
   */
  close: () => void;
};

export type Scrollable = FlatList | ScrollView | SectionList;

export type ScrollableType = 'FlatList' | 'ScrollView' | 'SectionList' | 'View';

export type ScrollableRef = {
  id: number;
  node: React.RefObject<Scrollable>;
  type: ScrollableType;
  didResize: boolean;
};
