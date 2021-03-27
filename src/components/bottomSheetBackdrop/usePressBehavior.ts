import { useCallback, useEffect, useMemo } from 'react';
import { useBottomSheet } from '../../hooks';
import { DEFAULT_PRESS_BEHAVIOR } from './constants';
import type {
  BackdropPressBehavior,
  BottomSheetDefaultBackdropProps,
} from './types';

export const usePressBehavior = ({
  closeOnPress,
  disappearsOnIndex,
  pressBehavior,
}: Pick<
  BottomSheetDefaultBackdropProps,
  'closeOnPress' | 'disappearsOnIndex' | 'pressBehavior'
>) => {
  //#region hooks
  const { snapTo, close } = useBottomSheet();
  //#endregion

  //#region variables
  const syntheticPressBehavior = useMemo<BackdropPressBehavior>(() => {
    if (typeof closeOnPress === 'boolean') {
      return closeOnPress ? 'close' : 'none';
    }
    if (closeOnPress === -1) {
      return 'close';
    }
    if (closeOnPress === disappearsOnIndex) {
      return 'collapse';
    }
    return pressBehavior ?? DEFAULT_PRESS_BEHAVIOR;
  }, [pressBehavior, closeOnPress, disappearsOnIndex]);
  const handleOnPress = useCallback(() => {
    if (syntheticPressBehavior === 'close') {
      close();
    } else if (syntheticPressBehavior === 'collapse') {
      snapTo(disappearsOnIndex as number);
    } else if (typeof syntheticPressBehavior === 'number') {
      snapTo(syntheticPressBehavior);
    }
  }, [close, disappearsOnIndex, syntheticPressBehavior, snapTo]);
  //#endregion

  //#region effects
  __DEV__ &&
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (closeOnPress != null && pressBehavior != null) {
        console.warn(
          'BottomSheetBackdrop: you should never define both closeOnPress and pressBehavior. closeOnPress will take precedence.'
        );
      }
    }, [closeOnPress, pressBehavior]);
  //#endregion
  return {
    handleOnPress,
    syntheticPressBehavior,
  };
};
