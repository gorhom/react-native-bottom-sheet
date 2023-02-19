import React, { useRef } from 'react';
import { TextProps as RNTextProps, TextInput } from 'react-native';
import Animated, {
  useAnimatedReaction,
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
  const textRef = useRef<TextInput>(null);

  const providedValue = useDerivedValue(() => {
    const value =
      typeof _providedValue === 'number'
        ? _providedValue
        : typeof _providedValue.value === 'number'
        ? _providedValue.value.toFixed(2)
        : _providedValue.value;

    return `${text}: ${value}`;
  });

  //region effects
  useAnimatedReaction(
    () => providedValue.value,
    result => {
      textRef.current?.setNativeProps({
        text: result,
      });
    }
  );
  //endregion

  return (
    <AnimatedTextInput
      ref={textRef}
      underlineColorAndroid="transparent"
      editable={false}
      value={providedValue.value}
      style={style}
    />
  );
};

export default ReText;
