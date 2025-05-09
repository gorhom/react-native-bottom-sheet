import React from 'react';
import { type TextProps as RNTextProps, TextInput } from 'react-native';
import Animated, {
  type SharedValue,
  type AnimatedProps,
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';

interface TextProps {
  text: string;
  value: SharedValue<number | boolean> | number;
  style?: AnimatedProps<RNTextProps>['style'];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

Animated.addWhitelistedNativeProps({ text: true });

const ReText = (props: TextProps) => {
  const { text, value: _providedValue, style } = { style: {}, ...props };
  const providedValue = useDerivedValue(
    () =>
      typeof _providedValue === 'number'
        ? _providedValue
        : typeof _providedValue.value === 'number'
          ? _providedValue.value.toFixed(2)
          : _providedValue.value,
    [_providedValue]
  );
  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${text}: ${providedValue.value}`,
    };
  }, [text, providedValue]);
  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={`${text}: ${providedValue.value}`}
      style={style}
      // @ts-ignore
      animatedProps={animatedProps}
    />
  );
};

export default ReText;
