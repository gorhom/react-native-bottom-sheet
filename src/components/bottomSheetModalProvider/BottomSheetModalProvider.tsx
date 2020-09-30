import React, { useMemo, useRef } from 'react';
import { BottomSheetModalProvider } from '../../contexts';
import BottomSheetModalContainer from '../bottomSheetModalContainer';
import type { BottomSheetModalProviderProps } from './types';

const BottomSheetModalProviderWrapper = (
  props: BottomSheetModalProviderProps
) => {
  // extract props
  const { children } = props;

  //#region refs
  const containerRef = useRef<BottomSheetModalContainer>(null);
  //#endregion

  //#region variables
  const contextVariables = useMemo(
    () => ({
      present: (...args: any[]) => {
        if (containerRef.current?.present) {
          // @ts-ignore
          containerRef.current?.present(...args);
        }
      },
      dismiss: (...args: any[]) => {
        if (containerRef.current?.dismiss) {
          // @ts-ignore
          containerRef.current?.dismiss(...args);
        }
      },
      dismissAll: (...args: any[]) => {
        if (containerRef.current?.dismissAll) {
          // @ts-ignore
          containerRef.current?.dismissAll(...args);
        }
      },
      snapTo: (...args: any[]) => {
        if (containerRef.current?.snapTo) {
          // @ts-ignore
          containerRef.current?.snapTo(...args);
        }
      },
      expand: (...args: any[]) => {
        if (containerRef.current?.expand) {
          // @ts-ignore
          containerRef.current?.expand(...args);
        }
      },
      collapse: (...args: any[]) => {
        if (containerRef.current?.collapse) {
          // @ts-ignore
          containerRef.current?.collapse(...args);
        }
      },
    }),
    []
  );
  //#endregion

  //#region renders
  return (
    <BottomSheetModalProvider value={contextVariables}>
      {children}
      <BottomSheetModalContainer ref={containerRef} />
    </BottomSheetModalProvider>
  );
  //#endregion
};

export default BottomSheetModalProviderWrapper;
