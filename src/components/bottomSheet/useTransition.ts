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
} from 'react-native-reanimated';
import { State } from 'react-native-gesture-handler';
import { useClock, snapPoint } from 'react-native-redash';

const { cond, block } = Animated;

interface TransitionProps {
  autoSnapTo: Animated.Value<number>;
  scrollableContentOffsetY: Animated.Value<number>;
  state: Animated.Value<State>;
  translateY: Animated.Value<number>;
  velocity: Animated.Value<number>;
  snapPoints: number[];
  initialSnapIndex: number;
}

export const useTransition = ({
  autoSnapTo,
  scrollableContentOffsetY,
  state,
  translateY,
  velocity,
  snapPoints,
  initialSnapIndex,
}: TransitionProps) => {
  const currentPosition = useValue(snapPoints[initialSnapIndex]);

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
    // debug('finishTiming', animationState.position),
    set(currentPosition, config.toValue),
    set(animationState.frameTime, 0),
    set(animationState.time, 0),
    set(autoSnapTo, -1),
    stopClock(clock),
  ];

  const translateYMinusContentOffset = add(
    translateY,
    multiply(scrollableContentOffsetY, -1)
  );

  const isTimingInterrupted = and(eq(state, State.BEGAN), clockRunning(clock));
  const isManuallySnapping = neq(autoSnapTo, -1);

  const position = block([
    cond(isTimingInterrupted, [
      finishTiming,
      set(currentPosition, animationState.position),
    ]),

    cond(eq(state, State.ACTIVE), [
      // debug('start panning', clampedTranslateY),
      cond(
        not(greaterOrEq(add(currentPosition, translateYMinusContentOffset), 0)),
        [set(animationState.position, 0), set(animationState.finished, 0)],
        cond(
          not(
            lessOrEq(
              add(currentPosition, translateYMinusContentOffset),
              snapPoints[0]
            )
          ),
          [
            set(animationState.position, snapPoints[0]),
            set(animationState.finished, 0),
          ],
          [
            set(
              animationState.position,
              add(currentPosition, translateYMinusContentOffset)
            ),
            set(animationState.finished, 0),
          ]
        )
      ),
    ]),

    cond(and(eq(state, State.END), not(isManuallySnapping)), [
      // debug('gesture ended', state),
      cond(and(not(clockRunning(clock)), not(animationState.finished)), [
        set(
          config.toValue,
          snapPoint(
            add(currentPosition, translateYMinusContentOffset),
            velocity,
            snapPoints
          )
        ),
        set(animationState.finished, 0),
        set(animationState.frameTime, 0),
        set(animationState.time, 0),
        startClock(clock),
      ]),
      timing(clock, animationState, config),
      cond(animationState.finished, finishTiming),
    ]),

    onChange(
      autoSnapTo,
      cond(isManuallySnapping, set(animationState.finished, 0))
    ),

    cond(isManuallySnapping, [
      cond(and(not(clockRunning(clock)), not(animationState.finished)), [
        set(config.toValue, autoSnapTo),
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
