"use strict";

import React, { memo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { jsx as _jsx } from "react/jsx-runtime";
const BottomSheetBackgroundComponent = ({
  pointerEvents,
  style
}) => /*#__PURE__*/_jsx(View, {
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