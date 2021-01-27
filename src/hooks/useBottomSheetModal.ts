import { useContext } from 'react';
import { BottomSheetModalContext } from '../contexts/modal/external';

export const useBottomSheetModal = () => useContext(BottomSheetModalContext);
