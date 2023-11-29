import React, { memo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';

const BottomSheetBackgroundComponent = ({
  pointerEvents,
  style
}) => /*#__PURE__*/React.createElement(View, {
  pointerEvents: pointerEvents,
  accessible: true,
  accessibilityRole: "adjustable",
  accessibilityLabel: "Bottom Sheet",
  style: [styles.container, style]
});

const BottomSheetBackground = /*#__PURE__*/memo(BottomSheetBackgroundComponent);
BottomSheetBackground.displayName = 'BottomSheetBackground';
export default BottomSheetBackground;
//# sourceMappingURL=BottomSheetBackground.js.map