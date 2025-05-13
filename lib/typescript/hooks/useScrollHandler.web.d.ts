import type { Scrollable, ScrollableEvent } from '../types';
export type ScrollEventContextType = {
    initialContentOffsetY: number;
    shouldLockInitialPosition: boolean;
};
export declare const useScrollHandler: (_: never, onScroll?: ScrollableEvent) => {
    scrollHandler: ScrollableEvent | undefined;
    scrollableRef: import("react").RefObject<Scrollable>;
    scrollableContentOffsetY: import("react-native-reanimated").SharedValue<number>;
};
//# sourceMappingURL=useScrollHandler.web.d.ts.map