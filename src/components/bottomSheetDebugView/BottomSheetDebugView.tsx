import React from 'react';
import { View } from 'react-native';
import Animated, { concat } from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import { styles } from './styles';

interface BottomSheetDebugViewProps {
  values: Record<string, Animated.Value<number> | Animated.Node<number>>;
}

const BottomSheetDebugView = ({ values }: BottomSheetDebugViewProps) => {
  return (
    <View pointerEvents="none" style={styles.container}>
      {Object.keys(values).map(key => (
        <ReText
          key={`item-${key}`}
          style={styles.text}
          text={concat(`${key}: `, values[key])}
        />
      ))}
    </View>
  );
};

export default BottomSheetDebugView;
