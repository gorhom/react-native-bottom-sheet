import { type SharedValue } from 'react-native-reanimated';
import type { BottomSheetProps } from '../components/bottomSheet';
/**
 * Convert percentage snap points to pixels in screen and calculate
 * the accurate snap points positions.
 * @param snapPoints provided snap points.
 * @param containerHeight BottomSheetContainer height.
 * @param contentHeight content size.
 * @param handleHeight handle size.
 * @param footerHeight footer size.
 * @param enableDynamicSizing
 * @param maxDynamicContentSize
 * @returns {SharedValue<number[]>}
 */
export declare const useAnimatedSnapPoints: (snapPoints: BottomSheetProps["snapPoints"], containerHeight: SharedValue<number>, contentHeight: SharedValue<number>, handleHeight: SharedValue<number>, footerHeight: SharedValue<number>, enableDynamicSizing: BottomSheetProps["enableDynamicSizing"], maxDynamicContentSize: BottomSheetProps["maxDynamicContentSize"]) => [SharedValue<number[]>, SharedValue<number>, SharedValue<boolean>];
//# sourceMappingURL=useAnimatedSnapPoints.d.ts.map