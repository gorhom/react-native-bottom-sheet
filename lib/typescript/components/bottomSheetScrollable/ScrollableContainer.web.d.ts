import React from 'react';
import type { ViewProps } from 'react-native';
import type { SimultaneousGesture } from 'react-native-gesture-handler';
interface ScrollableContainerProps {
    nativeGesture: SimultaneousGesture;
    setContentSize: (contentHeight: number) => void;
    ScrollableComponent: any;
    onLayout: ViewProps['onLayout'];
}
export declare const ScrollableContainer: React.ForwardRefExoticComponent<ScrollableContainerProps & {
    animatedProps: never;
} & React.RefAttributes<never>>;
export {};
//# sourceMappingURL=ScrollableContainer.web.d.ts.map