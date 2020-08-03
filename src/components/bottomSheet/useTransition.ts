import { RefObject } from 'react';
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
} from 'react-native-reanimated';
import { State, PanGestureHandler } from 'react-native-gesture-handler';
import { useClock, snapPoint } from 'react-native-redash';

const { cond, block } = Animated;

interface TransitionProps {
  sheetRef: RefObject<PanGestureHandler>;
  scrollableRef: RefObject<PanGestureHandler>;
  scrollableContentOffsetY: Animated.Value<number>;
  state: Animated.Value<State>;
  translateY: Animated.Value<number>;
  velocity: Animated.Value<number>;
  snapPoints: number[];
  initialSnapIndex: number;
}

export const useTransition = ({
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
    easing: Easing.out(Easing.exp),
  };

  const animationState = {
    finished: useValue(0),
    position: useValue(snapPoints[initialSnapIndex]),
    frameTime: useValue(0),
    time: useValue(0),
  };

  const finishTiming = [
    set(currentPosition, config.toValue),
    set(animationState.frameTime, 0),
    set(animationState.time, 0),
    stopClock(clock),
  ];

  const clampedTranslateY = add(
    translateY,
    multiply(scrollableContentOffsetY, -1)
  );

  const isTimingInterrupted = and(eq(state, State.BEGAN), clockRunning(clock));

  const position = block([
    cond(isTimingInterrupted, finishTiming),

    cond(eq(state, State.ACTIVE), [
      cond(
        not(greaterOrEq(add(currentPosition, clampedTranslateY), 0)),
        [set(animationState.position, 0), set(animationState.finished, 0)],
        cond(
          not(lessOrEq(add(currentPosition, clampedTranslateY), snapPoints[0])),
          [
            set(animationState.position, snapPoints[0]),
            set(animationState.finished, 0),
          ],
          [
            set(
              animationState.position,
              add(currentPosition, clampedTranslateY)
            ),
            set(animationState.finished, 0),
          ]
        )
      ),
    ]),

    cond(eq(state, State.END), [
      cond(and(not(clockRunning(clock)), not(animationState.finished)), [
        set(
          config.toValue,
          snapPoint(
            add(currentPosition, clampedTranslateY),
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

    animationState.position,
  ]);

  return {
    position,
    currentPosition,
  };
};
