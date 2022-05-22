import React, { memo } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { ShowcaseButton, ShowcaseLabel } from '@gorhom/showcase-template';

interface ButtonProps {
  label: string;
  labelStyle?: TextStyle;
  style?: ViewStyle;
  onPress: () => void;
}

const ButtonComponent = ({
  label,
  labelStyle,
  style,
  onPress,
}: ButtonProps) => (
  <ShowcaseButton containerStyle={style} onPress={onPress}>
    <ShowcaseLabel style={labelStyle}>{label}</ShowcaseLabel>
  </ShowcaseButton>
);

export const Button = memo(ButtonComponent);
