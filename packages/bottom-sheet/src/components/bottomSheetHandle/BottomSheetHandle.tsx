import React, { memo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';

const BottomSheetHandleComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
    </View>
  );
};

const BottomSheetHandle = memo(BottomSheetHandleComponent);
BottomSheetHandle.displayName = 'BottomSheetHandle';

export default BottomSheetHandle;
