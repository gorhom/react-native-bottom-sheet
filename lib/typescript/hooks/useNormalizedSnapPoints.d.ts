import Animated from 'react-native-reanimated';
import type { BottomSheetProps } from '../components/bottomSheet';
/**
 * Convert percentage snap points to pixels in screen and calculate
 * the accurate snap points positions.
 * @param snapPoints provided snap points.
 * @param containerHeight BottomSheetContainer height.
 * @param contentHeight content size.
 * @param handleHeight handle size.
 * @param enableDynamicSizing
 * @param maxDynamicContentSize
 * @returns {Animated.SharedValue<number[]>}
 */
export declare const useNormalizedSnapPoints: (snapPoints: BottomSheetProps['snapPoints'], containerHeight: Animated.SharedValue<number>, contentHeight: Animated.SharedValue<number>, handleHeight: Animated.SharedValue<number>, enableDynamicSizing: BottomSheetProps['enableDynamicSizing'], maxDynamicContentSize: BottomSheetProps['maxDynamicContentSize']) => Readonly<Animated.SharedValue<number[]>>;
