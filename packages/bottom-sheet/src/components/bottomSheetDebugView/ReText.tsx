import React from 'react';
import { TextProps as RNTextProps, TextInput } from 'react-native';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';

interface TextProps {
  text: string;
  value: Animated.SharedValue<number | boolean> | number;
  style?: Animated.AnimateProps<RNTextProps>['style'];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ReText = (props: TextProps) => {
  const { text, value: _providedValue, style } = { style: {}, ...props };
  const providedValue = useDerivedValue(() =>
    typeof _providedValue === 'number'
      ? _providedValue
      : typeof _providedValue.value === 'number'
      ? _providedValue.value.toFixed(2)
      : _providedValue.value
  );
  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${text}: ${providedValue.value}`,
    };
  }, [providedValue]);
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
