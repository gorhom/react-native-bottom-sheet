"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGestureHandler = void 0;

var _reactNativeReanimated = require("react-native-reanimated");

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _constants = require("../constants");

const resetContext = context => {
  'worklet';

  Object.keys(context).map(key => {
    context[key] = undefined;
  });
};

const useGestureHandler = (type, state, gestureSource, handleOnStart, handleOnActive, handleOnEnd) => {
  const gestureHandler = (0, _reactNativeReanimated.useAnimatedGestureHandler)({
    onActive: (payload, context) => {
      if (!context.didStart) {
        context.didStart = true;
        state.value = _reactNativeGestureHandler.State.BEGAN;
        gestureSource.value = type;
        handleOnStart(type, payload, context);
        return;
      }

      if (gestureSource.value !== type) {
        return;
      }

      state.value = payload.state;
      handleOnActive(type, payload, context);
    },
    onEnd: (payload, context) => {
      if (gestureSource.value !== type) {
        return;
      }

      state.value = payload.state;
      gestureSource.value = _constants.GESTURE_SOURCE.UNDETERMINED;
      handleOnEnd(type, payload, context);
      resetContext(context);
    },
    onCancel: (payload, context) => {
      if (gestureSource.value !== type) {
        return;
      }

      state.value = payload.state;
      gestureSource.value = _constants.GESTURE_SOURCE.UNDETERMINED;
      resetContext(context);
    },
    onFail: (payload, context) => {
      if (gestureSource.value !== type) {
        return;
      }

      state.value = payload.state;
      gestureSource.value = _constants.GESTURE_SOURCE.UNDETERMINED;
      resetContext(context);
    },
    onFinish: (payload, context) => {
      if (gestureSource.value !== type) {
        return;
      }

      state.value = payload.state;
      gestureSource.value = _constants.GESTURE_SOURCE.UNDETERMINED;
      resetContext(context);
    }
  }, [type, state, handleOnStart, handleOnActive, handleOnEnd]);
  return gestureHandler;
};

exports.useGestureHandler = useGestureHandler;
//# sourceMappingURL=useGestureHandler.js.map