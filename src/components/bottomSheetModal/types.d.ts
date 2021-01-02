import { BottomSheetProps } from '../bottomSheet';

export interface BottomSheetModalPrivateMethods {
  dismiss: (force?: boolean) => void;
  minimize: () => void;
  restore: () => void;
}

export type BottomSheetModalStackBehavior = 'push' | 'replace';

export interface BottomSheetModalProps
  extends Exclude<BottomSheetProps, 'animateOnMount' | 'containerHeight'> {
  /**
   * Modal name to help identify the modal for later on.
   * @type string
   * @default nanoid generated unique key.
   */
  name?: string;

  /**
   * Defines the stack behavior when modal mount.
   * - `push` it will mount the modal on top of current modal.
   * - `replace` it will minimize the current modal then mount the modal.
   * @type `push` | `replace`
   * @default replace
   */
  stackBehavior?: BottomSheetModalStackBehavior;

  /**
   * Dismiss modal when panning down.
   * @type boolean
   * @default true
   */
  dismissOnPanDown?: boolean;

  // callbacks
  /**
   * Callback when the modal dismissed.
   * @type () => void;
   */
  onDismiss?: () => void;
}
