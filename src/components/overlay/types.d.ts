import type Animated from 'react-native-reanimated';

export interface BottomSheetOverlayProps {
  color?: string;
  animatedOpacity: Animated.Node<number>;
  onPress?: () => void;
}
