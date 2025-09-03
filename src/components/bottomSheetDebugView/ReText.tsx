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
  value: SharedValue<number | boolean | object> | number;
  style?: AnimatedProps<RNTextProps>['style'];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

Animated.addWhitelistedNativeProps({ text: true });

const ReText = ({ text, value: _providedValue, style }: TextProps) => {
  const providedValue = useDerivedValue(() => {
    if (!_providedValue) {
      return '';
    }

    let rawValue: number | string | object | boolean = '';
    if (typeof _providedValue === 'number') {
      rawValue = _providedValue as number;
    } else if (typeof _providedValue.get === 'function') {
      rawValue = _providedValue.get();
    }

    if (typeof rawValue === 'object') {
      const rawValueObject = Object.entries(rawValue)
        .map(item => `${item[0]}: ${item[1]}`)
        .reduce((result, current, index) => {
          if (index !== 0) {
            result = `${result} \n`;
          }

          result = `${result}- ${current}`;
          return result;
        }, '');

      return `${text}\n${rawValueObject}`;
    }

    if (typeof rawValue === 'number') {
      rawValue = rawValue.toFixed(2);
    }

    return `${text}: ${rawValue}`;
  }, [text, _providedValue]);
  const animatedProps = useAnimatedProps(() => {
    return {
      text: providedValue.get(),
    };
  }, [providedValue]);
  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={providedValue?.get() ?? ''}
      style={style}
      // @ts-ignore
      animatedProps={animatedProps}
      multiline={true}
    />
  );
};

export default ReText;
