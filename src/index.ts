export { default } from './components/bottomSheet';
export { default as BottomSheetFlatList } from './components/flatList';
export { default as BottomSheetSectionList } from './components/sectionList';
export { default as BottomSheetScrollView } from './components/scrollView';
export { default as BottomSheetDraggableView } from './components/draggableView';
export { default as BottomSheetView } from './components/view';

import BottomSheetTouchable from './components/touchables';
export const {
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} = BottomSheetTouchable;

export type { BottomSheetHandleProps } from './components/handle';

export { useBottomSheet } from './hooks/useBottomSheet';
