import React, { useMemo } from 'react';
import {
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  Platform,
} from 'react-native';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { useAppearance } from '../../hooks';

interface ButtonProps {
  label: string;
  labelColor?: string[];
  labelStyle?: TextStyle;
  containerColor?: string[];
  style?: ViewStyle;
  onPress?: () => void;
}

const Button = ({
  label,
  labelColor,
  labelStyle: _labelStyle,
  containerColor,
  style,
  onPress,
}: ButtonProps) => {
  // hooks
  const { appearance } = useAppearance();

  // styles
  const containerStyle = useMemo(
    () => [
      styles.container,
      style,
      containerColor && {
        backgroundColor:
          appearance === 'light' ? containerColor[0] : containerColor[1],
      },
    ],
    [style, containerColor, appearance]
  );
  const labelStyle = useMemo(
    () => [
      styles.label,
      _labelStyle,
      labelColor && {
        color: appearance === 'light' ? labelColor[0] : labelColor[1],
      },
    ],
    [_labelStyle, labelColor, appearance]
  );

  // render

  return Platform.OS === 'ios' ? (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Text style={labelStyle}>{label}</Text>
    </TouchableOpacity>
  ) : (
    <View style={containerStyle}>
      <TouchableOpacity onPress={onPress}>
        <Text style={labelStyle}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#333',
    overflow: 'hidden',
  },
  label: {
    color: 'white',
  },
});

export default Button;
