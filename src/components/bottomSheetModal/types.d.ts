import type React from 'react';
import type { BottomSheetProps } from '../bottomSheet';
import type { MODAL_STACK_BEHAVIOR } from '../../constants';

export interface BottomSheetModalPrivateMethods {
  dismiss: (force?: boolean) => void;
  minimize: () => void;
  restore: () => void;
}

export type BottomSheetModalStackBehavior = keyof typeof MODAL_STACK_BEHAVIOR;

export interface BottomSheetModalProps
  extends Omit<BottomSheetProps, 'containerHeight' | 'onClose'> {
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

  /**
   * Add a custom container like FullWindowOverlay
   * allow to fix issue like https://github.com/gorhom/react-native-bottom-sheet/issues/832
   * @type React.ComponentType
   * @default undefined
   */
  containerComponent?: React.ComponentType<React.PropsWithChildren<{}>>;

  // callbacks
  /**
   * Callback when the modal dismissed.
   * @type () => void;
   */
  onDismiss?: () => void;

  /**
   * A scrollable node or normal view.
   * @type React.ReactNode[] | React.ReactNode | (({ data: any }?) => React.ReactElement)
   */
  children:
    | (({ data: any }?) => React.ReactElement)
    | React.ReactNode[]
    | React.ReactNode;
}
