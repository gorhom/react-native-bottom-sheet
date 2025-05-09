import type React from 'react';
import type { View } from 'react-native';
import type { MODAL_STACK_BEHAVIOR } from '../../constants';
import type { BottomSheetProps } from '../bottomSheet';

export interface BottomSheetModalPrivateMethods {
  dismiss: (force?: boolean) => void;
  minimize: () => void;
  restore: () => void;
}

export type BottomSheetModalStackBehavior = keyof typeof MODAL_STACK_BEHAVIOR;

// biome-ignore lint/suspicious/noExplicitAny: Using 'any' allows users to define their own strict types for 'data' property.
export interface BottomSheetModalProps<T = any>
  extends Omit<BottomSheetProps, 'containerHeight' | 'onClose'> {
  /**
   * Modal name to help identify the modal for later on.
   * @type string
   * @default generated unique key.
   */
  name?: string;

  /**
   * Defines the stack behavior when modal mount.
   * - `push` it will mount the modal on top of the current one.
   * - `switch` it will minimize the current modal then mount the new one.
   * - `replace` it will dismiss the current modal then mount the new one.
   * @type `push` | `switch` | `replace`
   * @default switch
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
  containerComponent?: React.ComponentType<React.PropsWithChildren>;

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
  children: React.FC<{ data?: T }> | React.ReactNode[] | React.ReactNode;
}

// biome-ignore lint/suspicious/noExplicitAny: Using 'any' allows users to define their own strict types for 'data' property.
export interface BottomSheetModalState<T = any> {
  mount: boolean;
  data: T | undefined;
}
