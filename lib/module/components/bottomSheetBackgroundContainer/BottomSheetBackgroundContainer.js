"use strict";

import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheetBackground from '../bottomSheetBackground';
import { styles } from './styles';
import { jsx as _jsx } from "react/jsx-runtime";
const BottomSheetBackgroundContainerComponent = ({
  animatedIndex,
  animatedPosition,
  backgroundComponent: _providedBackgroundComponent,
  backgroundStyle: _providedBackgroundStyle
}) => {
  const BackgroundComponent = _providedBackgroundComponent || BottomSheetBackground;
  const backgroundStyle = useMemo(() => StyleSheet.flatten([styles.container, _providedBackgroundStyle]), [_providedBackgroundStyle]);
  return _providedBackgroundComponent === null ? null : /*#__PURE__*/_jsx(BackgroundComponent, {
    pointerEvents: "none",
    animatedIndex: animatedIndex,
    animatedPosition: animatedPosition,
    style: backgroundStyle
  });
};
const BottomSheetBackgroundContainer = /*#__PURE__*/memo(BottomSheetBackgroundContainerComponent);
BottomSheetBackgroundContainer.displayName = 'BottomSheetBackgroundContainer';
export default BottomSheetBackgroundContainer;
//# sourceMappingURL=BottomSheetBackgroundContainer.js.map