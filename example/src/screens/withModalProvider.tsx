import React, { FC } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const withModalProvider = (Component: FC) => () =>
  (
    <BottomSheetModalProvider>
      <Component />
    </BottomSheetModalProvider>
  );

export default withModalProvider;
