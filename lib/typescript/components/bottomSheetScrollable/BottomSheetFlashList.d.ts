import type { FlashListProps } from '@shopify/flash-list';
import React, { type Ref } from 'react';
import type Animated from 'react-native-reanimated';
import type { BottomSheetScrollableProps } from './types';
export type BottomSheetFlashListProps<T> = Omit<Animated.AnimateProps<FlashListProps<T>>, 'decelerationRate' | 'onScroll' | 'scrollEventThrottle'> & BottomSheetScrollableProps & {
    ref?: Ref<React.FC>;
};
export declare const styles: {
    container: {
        flex: number;
        overflow: "visible";
    };
};
export declare const BottomSheetFlashList: React.MemoExoticComponent<React.ForwardRefExoticComponent<any>>;
declare const _default: <T>(props: BottomSheetFlashListProps<T>) => ReturnType<typeof BottomSheetFlashList>;
export default _default;
//# sourceMappingURL=BottomSheetFlashList.d.ts.map