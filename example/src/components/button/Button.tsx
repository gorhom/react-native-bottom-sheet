import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { ShowcaseButton, ShowcaseLabel } from '@gorhom/showcase-template';

interface ButtonProps {
  label: string;
  labelStyle?: TextStyle;
  style?: ViewStyle;
  onPress: () => void;
}

const Button = ({ label, labelStyle, style, onPress }: ButtonProps) => {
  // render
  return (
    <ShowcaseButton containerStyle={style} onPress={onPress}>
      <ShowcaseLabel style={labelStyle}>{label}</ShowcaseLabel>
    </ShowcaseButton>
  );
};

export default Button;
