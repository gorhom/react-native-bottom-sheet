import { type RefObject, createContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type {
  BottomSheetModalPrivateMethods,
  BottomSheetModalStackBehavior,
} from '../../components/bottomSheetModal';
import type { ContainerLayoutState } from '../../types';

export interface BottomSheetModalInternalContextType {
  hostName: string;
  containerLayoutState: SharedValue<ContainerLayoutState>;
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
