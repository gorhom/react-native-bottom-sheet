import React from 'react';
import { TextStyle, TextProps as RNTextProps } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { TextInput } from 'react-native-gesture-handler';

interface TextProps {
  text: string;
  value: Animated.SharedValue<number>;
  style?: Animated.AnimateProps<TextStyle, RNTextProps>['style'];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ReText = (props: TextProps) => {
  const { text, value, style } = { style: {}, ...props };
  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${text}: ${value.value.toFixed(2)}`,
    };
  });
  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={`${text}: ${value.value.toFixed(2)}`}
      style={style}
      animatedProps={animatedProps}
    />
  );
};

export default ReText;
