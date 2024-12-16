"use strict";

import React, { memo } from 'react';
import { styles } from './styles';
import { jsx as _jsx } from "react/jsx-runtime";
const BottomSheetBackdropContainerComponent = ({
  animatedIndex,
  animatedPosition,
  backdropComponent: BackdropComponent
}) => {
  return BackdropComponent ? /*#__PURE__*/_jsx(BackdropComponent, {
    animatedIndex: animatedIndex,
    animatedPosition: animatedPosition,
    style: styles.container
  }) : null;
};
const BottomSheetBackdropContainer = /*#__PURE__*/memo(BottomSheetBackdropContainerComponent);
BottomSheetBackdropContainer.displayName = 'BottomSheetBackdropContainer';
export default BottomSheetBackdropContainer;
//# sourceMappingURL=BottomSheetBackdropContainer.js.map