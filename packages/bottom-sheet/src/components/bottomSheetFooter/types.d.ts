import type { ReactNode } from 'react';
import type { APPEARANCE_BEHAVIOR } from './constants';

export interface BottomSheetFooterProps {
  /**
   * Appearance behavior when sheet is below starts to cut off footer,
   * you can combine many behaviors together.
   * @example
   * appearanceBehavior = {['fade' | 'slide']}
   * appearanceBehavior = {'fade'}
   * @enum
   * - `none`: do nothing.
   * - `fade`: fade in and out.
   * - `scale`: scale up and down.
   * - `slide`: slide up and down.
   * @type `none` | `fade` | `scale` | `slide` | Array<`none` | `fade` | `scale` | `slide`>
   * @default none
   */
  appearanceBehavior?:
    | keyof typeof APPEARANCE_BEHAVIOR
    | Array<keyof typeof APPEARANCE_BEHAVIOR>;

  /**
   * Bottom inset to be added below the footer, usually comes
   * from `react-native-safe-area-context` hook `useSafeArea`.
   * @type number
   * @default 0
   */
  bottomInset?: number;

  /**
   * Component to be placed in the footer.
   * @type {ReactNode | ReactNode[]}
   */
  children?: ReactNode | ReactNode[];
}
