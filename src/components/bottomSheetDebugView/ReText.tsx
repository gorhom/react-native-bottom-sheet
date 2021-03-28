import React from 'react';
import { TextProps as RNTextProps, TextInput } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';

interface TextProps {
  text: string;
  value: Animated.SharedValue<number | boolean>;
  style?: Animated.AnimateProps<RNTextProps>['style'];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ReText = (props: TextProps) => {
  const { text, value: _providedValue, style } = { style: {}, ...props };
  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${text}: ${
        typeof _providedValue.value === 'number'
          ? _providedValue.value.toFixed(2)
          : _providedValue.value
      }`,
    };
  }, [_providedValue.value]);
  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={`${text}: ${
        typeof _providedValue.value === 'number'
          ? _providedValue.value.toFixed(2)
          : _providedValue.value
      }`}
      style={style}
      // @ts-ignore
      animatedProps={animatedProps}
    />
  );
};

export default ReText;
