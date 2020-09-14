import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import ReText from './ReText';
import { styles } from './styles';

interface DebugViewProps {
  values: Record<string, Animated.SharedValue<number>>;
}

const DebugView = ({ values }: DebugViewProps) => {
  return (
    <View style={styles.container}>
      {Object.entries(values).map(([key, value]) => (
        <ReText key={key} text={key} value={value} style={styles.text} />
      ))}
    </View>
  );
};

export default DebugView;
