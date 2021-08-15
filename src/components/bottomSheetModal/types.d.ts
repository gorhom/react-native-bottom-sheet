import type { BottomSheetProps } from '../bottomSheet';
import type { MODAL_STACK_BEHAVIOR } from '../../constants';

export interface BottomSheetModalPrivateMethods {
  dismiss: (force?: boolean) => void;
  minimize: () => void;
  restore: () => void;
}

export type BottomSheetModalStackBehavior = keyof typeof MODAL_STACK_BEHAVIOR;

export interface BottomSheetModalProps
  extends Omit<
    BottomSheetProps,
    'animateOnMount' | 'containerHeight' | 'onClose'
  > {
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
   * Enable dismiss the modal when it is closed.
   * @type boolean
   * @default true
   */
  enableDismissOnClose?: boolean;

  // callbacks
  /**
   * Callback when the modal dismissed.
   * @type () => void;
   */
  onDismiss?: () => void;
}
