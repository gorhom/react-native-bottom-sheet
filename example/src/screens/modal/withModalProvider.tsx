import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { type FC } from 'react';

export const withModalProvider = (Component: FC) => () => (
  <BottomSheetModalProvider>
    <Component />
  </BottomSheetModalProvider>
);
