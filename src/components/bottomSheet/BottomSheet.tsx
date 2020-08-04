import React, { useMemo, useRef, useCallback, RefObject } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  concat,
  useCode,
  onChange,
  call,
  eq,
  block,
  cond,
  neq,
  and,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {
  usePanGestureHandler,
  ReText,
  useValue,
  useTapGestureHandler,
} from 'react-native-redash';
import { useTransition } from './useTransition';
import {
  normalizeSnapPoints,
  useStableCallback,
  useScrollable,
} from '../../utilities';
import Handle from '../handle';
import { styles } from './styles';
import { BottomSheetInternalProvider } from '../../context';
import { Scrollable } from '../../types';

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
  const handlePanGestureRef = useRef<PanGestureHandler>(null);

  //#region variables
  const {
    setScrollableRef,
    removeScrollableRef,
    scrollToTop,
    flashScrollableIndicators,
  } = useScrollable();
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
    state: sheetPanGestureState,
    translation: { y: sheetPanGestureTranslationY },
    velocity: { y: sheetPanGestureVelocityY },
    gestureHandler: sheetPanGestureHandler,
  } = usePanGestureHandler();

  const {
    state: tapGestureState,
    absolutePosition: { y: tapGestureY },
    gestureHandler: tapGestureHandler,
  } = useTapGestureHandler();

  const scrollableContentOffsetY = useValue(0);
  //#endregion

  //#region animation
  const { position, currentPosition } = useTransition({
    scrollableContentOffsetY,
    state: sheetPanGestureState,
    translateY: sheetPanGestureTranslationY,
    velocity: sheetPanGestureVelocityY,
    snapPoints,
    initialSnapIndex,
  });
  //#endregion

  //#region styles
  const containerStyle = useMemo<Animated.AnimateStyle<ViewStyle>>(
    () => ({
      ...styles.container,
      height: sheetHeight,
    }),
    [sheetHeight]
  );
  const contentContainerStyle = useMemo<Animated.AnimateStyle<ViewStyle>>(
    () => ({
      ...styles.container,
      height: sheetHeight,
      transform: [{ translateY: position }],
    }),
    [sheetHeight, position]
  );
  //#endregion

  //#region callbacks
  const handleOnChange = useStableCallback((index: number) => {
    if (_onChange) {
      _onChange(index);
    }
  });
  const handleSettingScrollableRef = useCallback(
    (ref: RefObject<Scrollable>) => {
      console.log('handleSettingScrollableRef', ref);
      setScrollableRef(ref);
      /**
       * @TODO handle when sheet is half open
       */
      // @ts-ignore
      rootTapGestureRef.current.setNativeProps({
        maxDeltaY: 0,
      });
    },
    [setScrollableRef]
  );

  const internalContextVariables = useMemo(
    () => ({
      rootTapGestureRef,
      sheetPanGestureState,
      sheetPanGestureTranslationY,
      sheetPanGestureVelocityY,
      scrollableContentOffsetY,
      setScrollableRef: handleSettingScrollableRef,
      removeScrollableRef,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
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
              flashScrollableIndicators();
              // @ts-ignore
              rootTapGestureRef.current.setNativeProps({
                maxDeltaY: 0,
              });
            } else {
              console.log(args[0]);
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
            scrollToTop();
          })
        ),
      ]),
    [snapPoints, sheetHeight]
  );
  //#endregion

  // render
  return (
    <TapGestureHandler
      ref={rootTapGestureRef}
      maxDurationMs={1000000}
      maxDeltaY={snapPoints[initialSnapIndex]}
      shouldCancelWhenOutside={false}
      {...tapGestureHandler}
    >
      <Animated.View style={containerStyle}>
        <Animated.View style={contentContainerStyle}>
          <PanGestureHandler
            ref={handlePanGestureRef}
            simultaneousHandlers={rootTapGestureRef}
            shouldCancelWhenOutside={false}
            {...sheetPanGestureHandler}
          >
            <Animated.View>
              <HandleComponent />
            </Animated.View>
          </PanGestureHandler>

          <Animated.View style={styles.contentContainer}>
            <BottomSheetInternalProvider value={internalContextVariables}>
              {children}
            </BottomSheetInternalProvider>
          </Animated.View>
        </Animated.View>

        <Animated.View pointerEvents="none" style={styles.debug}>
          <ReText
            style={styles.debugText}
            text={concat('translationY: ', sheetPanGestureTranslationY)}
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
            text={concat('state: ', sheetPanGestureState)}
          />
        </Animated.View>
      </Animated.View>
    </TapGestureHandler>
  );
};

export default BottomSheet;
