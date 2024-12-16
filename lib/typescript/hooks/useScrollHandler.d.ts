import type { Scrollable, ScrollableEvent } from '../types';
export declare const useScrollHandler: (useScrollEventsHandlers?: import("../types").ScrollEventsHandlersHookType, onScroll?: ScrollableEvent, onScrollBeginDrag?: ScrollableEvent, onScrollEndDrag?: ScrollableEvent) => {
    scrollHandler: import("react-native-reanimated").ScrollHandlerProcessed<never>;
    scrollableRef: import("react-native-reanimated").AnimatedRef<Scrollable>;
    scrollableContentOffsetY: import("react-native-reanimated").SharedValue<number>;
};
//# sourceMappingURL=useScrollHandler.d.ts.map