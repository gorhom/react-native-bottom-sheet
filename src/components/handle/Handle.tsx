import React, { memo } from 'react';
import { View } from 'react-native';
import isEqual from 'lodash.isequal';
import { styles } from './styles';

const BottomSheetHandleComponent = () => {
  return (
    <>
      <View pointerEvents="none" style={styles.shadow} />
      <View style={styles.container}>
        <View style={styles.indicator} />
      </View>
    </>
  );
};

const BottomSheetHandle = memo(BottomSheetHandleComponent, isEqual);

export default BottomSheetHandle;
