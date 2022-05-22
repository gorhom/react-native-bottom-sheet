import React, { FC } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export const withModalProvider = (Component: FC) => () =>
  (
    <BottomSheetModalProvider>
      <Component />
    </BottomSheetModalProvider>
  );
