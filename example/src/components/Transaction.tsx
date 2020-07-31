import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ListItemData } from '../utils';

const Transaction = ({ title, subtitle }: ListItemData) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  container: {
    padding: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
});
