// bottom sheet
export { default } from './components/bottomSheet';

// bottom sheet modal
export { default as BottomSheetModal } from './components/bottomSheetModal';
export { default as BottomSheetModalProvider } from './components/bottomSheetModalProvider';

//#region hooks
export { useBottomSheet } from './hooks/useBottomSheet';
export { useBottomSheetModal } from './hooks/useBottomSheetModal';
export { useBottomSheetSpringConfigs } from './hooks/useBottomSheetSpringConfigs';
export { useBottomSheetTimingConfigs } from './hooks/useBottomSheetTimingConfigs';
//#endregion

//#region components
export {
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetFlatList,
} from './components/bottomSheetScrollable';
export { default as BottomSheetDraggableView } from './components/bottomSheetDraggableView';
export { default as BottomSheetView } from './components/view';
export { default as BottomSheetTextInput } from './components/bottomSheetTextInput';
export { default as BottomSheetBackdrop } from './components/bottomSheetBackdrop';

import BottomSheetTouchable from './components/touchables';
export const {
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} = BottomSheetTouchable;
//#endregion

//#region types
export type { BottomSheetProps } from './components/bottomSheet';
export type { BottomSheetModalProps } from './components/bottomSheetModal';
export type { BottomSheetHandleProps } from './components/bottomSheetHandle';
export type { BottomSheetBackgroundProps } from './components/bottomSheetBackground';
export type { BottomSheetBackdropProps } from './components/bottomSheetBackdrop';

export type {
  BottomSheetFlatListMethods,
  BottomSheetScrollViewMethods,
  BottomSheetSectionListMethods,
} from './components/bottomSheetScrollable';
//#endregion

// logger
export { enableLogging } from './utilities/logger';
