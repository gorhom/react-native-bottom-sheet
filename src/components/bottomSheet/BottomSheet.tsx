// ... (previous imports and code)

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>(
  function BottomSheet(props, ref) {
    // ... (previous code)

    /**
     * Reaction to the keyboard state change.
     *
     * @alias OnKeyboardStateChange
     */
    useAnimatedReaction(
      () => ({
        _keyboardState: animatedKeyboardState.value,
        _keyboardHeight: animatedKeyboardHeight.value,
      }),
      (result, _previousResult) => {
        const { _keyboardState, _keyboardHeight } = result;
        const _previousKeyboardState = _previousResult?._keyboardState;
        const _previousKeyboardHeight = _previousResult?._keyboardHeight;

        if (
          _keyboardState === _previousKeyboardState &&
          _keyboardHeight === _previousKeyboardHeight
        ) {
          return;
        }

        if (_keyboardState === KEYBOARD_STATE.UNDETERMINED) {
          return;
        }

        if (
          _keyboardState === KEYBOARD_STATE.HIDDEN &&
          animatedAnimationState.value === ANIMATION_STATE.RUNNING &&
          animatedAnimationSource.value === ANIMATION_SOURCE.GESTURE
        ) {
          return;
        }

        if (__DEV__) {
          runOnJS(print)({
            component: BottomSheet.name,
            method: 'useAnimatedReaction::OnKeyboardStateChange',
            category: 'effect',
            params: {
              keyboardState: _keyboardState,
              keyboardHeight: _keyboardHeight,
            },
          });
        }

        animatedKeyboardHeightInContainer.value =
          _keyboardHeight === 0
            ? 0
            : $modal
            ? Math.abs(
                _keyboardHeight -
                  Math.abs(bottomInset - animatedContainerOffset.value.bottom)
              )
            : Math.abs(
                _keyboardHeight - animatedContainerOffset.value.bottom
              );

        if (
          Platform.OS === 'android' &&
          android_keyboardInputMode === KEYBOARD_INPUT_MODE.adjustResize
        ) {
          animatedKeyboardHeightInContainer.value = 0;

          if (keyboardBehavior === KEYBOARD_BEHAVIOR.interactive) {
            return;
          }
        }

        const hasActiveGesture =
          animatedContentGestureState.value === State.ACTIVE ||
          animatedContentGestureState.value === State.BEGAN ||
          animatedHandleGestureState.value === State.ACTIVE ||
          animatedHandleGestureState.value === State.BEGAN;
        if (hasActiveGesture) {
          return;
        }

        if (
          _keyboardState === KEYBOARD_STATE.HIDDEN &&
          keyboardBlurBehavior === KEYBOARD_BLUR_BEHAVIOR.none
        ) {
          return;
        }

        const animationConfigs = getKeyboardAnimationConfigs(
          keyboardAnimationEasing.value,
          keyboardAnimationDuration.value
        );

        evaluatePosition(ANIMATION_SOURCE.KEYBOARD, animationConfigs);
      },
      [
        $modal,
        bottomInset,
        keyboardBehavior,
        keyboardBlurBehavior,
        android_keyboardInputMode,
        animatedContainerOffset,
        getEvaluatedPosition,
      ]
    );

    // ... (rest of the component code)
  }
);

// ... (rest of the file)
