"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _hooks = require("../../hooks");

var _constants = require("./constants");

var _styles = require("./styles");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const BottomSheetBackdropComponent = ({
  animatedIndex,
  opacity: _providedOpacity,
  appearsOnIndex: _providedAppearsOnIndex,
  disappearsOnIndex: _providedDisappearsOnIndex,
  enableTouchThrough: _providedEnableTouchThrough,
  pressBehavior = _constants.DEFAULT_PRESS_BEHAVIOR,
  onPress,
  style,
  children,
  accessible: _providedAccessible = _constants.DEFAULT_ACCESSIBLE,
  accessibilityRole: _providedAccessibilityRole = _constants.DEFAULT_ACCESSIBILITY_ROLE,
  accessibilityLabel: _providedAccessibilityLabel = _constants.DEFAULT_ACCESSIBILITY_LABEL,
  accessibilityHint: _providedAccessibilityHint = _constants.DEFAULT_ACCESSIBILITY_HINT
}) => {
  //#region hooks
  const {
    snapToIndex,
    close
  } = (0, _hooks.useBottomSheet)();
  const isMounted = (0, _react.useRef)(false); //#endregion
  //#region defaults

  const opacity = _providedOpacity !== null && _providedOpacity !== void 0 ? _providedOpacity : _constants.DEFAULT_OPACITY;
  const appearsOnIndex = _providedAppearsOnIndex !== null && _providedAppearsOnIndex !== void 0 ? _providedAppearsOnIndex : _constants.DEFAULT_APPEARS_ON_INDEX;
  const disappearsOnIndex = _providedDisappearsOnIndex !== null && _providedDisappearsOnIndex !== void 0 ? _providedDisappearsOnIndex : _constants.DEFAULT_DISAPPEARS_ON_INDEX;
  const enableTouchThrough = _providedEnableTouchThrough !== null && _providedEnableTouchThrough !== void 0 ? _providedEnableTouchThrough : _constants.DEFAULT_ENABLE_TOUCH_THROUGH; //#endregion
  //#region variables

  const [pointerEvents, setPointerEvents] = (0, _react.useState)(enableTouchThrough ? 'none' : 'auto'); //#endregion
  //#region callbacks

  const handleOnPress = (0, _react.useCallback)(() => {
    onPress === null || onPress === void 0 ? void 0 : onPress();

    if (pressBehavior === 'close') {
      close();
    } else if (pressBehavior === 'collapse') {
      snapToIndex(disappearsOnIndex);
    } else if (typeof pressBehavior === 'number') {
      snapToIndex(pressBehavior);
    }
  }, [snapToIndex, close, disappearsOnIndex, pressBehavior, onPress]);
  const handleContainerTouchability = (0, _react.useCallback)(shouldDisableTouchability => {
    isMounted.current && setPointerEvents(shouldDisableTouchability ? 'none' : 'auto');
  }, []); //#endregion
  //#region tap gesture

  const gestureHandler = (0, _reactNativeReanimated.useAnimatedGestureHandler)({
    onFinish: () => {
      (0, _reactNativeReanimated.runOnJS)(handleOnPress)();
    }
  }, [handleOnPress]); //#endregion
  //#region styles

  const containerAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: (0, _reactNativeReanimated.interpolate)(animatedIndex.value, [-1, disappearsOnIndex, appearsOnIndex], [0, 0, opacity], _reactNativeReanimated.Extrapolate.CLAMP),
    flex: 1
  }));
  const containerStyle = (0, _react.useMemo)(() => [_styles.styles.container, style, containerAnimatedStyle], [style, containerAnimatedStyle]); //#endregion
  //#region effects

  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedIndex.value <= disappearsOnIndex, (shouldDisableTouchability, previous) => {
    if (shouldDisableTouchability === previous) {
      return;
    }

    (0, _reactNativeReanimated.runOnJS)(handleContainerTouchability)(shouldDisableTouchability);
  }, [disappearsOnIndex]); // addressing updating the state after unmounting.
  // [link](https://github.com/gorhom/react-native-bottom-sheet/issues/1376)

  (0, _react.useEffect)(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []); //#endregion

  const AnimatedView = /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: containerStyle,
    pointerEvents: pointerEvents,
    accessible: _providedAccessible !== null && _providedAccessible !== void 0 ? _providedAccessible : undefined,
    accessibilityRole: _providedAccessibilityRole !== null && _providedAccessibilityRole !== void 0 ? _providedAccessibilityRole : undefined,
    accessibilityLabel: _providedAccessibilityLabel !== null && _providedAccessibilityLabel !== void 0 ? _providedAccessibilityLabel : undefined,
    accessibilityHint: _providedAccessibilityHint ? _providedAccessibilityHint : `Tap to ${typeof pressBehavior === 'string' ? pressBehavior : 'move'} the Bottom Sheet`
  }, children);

  return pressBehavior !== 'none' ? /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.TapGestureHandler, {
    onGestureEvent: gestureHandler
  }, AnimatedView) : AnimatedView;
};

const BottomSheetBackdrop = /*#__PURE__*/(0, _react.memo)(BottomSheetBackdropComponent);
BottomSheetBackdrop.displayName = 'BottomSheetBackdrop';
var _default = BottomSheetBackdrop;
exports.default = _default;
//# sourceMappingURL=BottomSheetBackdrop.js.map