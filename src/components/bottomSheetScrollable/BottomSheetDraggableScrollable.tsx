import React from 'react';
import {
  GestureDetector,
  type SimultaneousGesture,
} from 'react-native-gesture-handler';

interface BottomSheetDraggableScrollableProps {
  scrollableGesture?: SimultaneousGesture;
  children: React.ReactNode;
}

export function BottomSheetDraggableScrollable({
  scrollableGesture,
  children,
}: BottomSheetDraggableScrollableProps) {
  if (scrollableGesture) {
    return (
      <GestureDetector gesture={scrollableGesture}>{children}</GestureDetector>
    );
  }

  return children;
}
