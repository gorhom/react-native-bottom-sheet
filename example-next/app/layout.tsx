import React from 'react';
import { Provider } from './Provider';

export const metadata = {
  title: 'BottomSheetExample',
  description: 'Example app for @gorhom/bottom-sheet',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
