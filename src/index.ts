export { default } from './components/bottomSheetContainer';

// scrollables
export { default as BottomSheetFlatList } from './components/flatList';
export { default as BottomSheetSectionList } from './components/sectionList';
export { default as BottomSheetScrollView } from './components/scrollView';
export { default as BottomSheetDraggableView } from './components/draggableView';
export { default as BottomSheetView } from './components/view';

// helpers
import BottomSheetTouchable from './components/touchables';
export const {
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} = BottomSheetTouchable;

// default components / types
export type { BottomSheetHandleProps } from './components/handle';
// overlay
export { default as BottomSheetOverlay } from './components/overlay';
export type { BottomSheetOverlayProps } from './components/overlay';

// modal provider
export { default as BottomSheetModalProvider } from './components/bottomSheetModalProvider';

// hooks
export { useBottomSheet } from './hooks/useBottomSheet';
export { useBottomSheetModal } from './hooks/useBottomSheetModal';
