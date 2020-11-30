import { useMemo } from 'react';
import Animated, {
  eq,
  set,
  add,
  greaterOrEq,
  lessOrEq,
  and,
  not,
  clockRunning,
  startClock,
  timing,
  stopClock,
  multiply,
  neq,
  onChange,
  or,
  cond,
  block,
  call,
  // debug,
} from 'react-native-reanimated';
import { State } from 'react-native-gesture-handler';
import { useClock, useValue, snapPoint } from 'react-native-redash';
import { GESTURE } from '../../constants';
import { useReactiveValue, useReactiveValues } from '../../hooks';
import type { BottomSheetTransitionConfig } from './types';

export const useTransition = ({
  animationDuration,
  animationEasing,
  contentPanGestureState,
  contentPanGestureTranslationY,
  contentPanGestureVelocityY,
  handlePanGestureState,
  handlePanGestureTranslationY,
  handlePanGestureVelocityY,
  scrollableContentOffsetY,
  snapPoints: _snapPoints,
  initialPosition,
  onAnimate,
}: BottomSheetTransitionConfig) => {
  const currentGesture = useValue<GESTURE>(GESTURE.UNDETERMINED);
  const currentPosition = useReactiveValue(initialPosition);
  const snapPoints = useReactiveValues(_snapPoints);

  const isPanningContent = useMemo(
    () => eq(contentPanGestureState, State.ACTIVE),
    [contentPanGestureState]
  );
  const isPanningHandle = useMemo(
    () => eq(handlePanGestureState, State.ACTIVE),
    [handlePanGestureState]
  );
  const isPanning = useMemo(() => or(isPanningContent, isPanningHandle), [
    isPanningContent,
    isPanningHandle,
  ]);
  const shouldAnimate = useValue(0);
  const manualSnapToPoint = useValue<number>(-1);

  const clock = useClock();
  const config = useMemo(
    () => ({
      toValue: new Animated.Value(0),
      duration: animationDuration,
      easing: animationEasing,
    }),
    [animationEasing, animationDuration]
  );

  const animationState = useMemo(
    () => ({
      finished: new Animated.Value(0),
      position: new Animated.Value(initialPosition),
      frameTime: new Animated.Value(0),
      time: new Animated.Value(0),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const finishTiming = useMemo(
    () => [
      // debug('finish timing', config.toValue),
      set(currentGesture, GESTURE.UNDETERMINED),
      set(shouldAnimate, 0),
      set(currentPosition, config.toValue),
      set(animationState.frameTime, 0),
      set(animationState.time, 0),
      stopClock(clock),
    ],
    [
      animationState.frameTime,
      animationState.time,
      clock,
      config.toValue,
      currentGesture,
      currentPosition,
      shouldAnimate,
    ]
  );

  const translateY = useMemo(
    () =>
      cond(
        eq(currentGesture, GESTURE.CONTENT),
        cond(
          eq(currentPosition, snapPoints[snapPoints.length - 1]),
          add(
            contentPanGestureTranslationY,
            multiply(scrollableContentOffsetY, -1)
          ),
          contentPanGestureTranslationY
        ),
        handlePanGestureTranslationY
      ),
    [
      snapPoints,
      currentGesture,
      currentPosition,
      contentPanGestureTranslationY,
      handlePanGestureTranslationY,
      scrollableContentOffsetY,
    ]
  );
  const velocityY = useMemo(
    () =>
      cond(
        eq(currentGesture, GESTURE.CONTENT),
        contentPanGestureVelocityY,
        handlePanGestureVelocityY
      ),
    [contentPanGestureVelocityY, currentGesture, handlePanGestureVelocityY]
  );
  const isAnimationInterrupted = useMemo(
    () => and(clockRunning(clock), or(isPanning, neq(manualSnapToPoint, -1))),
    [clock, isPanning, manualSnapToPoint]
  );
  const position = useMemo(
    () =>
      block([
        // debug('current gesture', currentGesture),
        /**
         * In case animation get interrupted, we execute the finishTiming node and
         * set current position the the animated position.
         */
        cond(isAnimationInterrupted, [
          // // debug('animation interrupted', isAnimationInterrupted),
          finishTiming,
          set(currentPosition, animationState.position),
        ]),

        /**
         * Panning node
         */
        cond(isPanning, [
          set(
            currentGesture,
            cond(isPanningContent, GESTURE.CONTENT, GESTURE.HANDLE)
          ),
          // debug('start panning', translateY),
          cond(
            not(
              greaterOrEq(
                add(currentPosition, translateY),
                snapPoints[snapPoints.length - 1]
              )
            ),
            [
              set(animationState.position, snapPoints[snapPoints.length - 1]),
              set(animationState.finished, 0),
            ],
            cond(
              not(lessOrEq(add(currentPosition, translateY), snapPoints[0])),
              [
                set(animationState.position, snapPoints[0]),
                set(animationState.finished, 0),
              ],
              [
                set(animationState.position, add(currentPosition, translateY)),
                set(animationState.finished, 0),
              ]
            )
          ),
        ]),

        /**
         * Gesture ended node.
         */
        onChange(
          add(contentPanGestureState, handlePanGestureState),
          cond(
            or(
              and(
                eq(currentGesture, GESTURE.CONTENT),
                eq(contentPanGestureState, State.END)
              ),
              and(
                eq(currentGesture, GESTURE.HANDLE),
                eq(handlePanGestureState, State.END)
              )
            ),
            [
              // debug('gesture end', currentGesture),
              set(
                config.toValue,
                snapPoint(
                  add(currentPosition, translateY),
                  velocityY,
                  snapPoints
                )
              ),
              set(shouldAnimate, 1),
            ]
          )
        ),
        /**
         * Manual snapping node.
         */
        cond(neq(manualSnapToPoint, -1), [
          // debug('Manually snap to', manualSnapToPoint),
          set(config.toValue, manualSnapToPoint),
          set(animationState.finished, 0),
          set(shouldAnimate, 1),
          set(manualSnapToPoint, -1),
        ]),

        /**
         * Animation Node.
         */
        cond(shouldAnimate, [
          // debug('start animating', shouldAnimate),
          cond(and(not(clockRunning(clock)), not(animationState.finished)), [
            /**
             * `onAnimate` node
             */
            call(
              [currentPosition, config.toValue, ...snapPoints],
              ([_currentPosition, _toValue, ..._animatedSnapPoints]) => {
                const currentPositionIndex = _animatedSnapPoints.indexOf(
                  _currentPosition
                );
                const nextPositionIndex = _animatedSnapPoints.indexOf(_toValue);

                if (onAnimate) {
                  onAnimate(currentPositionIndex, nextPositionIndex);
                }
              }
            ),

            set(animationState.finished, 0),
            set(animationState.frameTime, 0),
            set(animationState.time, 0),
            startClock(clock),
          ]),
          timing(clock, animationState, config),
          cond(animationState.finished, finishTiming),
        ]),

        animationState.position,
      ]),
    [
      animationState,
      clock,
      config,
      currentGesture,
      currentPosition,
      finishTiming,
      isAnimationInterrupted,
      isPanning,
      isPanningContent,
      manualSnapToPoint,
      shouldAnimate,
      snapPoints,
      translateY,
      velocityY,
      contentPanGestureState,
      handlePanGestureState,
      onAnimate,
    ]
  );

  return {
    position,
    manualSnapToPoint,
    currentPosition,
    currentGesture,
  };
};
