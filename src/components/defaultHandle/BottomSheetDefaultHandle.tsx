import React, { memo } from 'react';
import { View } from 'react-native';
import isEqual from 'lodash.isequal';
import { styles } from './styles';

const BottomSheetDefaultHandleComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
    </View>
  );
};

const BottomSheetDefaultHandle = memo(
  BottomSheetDefaultHandleComponent,
  isEqual
);

export default BottomSheetDefaultHandle;
