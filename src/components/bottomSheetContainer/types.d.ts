import type { BottomSheetProps } from '../bottomSheet/types';

export type BottomSheetContainerProps = {
  /**
   * Parent height value to help calculate snap points values,
   * if not provided, the library will measure the layout height.
   * @type number
   */
  height?: number;
} & Omit<
  BottomSheetProps,
  'containerHeight' | 'containerTapGestureState' | 'containerTapGestureRef'
>;
