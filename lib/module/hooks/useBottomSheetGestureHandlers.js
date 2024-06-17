import { useContext } from 'react';
import { BottomSheetGestureHandlersContext } from '../contexts/gesture';
export const useBottomSheetGestureHandlers = () => {
  const context = useContext(BottomSheetGestureHandlersContext);

  if (context === null) {
    throw "'useBottomSheetGestureHandlers' cannot be used out of the BottomSheet!";
  }

  return context;
};
//# sourceMappingURL=useBottomSheetGestureHandlers.js.map