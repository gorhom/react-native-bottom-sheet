import React, { memo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';

// @ts-ignore
interface HandleProps {}

const HandleComponent = () => {
  return (
    <>
      <View pointerEvents="none" style={styles.shadow} />
      <View style={styles.container}>
        <View style={styles.indicator} />
      </View>
    </>
  );
};

const Handle = memo(HandleComponent);

export default Handle;
