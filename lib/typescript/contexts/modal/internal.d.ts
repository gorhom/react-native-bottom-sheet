import { type RefObject } from 'react';
import type { Insets } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { BottomSheetModalPrivateMethods, BottomSheetModalStackBehavior } from '../../components/bottomSheetModal';
export interface BottomSheetModalInternalContextType {
    containerHeight: SharedValue<number>;
    containerOffset: SharedValue<Required<Insets>>;
    mountSheet: (key: string, ref: RefObject<BottomSheetModalPrivateMethods>, stackBehavior: BottomSheetModalStackBehavior) => void;
    unmountSheet: (key: string) => void;
    willUnmountSheet: (key: string) => void;
}
export declare const BottomSheetModalInternalContext: import("react").Context<BottomSheetModalInternalContextType | null>;
export declare const BottomSheetModalInternalProvider: import("react").Provider<BottomSheetModalInternalContextType | null>;
//# sourceMappingURL=internal.d.ts.map