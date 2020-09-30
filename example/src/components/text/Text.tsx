import React, { memo, useMemo } from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import { useAppearance } from '../../hooks';

interface TextProps {
  color?: string[];
  style?: TextStyle;
  children: string;
}

const TextComponent = ({
  color = ['black', 'white'],
  style,
  children,
}: TextProps) => {
  // hooks
  const { appearance } = useAppearance();

  // styles
  const textStyle = useMemo(
    () => [
      style,
      {
        color: color[appearance === 'light' ? 0 : 1],
      },
    ],
    [appearance, style, color]
  );

  // render
  return <RNText style={textStyle}>{children}</RNText>;
};

const Text = memo(TextComponent);

export default Text;
