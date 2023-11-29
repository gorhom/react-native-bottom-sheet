import { useContext } from 'react';
import { BottomSheetModalContext } from '../contexts';
export const useBottomSheetModal = () => {
  const context = useContext(BottomSheetModalContext);

  if (context === null) {
    throw "'BottomSheetModalContext' cannot be null!";
  }

  return context;
};
//# sourceMappingURL=useBottomSheetModal.js.map