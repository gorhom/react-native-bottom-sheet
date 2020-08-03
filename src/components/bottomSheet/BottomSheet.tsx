import React, { useMemo, useRef } from 'react';
import {
  ViewStyle,
  Text,
  FlatList,
  View,
  StyleSheet,
  findNodeHandle,
} from 'react-native';
import Animated, {
  concat,
  useCode,
  onChange,
  call,
  event,
  eq,
  block,
  round,
  cond,
  neq,
  and,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  NativeViewGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {
  usePanGestureHandler,
  useScrollHandler,
  ReText,
  useValue,
  useTapGestureHandler,
} from 'react-native-redash';
import { useTransition } from './useTransition';
import { normalizeSnapPoints, useStableCallback } from '../../utilities';
import Handle from '../handle';
import { styles } from './styles';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface BottomSheetProps {
  initialSnapIndex?: number;
  snapPoints: Array<string | number>;
  topInset: number;
  handleComponent?: React.FC;
  children: React.ReactNode[] | React.ReactNode;
  onChange?: (index: number) => void;
}

const BottomSheet = ({
  initialSnapIndex = 0,
  snapPoints: _snapPoints = [],
  topInset = 0,
  onChange: _onChange,
  handleComponent: HandleComponent = Handle,
  children,
}: BottomSheetProps) => {
  const rootTapGestureRef = useRef<TapGestureHandler>(null);
  const sheetRef = useRef<PanGestureHandler>(null);
  const scrollableWrapperRef = useRef<NativeViewGestureHandler>(null);
  const scrollableRef = useRef<FlatList>(null);

  //#region variables
  const { snapPoints, sheetHeight } = useMemo(() => {
    const normalizedSnapPoints = normalizeSnapPoints(_snapPoints, topInset);
    const maxSnapPoint = normalizedSnapPoints[normalizedSnapPoints.length - 1];
    return {
      snapPoints: normalizedSnapPoints.map(
        normalizedSnapPoint => maxSnapPoint - normalizedSnapPoint
      ),
      sheetHeight: maxSnapPoint,
    };
  }, [_snapPoints, topInset]);

  //#endregion

  //#region gestures
  const {
    state,
    translation,
    velocity,
    gestureHandler,
  } = usePanGestureHandler();

  const {
    state: tapGestureState,
    absolutePosition: { y: tapGestureY },
    gestureHandler: tapGestureHandler,
  } = useTapGestureHandler();

  const scrollableContentOffsetY = useValue(0);
  const onScrollBeginDrag = event([
    {
      nativeEvent: {
        contentOffset: { y: scrollableContentOffsetY },
      },
    },
  ]);
  //#endregion

  //#region animation
  const { position, currentPosition } = useTransition({
    sheetRef,
    scrollableRef,
    scrollableContentOffsetY,
    state,
    translateY: translation.y,
    velocity: velocity.y,
    snapPoints,
    initialSnapIndex,
  });
  //#endregion

  //#region styles
  const containerStyle = useMemo<Animated.AnimateStyle<ViewStyle>>(
    () => ({
      ...styles.container,
      height: sheetHeight,
      transform: [{ translateY: position }],
    }),
    [position, sheetHeight]
  );
  //#endregion

  //#region callbacks
  const handleOnChange = useStableCallback((index: number) => {
    if (_onChange) {
      _onChange(index);
    }
  });
  //#endregion

  //#region effects
  useCode(
    () =>
      block([
        onChange(currentPosition, [
          call([currentPosition], args => {
            const currentIndex = snapPoints.indexOf(args[0]);
            handleOnChange(currentIndex);

            if (currentIndex === snapPoints.length - 1) {
              // @ts-ignore
              scrollableRef.current?.getNode().flashScrollIndicators();
              // @ts-ignore
              rootTapGestureRef.current.setNativeProps({
                maxDeltaY: 0,
              });
            } else {
              // @ts-ignore
              rootTapGestureRef.current.setNativeProps({
                maxDeltaY: Math.round(args[0]),
              });
            }
          }),
        ]),
        cond(
          and(
            eq(tapGestureState, State.FAILED),
            neq(currentPosition, 0),
            neq(position, 0)
          ),
          call([], () => {
            // @ts-ignore
            scrollableRef.current?.getNode().scrollToIndex({
              animated: false,
              index: 0,
            });
          })
        ),
        onChange(
          scrollableContentOffsetY,
          call([scrollableContentOffsetY], args => {
            // activeOffsetY={[-100, 100]}
            // failOffsetY={[-50, 50]}
            // @ts-ignore
            // rootTapGestureRef.current.setNativeProps({
            //   maxDeltaY: 0,
            //   // failOffsetY: [-0.1, args[0] + 0.1],
            // });
          })
        ),
      ]),
    [snapPoints, sheetHeight]
  );
  //#endregion
  return (
    <TapGestureHandler
      ref={rootTapGestureRef}
      maxDurationMs={1000000}
      maxDeltaY={snapPoints[initialSnapIndex]}
      shouldCancelWhenOutside={false}
      {...tapGestureHandler}
    >
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: sheetHeight,
        }}
      >
        <PanGestureHandler
          ref={sheetRef}
          simultaneousHandlers={[rootTapGestureRef, scrollableWrapperRef]}
          shouldCancelWhenOutside={false}
          {...gestureHandler}
        >
          <Animated.View style={containerStyle}>
            <HandleComponent />
            <Animated.View style={styles.contentContainer}>
              {/* {children} */}
              <NativeViewGestureHandler
                ref={scrollableWrapperRef}
                waitFor={rootTapGestureRef}
                simultaneousHandlers={sheetRef}
              >
                <AnimatedFlatList
                  ref={scrollableRef}
                  bounces={false}
                  onScrollBeginDrag={onScrollBeginDrag}
                  onScrollEndDrag={onScrollBeginDrag}
                  onMomentumScrollBegin={onScrollBeginDrag}
                  onMomentumScrollEnd={onScrollBeginDrag}
                  overScrollMode="never"
                  decelerationRate={0.99999}
                  scrollEventThrottle={1}
                  keyExtractor={i => `${i}`}
                  renderItem={({ item }) => (
                    <View >
                      <Text style={{ color: 'white' }}>{item}</Text>
                    </View>
                  )}
                  data={Array(100)
                    .fill(0)
                    .map((_, index) => index)}
                />
              </NativeViewGestureHandler>
            </Animated.View>

            <Animated.View pointerEvents="none" style={styles.debug}>
              <ReText
                style={styles.debugText}
                text={concat('translationY: ', translation.y)}
              />
              <ReText
                style={styles.debugText}
                text={concat('contentOffsetY: ', scrollableContentOffsetY)}
              />
              <ReText
                style={styles.debugText}
                text={concat('tap state: ', tapGestureState)}
              />
              <ReText
                style={styles.debugText}
                text={concat('tap y: ', tapGestureY)}
              />
              <ReText
                style={styles.debugText}
                text={concat('position: ', position)}
              />
              <ReText
                style={styles.debugText}
                text={concat('currentPosition: ', currentPosition)}
              />
              <ReText
                style={styles.debugText}
                text={concat('state: ', state)}
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};

export default BottomSheet;
