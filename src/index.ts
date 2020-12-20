export { default } from './components/bottomSheet';
export { default as BottomSheetFlatList } from './components/flatList';
export { default as BottomSheetSectionList } from './components/sectionList';
export { default as BottomSheetScrollView } from './components/scrollView';
export { default as BottomSheetDraggableView } from './components/bottomSheetDraggableView';
export { default as BottomSheetView } from './components/view';

import BottomSheetTouchable from './components/touchables';
export const {
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} = BottomSheetTouchable;

export type { BottomSheetHandleProps } from './components/bottomSheetHandle';

export { useBottomSheet } from './hooks/useBottomSheet';
