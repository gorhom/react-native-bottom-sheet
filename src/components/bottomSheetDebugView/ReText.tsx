import React from 'react';
import { TextStyle, TextProps as RNTextProps } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { TextInput } from 'react-native-gesture-handler';

interface TextProps {
  text: string;
  value: Animated.SharedValue<number>;
  style?: Animated.AnimateProps<TextStyle, RNTextProps>['style'];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ReText = (props: TextProps) => {
  const { text, value: _providedValue, style } = { style: {}, ...props };
  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${text}: ${_providedValue.value.toFixed(2)}`,
    };
  }, [_providedValue.value]);

  useAnimatedReaction(
    () => _providedValue.value,
    _value => {
      console.log(text, _value);
    }
  );
  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={`${text}: ${_providedValue.value.toFixed(2)}`}
      style={style}
      // @ts-ignore
      animatedProps={animatedProps}
    />
  );
};

export default ReText;
