import React from 'react';
import type { BottomSheetModalMethods } from '../../types';
import type { BottomSheetModalProps } from './types';
type BottomSheetModal<T = any> = BottomSheetModalMethods<T>;
declare function BottomSheetModalComponent<T = any>(props: BottomSheetModalProps<T>, ref: React.ForwardedRef<BottomSheetModal<T>>): React.JSX.Element | null;
declare const BottomSheetModal: <T = any>(props: BottomSheetModalProps<T> & {
    ref?: React.ForwardedRef<BottomSheetModal<T>>;
}) => ReturnType<typeof BottomSheetModalComponent>;
export default BottomSheetModal;
//# sourceMappingURL=BottomSheetModal.d.ts.map