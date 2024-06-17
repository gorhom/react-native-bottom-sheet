import React, { memo, useCallback, useMemo, useRef } from 'react';
import { StatusBar, View } from 'react-native';
import { WINDOW_HEIGHT } from '../../constants';
import { print } from '../../utilities';
import { styles } from './styles';

function BottomSheetContainerComponent({
  containerHeight,
  containerOffset,
  topInset = 0,
  bottomInset = 0,
  shouldCalculateHeight = true,
  detached,
  style,
  children
}) {
  const containerRef = useRef(null); //#region styles

  const containerStyle = useMemo(() => [style, styles.container, {
    top: topInset,
    bottom: bottomInset,
    overflow: detached ? 'visible' : 'hidden'
  }], [style, detached, topInset, bottomInset]); //#endregion
  //#region callbacks

  const handleContainerLayout = useCallback(function handleContainerLayout({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) {
    var _containerRef$current;

    containerHeight.value = height;
    (_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : _containerRef$current.measure((_x, _y, _width, _height, _pageX, pageY) => {
      var _StatusBar$currentHei;

      if (!containerOffset.value) return;
      containerOffset.value = {
        top: pageY !== null && pageY !== void 0 ? pageY : 0,
        left: 0,
        right: 0,
        bottom: Math.max(0, WINDOW_HEIGHT - ((pageY !== null && pageY !== void 0 ? pageY : 0) + height + ((_StatusBar$currentHei = StatusBar.currentHeight) !== null && _StatusBar$currentHei !== void 0 ? _StatusBar$currentHei : 0)))
      };
    });
    print({
      component: BottomSheetContainer.displayName,
      method: 'handleContainerLayout',
      params: {
        height
      }
    });
  }, [containerHeight, containerOffset, containerRef]); //#endregion
  //#region render

  return /*#__PURE__*/React.createElement(View, {
    ref: containerRef,
    pointerEvents: "box-none",
    onLayout: shouldCalculateHeight ? handleContainerLayout : undefined,
    style: containerStyle,
    children: children
  }); //#endregion
}

const BottomSheetContainer = /*#__PURE__*/memo(BottomSheetContainerComponent);
BottomSheetContainer.displayName = 'BottomSheetContainer';
export default BottomSheetContainer;
//# sourceMappingURL=BottomSheetContainer.js.map