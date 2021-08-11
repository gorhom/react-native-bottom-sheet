export { default } from './components/bottomSheet';

// scrollables
export { default as BottomSheetFlatList } from './components/flatList';
export { default as BottomSheetSectionList } from './components/sectionList';
export { default as BottomSheetScrollView } from './components/scrollView';
export { default as BottomSheetDraggableView } from './components/bottomSheetDraggableView';
export { default as BottomSheetView } from './components/view';

// helpers
import BottomSheetTouchable from './components/touchables';
export const {
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} = BottomSheetTouchable;

// backdrop
export { default as BottomSheetBackdrop } from './components/bottomSheetBackdrop';

// handle
export { default as BottomSheetHandle } from './components/bottomSheetHandle';

// modal
export { default as BottomSheetModal } from './components/bottomSheetModal';
export { default as BottomSheetModalProvider } from './components/bottomSheetModalProvider';

// hooks
export { useBottomSheet } from './hooks/useBottomSheet';
export { useBottomSheetModal } from './hooks/useBottomSheetModal';

// default types
export type { BottomSheetProps } from './components/bottomSheet';
export type { BottomSheetModalProps } from './components/bottomSheetModal';
export type { BottomSheetHandleProps } from './components/bottomSheetHandle';
export type { BottomSheetBackdropProps } from './components/bottomSheetBackdrop';
export type { BottomSheetBackgroundProps } from './components/bottomSheetBackground';
