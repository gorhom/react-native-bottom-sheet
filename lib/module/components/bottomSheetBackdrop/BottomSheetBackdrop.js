import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Animated, { interpolate, Extrapolate, useAnimatedStyle, useAnimatedReaction, useAnimatedGestureHandler, runOnJS } from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { useBottomSheet } from '../../hooks';
import { DEFAULT_OPACITY, DEFAULT_APPEARS_ON_INDEX, DEFAULT_DISAPPEARS_ON_INDEX, DEFAULT_ENABLE_TOUCH_THROUGH, DEFAULT_PRESS_BEHAVIOR, DEFAULT_ACCESSIBLE, DEFAULT_ACCESSIBILITY_ROLE, DEFAULT_ACCESSIBILITY_LABEL, DEFAULT_ACCESSIBILITY_HINT } from './constants';
import { styles } from './styles';

const BottomSheetBackdropComponent = ({
  animatedIndex,
  opacity: _providedOpacity,
  appearsOnIndex: _providedAppearsOnIndex,
  disappearsOnIndex: _providedDisappearsOnIndex,
  enableTouchThrough: _providedEnableTouchThrough,
  pressBehavior = DEFAULT_PRESS_BEHAVIOR,
  onPress,
  style,
  children,
  accessible: _providedAccessible = DEFAULT_ACCESSIBLE,
  accessibilityRole: _providedAccessibilityRole = DEFAULT_ACCESSIBILITY_ROLE,
  accessibilityLabel: _providedAccessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
  accessibilityHint: _providedAccessibilityHint = DEFAULT_ACCESSIBILITY_HINT
}) => {
  //#region hooks
  const {
    snapToIndex,
    close
  } = useBottomSheet();
  const isMounted = useRef(false); //#endregion
  //#region defaults

  const opacity = _providedOpacity !== null && _providedOpacity !== void 0 ? _providedOpacity : DEFAULT_OPACITY;
  const appearsOnIndex = _providedAppearsOnIndex !== null && _providedAppearsOnIndex !== void 0 ? _providedAppearsOnIndex : DEFAULT_APPEARS_ON_INDEX;
  const disappearsOnIndex = _providedDisappearsOnIndex !== null && _providedDisappearsOnIndex !== void 0 ? _providedDisappearsOnIndex : DEFAULT_DISAPPEARS_ON_INDEX;
  const enableTouchThrough = _providedEnableTouchThrough !== null && _providedEnableTouchThrough !== void 0 ? _providedEnableTouchThrough : DEFAULT_ENABLE_TOUCH_THROUGH; //#endregion
  //#region variables

  const [pointerEvents, setPointerEvents] = useState(enableTouchThrough ? 'none' : 'auto'); //#endregion
  //#region callbacks

  const handleOnPress = useCallback(() => {
    onPress === null || onPress === void 0 ? void 0 : onPress();

    if (pressBehavior === 'close') {
      close();
    } else if (pressBehavior === 'collapse') {
      snapToIndex(disappearsOnIndex);
    } else if (typeof pressBehavior === 'number') {
      snapToIndex(pressBehavior);
    }
  }, [snapToIndex, close, disappearsOnIndex, pressBehavior, onPress]);
  const handleContainerTouchability = useCallback(shouldDisableTouchability => {
    isMounted.current && setPointerEvents(shouldDisableTouchability ? 'none' : 'auto');
  }, []); //#endregion
  //#region tap gesture

  const gestureHandler = useAnimatedGestureHandler({
    onFinish: () => {
      runOnJS(handleOnPress)();
    }
  }, [handleOnPress]); //#endregion
  //#region styles

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, disappearsOnIndex, appearsOnIndex], [0, 0, opacity], Extrapolate.CLAMP),
    flex: 1
  }));
  const containerStyle = useMemo(() => [styles.container, style, containerAnimatedStyle], [style, containerAnimatedStyle]); //#endregion
  //#region effects

  useAnimatedReaction(() => animatedIndex.value <= disappearsOnIndex, (shouldDisableTouchability, previous) => {
    if (shouldDisableTouchability === previous) {
      return;
    }

    runOnJS(handleContainerTouchability)(shouldDisableTouchability);
  }, [disappearsOnIndex]); // addressing updating the state after unmounting.
  // [link](https://github.com/gorhom/react-native-bottom-sheet/issues/1376)

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []); //#endregion

  const AnimatedView = /*#__PURE__*/React.createElement(Animated.View, {
    style: containerStyle,
    pointerEvents: pointerEvents,
    accessible: _providedAccessible !== null && _providedAccessible !== void 0 ? _providedAccessible : undefined,
    accessibilityRole: _providedAccessibilityRole !== null && _providedAccessibilityRole !== void 0 ? _providedAccessibilityRole : undefined,
    accessibilityLabel: _providedAccessibilityLabel !== null && _providedAccessibilityLabel !== void 0 ? _providedAccessibilityLabel : undefined,
    accessibilityHint: _providedAccessibilityHint ? _providedAccessibilityHint : `Tap to ${typeof pressBehavior === 'string' ? pressBehavior : 'move'} the Bottom Sheet`
  }, children);
  return pressBehavior !== 'none' ? /*#__PURE__*/React.createElement(TapGestureHandler, {
    onGestureEvent: gestureHandler
  }, AnimatedView) : AnimatedView;
};

const BottomSheetBackdrop = /*#__PURE__*/memo(BottomSheetBackdropComponent);
BottomSheetBackdrop.displayName = 'BottomSheetBackdrop';
export default BottomSheetBackdrop;
//# sourceMappingURL=BottomSheetBackdrop.js.map