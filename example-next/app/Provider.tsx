// @ts-nocheck
'use client';

import React, { useRef } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export function Provider({ children }: { children: React.ReactNode }) {
  const isServerInserted = useRef(false);

  useServerInsertedHTML(() => {
    if (isServerInserted.current) {
      return;
    }
    isServerInserted.current = true;
    const sheet = StyleSheet.getSheet();
    return (
      <style
        dangerouslySetInnerHTML={{ __html: sheet.textContent }}
        id={sheet.id}
      />
    );
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
});
