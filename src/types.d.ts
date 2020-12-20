import type { FlatList, ScrollView, SectionList } from 'react-native';

//#region Methods
export interface BottomSheetMethods {
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
}

export interface BottomSheetModalMethods extends BottomSheetMethods {
  /**
   * Mount and present the modal.
   * @type () => void
   */
  present: () => void;
  /**
   * Close and unmount the modal.
   * @type () => void;
   */
  dismiss: () => void;
}
//#endregion

//#region scrollables
export type Scrollable = FlatList | ScrollView | SectionList;

export type ScrollableType = 'FlatList' | 'ScrollView' | 'SectionList' | 'View';

export type ScrollableRef = {
  id: number;
  node: React.RefObject<Scrollable>;
  type: ScrollableType;
  didResize: boolean;
};
//#endregion
