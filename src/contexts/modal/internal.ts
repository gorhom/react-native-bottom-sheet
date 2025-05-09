import { type RefObject, createContext } from 'react';
import type { Insets } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type {
  BottomSheetModalPrivateMethods,
  BottomSheetModalStackBehavior,
} from '../../components/bottomSheetModal';

export interface BottomSheetModalInternalContextType {
  containerHeight: SharedValue<number>;
  containerOffset: SharedValue<Required<Insets>>;
  mountSheet: (
    key: string,
    ref: RefObject<BottomSheetModalPrivateMethods>,
    stackBehavior: BottomSheetModalStackBehavior
  ) => void;
  unmountSheet: (key: string) => void;
  willUnmountSheet: (key: string) => void;
}

export const BottomSheetModalInternalContext =
  createContext<BottomSheetModalInternalContextType | null>(null);

export const BottomSheetModalInternalProvider =
  BottomSheetModalInternalContext.Provider;
