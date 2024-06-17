/// <reference types="react-native-reanimated" />
/**
 * Provides dynamic content height calculating functionalities, by
 * replacing the placeholder `CONTENT_HEIGHT` with calculated layout.
 * @example
 * [0, 'CONTENT_HEIGHT', '100%']
 * @param initialSnapPoints your snap point with content height placeholder.
 * @returns {
 *  - animatedSnapPoints: an animated snap points to be set on `BottomSheet` or `BottomSheetModal`.
 *  - animatedHandleHeight: an animated handle height callback node to be set on `BottomSheet` or `BottomSheetModal`.
 *  - animatedContentHeight: an animated content height callback node to be set on `BottomSheet` or `BottomSheetModal`.
 *  - handleContentLayout: a `onLayout` callback method to be set on `BottomSheetView` component.
 * }
 * @deprecated will be deprecated in the next major release! please use the new introduce prop `enableDynamicSizing`.
 */
export declare const useBottomSheetDynamicSnapPoints: (initialSnapPoints: Array<string | number>) => {
    animatedSnapPoints: Readonly<{
        value: (string | number)[];
    }>;
    animatedHandleHeight: import("react-native-reanimated").SharedValue<number>;
    animatedContentHeight: import("react-native-reanimated").SharedValue<number>;
    handleContentLayout: ({ nativeEvent: { layout: { height }, }, }: {
        nativeEvent: {
            layout: {
                height: number;
            };
        };
    }) => void;
};
