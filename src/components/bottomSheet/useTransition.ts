import Animated, {
  eq,
  useValue,
  Easing,
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
  // debug,
} from 'react-native-reanimated';
import { State } from 'react-native-gesture-handler';
import { useClock, snapPoint } from 'react-native-redash';

const { cond, block } = Animated;

interface TransitionProps {
  contentPanGestureState: Animated.Value<State>;
  contentPanGestureTranslationY: Animated.Value<number>;
  contentPanGestureVelocityY: Animated.Value<number>;

  handlePanGestureState: Animated.Value<State>;
  handlePanGestureTranslationY: Animated.Value<number>;
  handlePanGestureVelocityY: Animated.Value<number>;

  autoSnapTo: Animated.Value<number>;
  scrollableContentOffsetY: Animated.Value<number>;
  snapPoints: number[];
  initialSnapIndex: number;
}

enum GESTURE {
  UNDETERMINED = 0,
  CONTENT,
  HANDLE,
}

export const useTransition = ({
  contentPanGestureState,
  contentPanGestureTranslationY,
  contentPanGestureVelocityY,
  handlePanGestureState,
  handlePanGestureTranslationY,
  handlePanGestureVelocityY,
  autoSnapTo,
  scrollableContentOffsetY,
  snapPoints,
  initialSnapIndex,
}: TransitionProps) => {
  const currentGesture = useValue<GESTURE>(0);
  const currentPosition = useValue(snapPoints[initialSnapIndex]);

  const isPanningContent = eq(contentPanGestureState, State.ACTIVE);
  const isPanningHandle = eq(handlePanGestureState, State.ACTIVE);
  const isPanning = or(isPanningContent, isPanningHandle);
  const shouldAnimate = useValue(0);

  const clock = useClock();
  const config = {
    toValue: useValue(0),
    duration: 500,
    easing: Easing.out(Easing.back(0.75)),
  };

  const animationState = {
    finished: useValue(0),
    position: useValue(snapPoints[initialSnapIndex]),
    frameTime: useValue(0),
    time: useValue(0),
  };

  const finishTiming = [
    set(shouldAnimate, 0),
    set(currentPosition, config.toValue),
    set(animationState.frameTime, 0),
    set(animationState.time, 0),
    stopClock(clock),
  ];

  const translateY = cond(
    eq(currentGesture, GESTURE.CONTENT),
    cond(
      eq(currentPosition, 0),
      add(
        contentPanGestureTranslationY,
        multiply(scrollableContentOffsetY, -1)
      ),
      contentPanGestureTranslationY
    ),
    handlePanGestureTranslationY
  );
  const velocityY = cond(
    eq(currentGesture, GESTURE.CONTENT),
    contentPanGestureVelocityY,
    handlePanGestureVelocityY
  );
  const isAnimationInterrupted = and(
    clockRunning(clock),
    or(isPanning, neq(autoSnapTo, -1))
  );
  const position = block([
    /**
     * In case animation get interrupted, we execute the finishTiming node and
     * set current position the the animated position.
     */
    cond(isAnimationInterrupted, [
      // debug('animation interrupted', isAnimationInterrupted),
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
        not(greaterOrEq(add(currentPosition, translateY), 0)),
        [set(animationState.position, 0), set(animationState.finished, 0)],
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
    cond(
      or(
        eq(contentPanGestureState, State.END),
        eq(handlePanGestureState, State.END)
      ),
      [
        set(contentPanGestureState, State.UNDETERMINED),
        set(handlePanGestureState, State.UNDETERMINED),
        set(
          config.toValue,
          snapPoint(add(currentPosition, translateY), velocityY, snapPoints)
        ),
        set(shouldAnimate, 1),
      ]
    ),

    /**
     * Manual snapping node.
     */
    onChange(autoSnapTo, [
      cond(neq(autoSnapTo, -1), [
        // debug('Manually snap to', autoSnapTo),
        set(config.toValue, autoSnapTo),
        set(autoSnapTo, -1),
        set(animationState.finished, 0),
        set(shouldAnimate, 1),
      ]),
    ]),

    /**
     * Animation Node.
     */
    cond(shouldAnimate, [
      // debug('start animating', shouldAnimate),
      cond(and(not(clockRunning(clock)), not(animationState.finished)), [
        set(animationState.finished, 0),
        set(animationState.frameTime, 0),
        set(animationState.time, 0),
        startClock(clock),
      ]),
      timing(clock, animationState, config),
      cond(animationState.finished, finishTiming),
    ]),

    animationState.position,
  ]);

  return {
    position,
    currentPosition,
  };
};
