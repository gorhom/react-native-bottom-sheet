import type { ReactNode } from 'react';

export interface BottomSheetContainerProps {
  shouldMeasureHeight: boolean;
  onMeasureHeight: (height: number) => void;
  children: ReactNode;
}
