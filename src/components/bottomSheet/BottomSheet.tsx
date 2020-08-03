import React, { Component, RefObject, createRef } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
  findNodeHandle,
} from 'react-native';
import Animated, {
  abs,
  add,
  and,
  call,
  Clock,
  clockRunning,
  cond,
  Easing,
  eq,
  event,
  Extrapolate,
  greaterOrEq,
  greaterThan,
  interpolate,
  multiply,
  not,
  onChange,
  or,
  set,
  startClock,
  stopClock,
  sub,
  timing,
  Value,
  defined,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  State as GestureState,
  TapGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { BottomSheetInternalProvider } from '../../context';
import { Scrollable, ScrollableRef } from '../../types';

const { height: windowHeight } = Dimensions.get('window');
const DRAG_TOSS = 0.05;
const IOS_NORMAL_DECELERATION_RATE = 0.998;
const ANDROID_NORMAL_DECELERATION_RATE = 0.985;
const DEFAULT_ANIMATION_DURATION = 250;
const DEFAULT_EASING = Easing.inOut(Easing.linear);
const imperativeScrollOptions = {
  FlatList: {
    method: 'scrollToIndex',
    args: {
      index: 0,
      viewPosition: 0,
      viewOffset: 1000,
      animated: true,
    },
  },
  ScrollView: {
    method: 'scrollTo',
    args: {
      x: 0,
      y: 0,
      animated: true,
    },
  },
  SectionList: {
    method: 'scrollToLocation',
    args: {
      itemIndex: 0,
      sectionIndex: 0,
      viewPosition: 0,
      viewOffset: 1000,
      animated: true,
    },
  },
};

interface TimingParams {
  clock: Animated.Clock;
  from: Animated.Node<number>;
  to: Animated.Node<number>;
  position: Animated.Value<number>;
  finished: Animated.Value<number>;
  frameTime: Animated.Value<number>;
}

type BottomSheetProps = {
  /**
   * Array of numbers that indicate the different resting positions of the bottom sheet (in dp or %), starting from the top.
   * If a percentage is used, that would translate to the relative amount of the total window height.
   * For instance, if 50% is used, that'd be windowHeight * 0.5. If you wanna take into account safe areas during
   * the calculation, such as status bars and notches, please use 'topInset' prop
   */
  snapPoints: Array<string | number>;
  /**
   * Index that references the initial resting position of the drawer, starting from the top
   */
  initialSnapIndex: number;
  /**
   * Render prop for the handle
   */
  renderHandle: () => React.ReactNode;
  /**
   * Callback that is executed right after the drawer settles on one of the snapping points.
   * The new index is provided on the callback
   * @param index
   */
  onSettle?: (index: number) => void;
  /**
   * Animated value that tracks the position of the drawer, being:
   * 0 => closed
   * 1 => fully opened
   */
  animatedPosition?: Animated.Value<number>;
  /**
   * Configuration for the timing reanimated function
   */
  animationConfig?: {
    duration?: number;
    easing?: Animated.EasingFunction;
  };
  /**
   * This value is useful if you want to take into consideration safe area insets
   * when applying percentages for snapping points. We recommend using react-native-safe-area-context
   * library for that.
   * @see https://github.com/th3rdwave/react-native-safe-area-context#usage, insets.top
   */
  topInset: number;
  /**
   * Reference to FlatList, ScrollView or SectionList in order to execute its imperative methods.
   */
  // innerRef: RefObject<FlatList | ScrollView | SectionList>;
  /*
   * Style to be applied to the container.
   */
  containerStyle?: Animated.AnimateStyle<ViewStyle>;

  children: React.ReactNode[] | React.ReactNode;
};

export class BottomSheet extends Component<BottomSheetProps> {
  static defaultProps = {
    topInset: 0,
  };
  /**
   * Gesture Handler references
   */
  private masterDrawer = React.createRef<TapGestureHandler>();
  private drawerHandleRef = React.createRef<PanGestureHandler>();
  private scrollableRef = React.createRef<ScrollableRef>();

  /**
   * Pan gesture handler events for drawer handle and content
   */
  private onHandleGestureEvent: (event: PanGestureHandlerGestureEvent) => void;
  /**
   * Main Animated Value that drives the top position of the UI drawer at any point in time
   */
  private translateY: Animated.Node<number>;
  /**
   * Animated value that keeps track of the position: 0 => closed, 1 => opened
   */
  // @ts-ignore
  private position: Animated.Node<number>;
  /**
   * Flag to indicate imperative snapping
   */
  private isManuallySetValue: Animated.Value<number> = new Value(0);
  /**
   * Manual snapping amount
   */
  private manualYOffset: Animated.Value<number> = new Value(0);
  /**
   * Keeps track of the current index
   */
  private nextSnapIndex: Animated.Value<number>;
  /**
   * Deceleration rate of the scroll component. This is used only on Android to
   * compensate the unexpected glide it gets sometimes.
   */
  private decelerationRate: Animated.Value<number>;
  private prevSnapIndex = -1;
  private dragY = new Value(0);
  private prevDragY = new Value(0);
  private tempDestSnapPoint = new Value(0);
  private isAndroid = new Value(Number(Platform.OS === 'android'));
  private animationClock = new Clock();
  private animationPosition = new Value(0);
  private animationFinished = new Value(0);
  private animationFrameTime = new Value(0);
  private velocityY = new Value(0);
  private lastStartScrollY: Animated.Value<number> = new Value(0);
  private prevTranslateYOffset: Animated.Value<number>;
  private translationY: Animated.Value<number>;
  private destSnapPoint = new Value(0);
  private currnetSnapIndex = createRef<number>();
  private lastSnap: Animated.Value<number>;
  private dragWithHandle = new Value(0);
  private scrollUpAndPullDown = new Value(0);
  private didGestureFinish: Animated.Node<0 | 1>;
  private didScrollUpAndPullDown: Animated.Node<number>;
  private setTranslationY: Animated.Node<number>;
  private extraOffset: Animated.Node<number>;
  private calculateNextSnapPoint: (
    i?: number
  ) => number | Animated.Node<number>;

  private handleGestureState = new Value<GestureState>(-1);
  private handleOldGestureState = new Value<GestureState>(-1);
  private drawerGestureState = new Value<GestureState>(-1);
  private drawerOldGestureState = new Value<GestureState>(-1);

  convertPercentageToDp = (str: string) =>
    (Number(str.split('%')[0]) * (windowHeight - this.props.topInset)) / 100;

  constructor(props: BottomSheetProps) {
    super(props);

    const { initialSnapIndex, animationConfig } = props;
    const animationDuration =
      animationConfig?.duration || DEFAULT_ANIMATION_DURATION;

    const snapPoints = this.getNormalisedSnapPoints();
    const openPosition = snapPoints[0];
    const closedPosition = snapPoints[snapPoints.length - 1];
    const initialSnap = snapPoints[initialSnapIndex];
    this.nextSnapIndex = new Value(initialSnapIndex);
    // @ts-ignore
    this.currnetSnapIndex.current = initialSnapIndex;

    const initialDecelerationRate = Platform.select({
      android:
        props.initialSnapIndex === 0 ? ANDROID_NORMAL_DECELERATION_RATE : 0,
      ios: IOS_NORMAL_DECELERATION_RATE,
    });
    this.decelerationRate = new Value(initialDecelerationRate);

    const lastSnapInRange = new Value(1);
    this.prevTranslateYOffset = new Value(initialSnap);
    this.translationY = new Value(initialSnap);

    this.lastSnap = new Value(initialSnap);

    this.onHandleGestureEvent = event([
      {
        nativeEvent: {
          translationY: this.dragY,
          oldState: this.handleOldGestureState,
          state: this.handleGestureState,
          velocityY: this.velocityY,
        },
      },
    ]);

    const didHandleGestureBegin = eq(
      this.handleGestureState,
      GestureState.ACTIVE
    );

    const isAnimationInterrupted = and(
      or(
        eq(this.handleGestureState, GestureState.BEGAN),
        eq(this.drawerGestureState, GestureState.BEGAN)
      ),
      clockRunning(this.animationClock)
    );

    this.didGestureFinish = or(
      and(
        eq(this.handleOldGestureState, GestureState.ACTIVE),
        eq(this.handleGestureState, GestureState.END)
      ),
      and(
        eq(this.drawerOldGestureState, GestureState.ACTIVE),
        eq(this.drawerGestureState, GestureState.END)
      )
    );

    // Function that determines if the last snap point is in the range {snapPoints}
    // In the case of interruptions in the middle of an animation, we'll get
    // lastSnap values outside the range
    const isLastSnapPointInRange = (i: number = 0): Animated.Node<number> =>
      i === snapPoints.length
        ? lastSnapInRange
        : cond(
            eq(this.lastSnap, snapPoints[i]),
            [set(lastSnapInRange, 1)],
            isLastSnapPointInRange(i + 1)
          );

    const scrollY = [
      set(lastSnapInRange, 0),
      isLastSnapPointInRange(),
      cond(
        or(
          didHandleGestureBegin,
          and(
            this.isManuallySetValue,
            not(eq(this.manualYOffset, snapPoints[0]))
          )
        ),
        [set(this.dragWithHandle, 1), 0]
      ),
      cond(
        // This is to account for a continuous scroll on the drawer from a snap point
        // Different than top, bringing the drawer to the top position, so that if we
        // change scroll direction without releasing the gesture, it doesn't pull down the drawer again
        and(
          eq(this.dragWithHandle, 1),
          greaterThan(snapPoints[0], add(this.lastSnap, this.dragY)),
          and(not(eq(this.lastSnap, snapPoints[0])), lastSnapInRange)
        ),
        [
          set(this.lastSnap, snapPoints[0]),
          set(this.dragWithHandle, 0),
          this.lastStartScrollY,
        ],
        cond(eq(this.dragWithHandle, 1), 0, this.lastStartScrollY)
      ),
    ];

    this.didScrollUpAndPullDown = cond(
      and(
        greaterOrEq(this.dragY, this.lastStartScrollY),
        greaterThan(this.lastStartScrollY, 0)
      ),
      set(this.scrollUpAndPullDown, 1)
    );

    this.setTranslationY = cond(
      and(
        not(this.dragWithHandle),
        not(greaterOrEq(this.dragY, this.lastStartScrollY))
      ),
      set(this.translationY, sub(this.dragY, this.lastStartScrollY)),
      set(this.translationY, this.dragY)
    );

    this.extraOffset = cond(
      eq(this.scrollUpAndPullDown, 1),
      this.lastStartScrollY,
      0
    );
    const endOffsetY = add(
      this.lastSnap,
      this.translationY,
      multiply(DRAG_TOSS, this.velocityY)
    );

    this.calculateNextSnapPoint = (i = 0): Animated.Node<number> | number =>
      i === snapPoints.length
        ? this.tempDestSnapPoint
        : cond(
            greaterThan(
              abs(sub(this.tempDestSnapPoint, endOffsetY)),
              abs(sub(add(snapPoints[i], this.extraOffset), endOffsetY))
            ),
            [
              set(this.tempDestSnapPoint, add(snapPoints[i], this.extraOffset)),
              set(this.nextSnapIndex, i),
              this.calculateNextSnapPoint(i + 1),
            ],
            this.calculateNextSnapPoint(i + 1)
          );

    const runTiming = ({
      clock,
      from,
      to,
      position,
      finished,
      frameTime,
    }: TimingParams) => {
      const state = {
        finished,
        position,
        time: new Value(0),
        frameTime,
      };

      const animationParams = {
        duration: animationDuration,
        easing: animationConfig?.easing || DEFAULT_EASING,
      };

      const config = {
        toValue: new Value(0),
        ...animationParams,
      };

      return [
        cond(and(not(clockRunning(clock)), not(eq(finished, 1))), [
          // If the clock isn't running, we reset all the animation params and start the clock
          set(state.finished, 0),
          set(state.time, 0),
          set(state.position, from),
          set(state.frameTime, 0),
          set(config.toValue, to),
          startClock(clock),
        ]),
        // We run the step here that is going to update position
        timing(clock, state, config),
        cond(
          state.finished,
          [
            call([this.nextSnapIndex], ([value]) => {
              if (value !== this.prevSnapIndex) {
                this.props.onSettle?.(value);
              }
              this.prevSnapIndex = value;
            }),
            // Resetting appropriate values
            set(this.drawerOldGestureState, GestureState.END),
            set(this.handleOldGestureState, GestureState.END),
            set(this.prevTranslateYOffset, state.position),
            cond(eq(this.scrollUpAndPullDown, 1), [
              set(
                this.prevTranslateYOffset,
                sub(this.prevTranslateYOffset, this.lastStartScrollY)
              ),
              set(this.lastStartScrollY, 0),
              set(this.scrollUpAndPullDown, 0),
            ]),
            cond(eq(this.destSnapPoint, snapPoints[0]), [
              set(this.dragWithHandle, 0),
            ]),
            set(this.isManuallySetValue, 0),
            set(this.manualYOffset, 0),
            stopClock(clock),
            this.prevTranslateYOffset,
          ],
          // We made the block return the updated position,
          state.position
        ),
      ];
    };

    const translateYOffset = cond(
      isAnimationInterrupted,
      [
        // set(prevTranslateYOffset, animationPosition) should only run if we are
        // interrupting an animation when the drawer is currently in a different
        // position than the top
        cond(
          or(
            this.dragWithHandle,
            greaterOrEq(abs(this.prevDragY), this.lastStartScrollY)
          ),
          set(this.prevTranslateYOffset, this.animationPosition)
        ),
        set(this.animationFinished, 1),
        set(this.translationY, 0),
        // Resetting appropriate values
        set(this.drawerOldGestureState, GestureState.END),
        set(this.handleOldGestureState, GestureState.END),
        // By forcing that frameTime exceeds duration, it has the effect of stopping the animation
        set(this.animationFrameTime, add(animationDuration, 1000)),
        stopClock(this.animationClock),
        this.prevTranslateYOffset,
      ],
      cond(
        or(
          this.didGestureFinish,
          this.isManuallySetValue,
          clockRunning(this.animationClock)
        ),
        [
          runTiming({
            clock: this.animationClock,
            from: cond(
              this.isManuallySetValue,
              this.prevTranslateYOffset,
              add(this.prevTranslateYOffset, this.translationY)
            ),
            to: this.destSnapPoint,
            position: this.animationPosition,
            finished: this.animationFinished,
            frameTime: this.animationFrameTime,
          }),
        ],
        [
          set(this.animationFrameTime, 0),
          set(this.animationFinished, 0),
          // @ts-ignore
          this.prevTranslateYOffset,
        ]
      )
    );

    this.translateY = interpolate(
      add(translateYOffset, this.dragY, multiply(scrollY, -1)),
      {
        inputRange: [openPosition, closedPosition],
        outputRange: [openPosition, closedPosition],
        extrapolate: Extrapolate.CLAMP,
      }
    );

    this.position = interpolate(this.translateY, {
      inputRange: [openPosition, closedPosition],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    });
  }

  private getNormalisedSnapPoints = () => {
    return this.props.snapPoints.map(p => {
      if (typeof p === 'string') {
        return this.convertPercentageToDp(p);
      } else if (typeof p === 'number') {
        return p;
      }

      throw new Error(
        `Invalid type for value ${p}: ${typeof p}. It should be either a percentage string or a number`
      );
    });
  };

  private setScrollableRef = (ref: RefObject<Scrollable>) => {
    let id = findNodeHandle(ref.current);
    // @ts-ignore
    let type = ref.current?._component?.constructor.name ?? null;

    if (id && type) {
      // @ts-ignore
      this.scrollableRef.current = {
        id,
        type,
        node: ref.current!,
      };

      this.lastStartScrollY.setValue(0);
      this.drawerOldGestureState.setValue(GestureState.ACTIVE);
      this.drawerGestureState.setValue(GestureState.END);
      this.snapTo(this.currnetSnapIndex.current ?? 0);
    }
  };

  snapTo = (index: number) => {
    const snapPoints = this.getNormalisedSnapPoints();
    this.isManuallySetValue.setValue(1);
    this.manualYOffset.setValue(snapPoints[index]);
    this.nextSnapIndex.setValue(index);
  };

  render() {
    const {
      renderHandle,
      initialSnapIndex,
      containerStyle,
      children,
    } = this.props;
    const normalisedSnapPoints = this.getNormalisedSnapPoints();
    const initialSnap = normalisedSnapPoints[initialSnapIndex];

    const Content = (
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          containerStyle,
          // @ts-ignore
          {
            transform: [{ translateY: this.translateY }],
          },
        ]}
      >
        <Animated.Code
          exec={cond(defined(this.props.animatedPosition), [
            cond(
              eq(this.props.animatedPosition!, -1),
              set(this.props.animatedPosition!, this.translateY)
            ),
            onChange(
              this.translateY,
              set(this.props.animatedPosition!, this.translateY)
            ),
          ])}
        />
        <PanGestureHandler
          ref={this.drawerHandleRef}
          shouldCancelWhenOutside={false}
          simultaneousHandlers={this.masterDrawer}
          onGestureEvent={this.onHandleGestureEvent}
          onHandlerStateChange={this.onHandleGestureEvent}
        >
          <Animated.View>{renderHandle()}</Animated.View>
        </PanGestureHandler>
        <BottomSheetInternalProvider
          value={{
            dragY: this.dragY,
            velocityY: this.velocityY,
            drawerGestureState: this.drawerGestureState,
            drawerOldGestureState: this.drawerOldGestureState,
            lastStartScrollY: this.lastStartScrollY,

            masterDrawerRef: this.masterDrawer,
            decelerationRate: this.decelerationRate,
            contentPaddingBottom: this.getNormalisedSnapPoints()[0],
            setScrollableRef: this.setScrollableRef,
          }}
        >
          {children}
        </BottomSheetInternalProvider>
        <Animated.Code
          exec={onChange(
            this.dragY,
            cond(not(eq(this.dragY, 0)), set(this.prevDragY, this.dragY))
          )}
        />
        <Animated.Code
          exec={onChange(
            this.didGestureFinish,
            cond(this.didGestureFinish, [
              this.didScrollUpAndPullDown,
              this.setTranslationY,
              set(
                this.tempDestSnapPoint,
                add(normalisedSnapPoints[0], this.extraOffset)
              ),
              set(this.nextSnapIndex, 0),
              set(this.destSnapPoint, this.calculateNextSnapPoint()),
              cond(
                and(
                  greaterThan(this.dragY, this.lastStartScrollY),
                  this.isAndroid,
                  not(this.dragWithHandle)
                ),
                call([], () => {
                  const scrollable = this.scrollableRef.current;

                  if (!scrollable) {
                    return;
                  }

                  // This prevents the scroll glide from happening on Android when pulling down with inertia.
                  // It's not perfect, but does the job for now
                  const { method, args } = imperativeScrollOptions[
                    scrollable.type
                  ];

                  // @ts-ignore
                  scrollable.node.getNode()[method](args);
                })
              ),
              set(this.dragY, 0),
              set(this.velocityY, 0),
              set(
                this.lastSnap,
                sub(
                  this.destSnapPoint,
                  cond(
                    eq(this.scrollUpAndPullDown, 1),
                    this.lastStartScrollY,
                    0
                  )
                )
              ),
              call([this.lastSnap], ([value]) => {
                // This is the TapGHandler trick
                //@ts-ignore
                this.currnetSnapIndex.current =
                  this.getNormalisedSnapPoints().indexOf(value) ?? 0;
                // @ts-ignore
                this.masterDrawer?.current?.setNativeProps({
                  maxDeltaY: value - this.getNormalisedSnapPoints()[0],
                });
              }),
              set(
                this.decelerationRate,
                cond(
                  eq(this.isAndroid, 1),
                  cond(
                    eq(this.lastSnap, normalisedSnapPoints[0]),
                    ANDROID_NORMAL_DECELERATION_RATE,
                    0
                  ),
                  IOS_NORMAL_DECELERATION_RATE
                )
              ),
            ])
          )}
        />
        <Animated.Code
          exec={onChange(this.isManuallySetValue, [
            cond(
              this.isManuallySetValue,
              [
                set(this.destSnapPoint, this.manualYOffset),
                set(this.animationFinished, 0),
                set(this.lastSnap, this.manualYOffset),
                call([this.lastSnap], ([value]) => {
                  // This is the TapGHandler trick
                  //@ts-ignore
                  this.currnetSnapIndex.current =
                    this.getNormalisedSnapPoints().indexOf(value) ?? 0;
                  // @ts-ignore
                  this.masterDrawer?.current?.setNativeProps({
                    maxDeltaY: value - this.getNormalisedSnapPoints()[0],
                  });
                }),
              ],
              [set(this.nextSnapIndex, 0)]
            ),
          ])}
        />
      </Animated.View>
    );

    // On Android, having an intermediary view with pointerEvents="box-none", breaks the
    // waitFor logic
    if (Platform.OS === 'android') {
      return (
        <TapGestureHandler
          ref={this.masterDrawer}
          maxDurationMs={100000}
          maxDeltaY={initialSnap - this.getNormalisedSnapPoints()[0]}
          shouldCancelWhenOutside={false}
        >
          {Content}
        </TapGestureHandler>
      );
    }

    // On iOS, We need to wrap the content on a view with PointerEvents box-none
    // So that we can start scrolling automatically when reaching the top without
    // Stopping the gesture
    return (
      <TapGestureHandler
        ref={this.masterDrawer}
        maxDurationMs={100000}
        maxDeltaY={initialSnap - this.getNormalisedSnapPoints()[0]}
      >
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
          {Content}
        </View>
      </TapGestureHandler>
    );
  }
}

export default BottomSheet;
