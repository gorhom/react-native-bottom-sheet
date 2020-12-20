import { useContext } from 'react';
import { BottomSheetModalContext } from '../contexts';

export const useBottomSheetModal = () => useContext(BottomSheetModalContext);
