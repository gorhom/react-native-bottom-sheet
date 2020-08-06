import React, {
  useMemo,
  useRef,
  useCallback,
  RefObject,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useCode,
  onChange,
  call,
  eq,
  cond,
  neq,
  and,
  // concat,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {
  usePanGestureHandler,
  useValue,
  useTapGestureHandler,
  // ReText,
} from 'react-native-redash';
import DraggableView from '../draggableView';
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

interface BottomSheet {
  snapTo: (index: number) => void;
  close: () => void;
}

const BottomSheet = forwardRef<BottomSheet, BottomSheetProps>(
  (
    {
      initialSnapIndex = 0,
      snapPoints: _snapPoints = [],
      topInset = 0,
      onChange: _onChange,
      handleComponent: HandleComponent = Handle,
      children,
    },
    ref
  ) => {
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
      const maxSnapPoint =
        normalizedSnapPoints[normalizedSnapPoints.length - 1];
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
      gestureHandler: tapGestureHandler,
    } = useTapGestureHandler();

    const scrollableContentOffsetY = useValue<number>(0);
    const autoSnapTo = useValue<number>(-1);
    //#endregion

    //#region animation
    const { position, currentPosition } = useTransition({
      autoSnapTo,
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
      (scrollableRef: RefObject<Scrollable>) => {
        setScrollableRef(scrollableRef);
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
    const handleOnSnapTo = useCallback(
      (index: number) => {
        autoSnapTo.setValue(snapPoints[index]);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [snapPoints]
    );
    const handleClose = useCallback(() => {
      autoSnapTo.setValue(sheetHeight);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sheetHeight]);
    //#endregion

    //#region
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
    useImperativeHandle(ref, () => ({
      snapTo: handleOnSnapTo,
      close: handleClose,
    }));

    /**
     * @DEV
     * here we track the current position and
     * - call on change ( if provided ).
     * - flash scrollable component scroll indicators.
     * - manipulate the root tap gesture handler maxDeltaY,
     *   which allows the scrollable component to be activated.
     */
    useCode(
      () =>
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
              // @ts-ignore
              rootTapGestureRef.current.setNativeProps({
                maxDeltaY: Math.round(args[0]),
              });
            }
          }),
        ]),
      [snapPoints]
    );

    /**
     * @DEV
     * Once the root tap gesture handler states change to failed
     * and the sheet not fully extended, we make sure to prevent the
     * scrollable component from scrolling.
     */
    useCode(
      () =>
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
      []
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
        <Animated.View pointerEvents="box-none" style={containerStyle}>
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

            <BottomSheetInternalProvider value={internalContextVariables}>
              <DraggableView style={styles.contentContainer}>
                {children}
              </DraggableView>
            </BottomSheetInternalProvider>
          </Animated.View>

          {/* <Animated.View pointerEvents="none" style={styles.debug}>
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
              text={concat('autoSnap To: ', autoSnapTo)}
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
          </Animated.View> */}
        </Animated.View>
      </TapGestureHandler>
    );
  }
);

export default BottomSheet;
