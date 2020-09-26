import type { FC } from 'react';
import type { FlatList, ScrollView, SectionList } from 'react-native';
import type { BottomSheetProps } from './components/bottomSheet';
import type { BottomSheetOverlayProps } from './components/overlay';

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
  node: Scrollable;
  type: ScrollableType;
};

/**
 * Modal types
 */
export type BottomSheetModalConfigs = {
  /**
   * Overlay component.
   * @type (props: [BottomSheetOverlayProps](./components/overlay/types.d.ts)) => ReactNode
   * @default null
   */
  overlayComponent?: FC<BottomSheetOverlayProps>;
  /**
   * Overlay opacity.
   * @type number
   * @default 0.5
   */
  overlayOpacity?: number;
  /**
   * Dismiss modal when press on overlay.
   * @type boolean
   * @default true
   */
  dismissOnOverlayPress?: boolean;
} & Omit<BottomSheetProps, 'children'>;
