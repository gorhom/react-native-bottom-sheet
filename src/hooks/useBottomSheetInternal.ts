import { useContext } from 'react';
import {
  BottomSheetInternalContext,
  BottomSheetInternalContextType,
} from '../contexts/internal';

export function useBottomSheetInternal(
  unsafe?: false
): BottomSheetInternalContextType;

export function useBottomSheetInternal(
  unsafe: true
): BottomSheetInternalContextType | null;

export function useBottomSheetInternal(
  unsafe?: boolean
): BottomSheetInternalContextType | null {
  const context = useContext(BottomSheetInternalContext);

  if (unsafe !== true && context === null) {
    throw "'useBottomSheetInternal' cannot be used out of the BottomSheet!";
  }

  return context;
}
