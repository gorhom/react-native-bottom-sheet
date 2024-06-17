/// <reference types="react" />
import type { Scrollable } from '../types';
export type ScrollEventContextType = {
    initialContentOffsetY: number;
    shouldLockInitialPosition: boolean;
};
export declare const useScrollHandler: () => {
    scrollHandler: undefined;
    scrollableRef: import("react").MutableRefObject<Scrollable | undefined>;
    scrollableContentOffsetY: import("react-native-reanimated").SharedValue<number>;
};
//# sourceMappingURL=useScrollHandler.web.d.ts.map