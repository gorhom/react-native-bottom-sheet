import React, { memo } from 'react';
import { View } from 'react-native';
import isEqual from 'lodash.isequal';
import { styles } from './styles';
import type { BottomSheetDefaultHandleProps } from './types';
import {
  DEFAULT_ACCESSIBLE,
  DEFAULT_ACCESSIBILITY_ROLE,
  DEFAULT_ACCESSIBILITY_LABEL,
  DEFAULT_ACCESSIBILITY_HINT,
} from './constants';

const BottomSheetHandleComponent = (props: BottomSheetDefaultHandleProps) => {
  const {
    accessible = DEFAULT_ACCESSIBLE,
    accessibilityRole = DEFAULT_ACCESSIBILITY_ROLE,
    accessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
    accessibilityHint = DEFAULT_ACCESSIBILITY_HINT,
    ...rest
  } = props;

  return (
    <View
      style={styles.container}
      accessible={accessible ?? undefined}
      accessibilityRole={accessibilityRole ?? undefined}
      accessibilityLabel={accessibilityLabel ?? undefined}
      accessibilityHint={accessibilityHint ?? undefined}
      {...rest}
    >
      <View style={styles.indicator} />
    </View>
  );
};

const BottomSheetHandle = memo(BottomSheetHandleComponent, isEqual);

export default BottomSheetHandle;
