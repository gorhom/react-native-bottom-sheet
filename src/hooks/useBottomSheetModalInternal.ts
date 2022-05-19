import { useContext } from 'react';
import {
  BottomSheetModalInternalContext,
  BottomSheetModalInternalContextType,
} from '../contexts';

export function useBottomSheetModalInternal(
  unsafe?: false
): BottomSheetModalInternalContextType;

export function useBottomSheetModalInternal(
  unsafe: true
): BottomSheetModalInternalContextType | null;

export function useBottomSheetModalInternal(
  unsafe?: boolean
): BottomSheetModalInternalContextType | null {
  const context = useContext(BottomSheetModalInternalContext);

  if (unsafe !== true && context === null) {
    throw "'BottomSheetModalInternalContext' cannot be null!";
  }

  return context;
}
