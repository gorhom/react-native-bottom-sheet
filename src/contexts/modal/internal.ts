import { createContext, Ref } from 'react';
import type { Insets } from 'react-native';
import type Animated from 'react-native-reanimated';
import type BottomSheet from '../../components/bottomSheet';
import type { BottomSheetModalStackBehavior } from '../../components/bottomSheetModal';

export interface BottomSheetModalInternalContextType {
  containerHeight: Animated.SharedValue<number>;
  containerOffset: Animated.SharedValue<Required<Insets>>;
  mountSheet: (
    key: string,
    ref: Ref<BottomSheet>,
    stackBehavior: BottomSheetModalStackBehavior
  ) => void;
  unmountSheet: (key: string) => void;
  willUnmountSheet: (key: string) => void;
}

export const BottomSheetModalInternalContext =
  createContext<BottomSheetModalInternalContextType | null>(null);

export const BottomSheetModalInternalProvider =
  BottomSheetModalInternalContext.Provider;
