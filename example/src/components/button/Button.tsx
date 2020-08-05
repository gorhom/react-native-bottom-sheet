import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
  label: string;
  style?: ViewStyle;
  onPress: () => void;
}

const Button = ({ label, style, onPress }: ButtonProps) => {
  // styles
  const containerStyle = useMemo(() => [styles.container, style], [style]);

  // render
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  label: {
    color: 'white',
  },
});

export default Button;
