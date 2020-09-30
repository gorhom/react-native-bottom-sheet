import type Animated from 'react-native-reanimated';
import type { ViewProps } from 'react-native';

export interface BottomSheetOverlayProps
  extends Pick<ViewProps, 'pointerEvents'> {
  color?: string;
  animatedOpacity: Animated.Node<number>;
  onPress?: () => void;
}
