import type { ReactNode } from 'react';
import type { BottomSheetMethods, BottomSheetModalConfigs } from '../../types';

export type BottomSheetModalType = {
  temporaryCloseSheet: () => void;
  restoreSheetPosition: () => void;
} & BottomSheetMethods;

export interface BottomSheetModalProps {
  configs: BottomSheetModalConfigs;
  content: ReactNode[] | ReactNode;
  unmount: () => void;
}
