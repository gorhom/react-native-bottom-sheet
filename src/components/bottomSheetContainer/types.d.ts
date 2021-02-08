import type { ReactNode } from 'react';

export interface BottomSheetContainerProps {
  shouldMeasureHeight: boolean;
  containerHeight?: number;
  onMeasureHeight: (height: number) => void;
  children: ReactNode;
}
