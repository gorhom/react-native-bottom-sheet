import React, {
  useMemo,
  useRef,
  useCallback,
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
  greaterThan,
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
import Handle from '../handle';
import ContentWrapper from '../contentWrapper';
import { useTransition } from './useTransition';
import {
  normalizeSnapPoints,
  useStableCallback,
  useScrollable,
} from '../../utilities';
import { BottomSheetInternalProvider } from '../../context';
import { ScrollableRef } from '../../types';
import { styles } from './styles';

Animated.addWhitelistedUIProps({
  maxDeltaY: true,
});

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
    // refs
    const currentPositionIndexRef = useRef<number>(initialSnapIndex);
    const rootTapGestureRef = useRef<TapGestureHandler>(null);
    const handlePanGestureRef = useRef<PanGestureHandler>(null);

    //#region variables
    const {
      scrollableContentOffsetY,
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
      state: handlePanGestureState,
      translation: { y: handlePanGestureTranslationY },
      velocity: { y: handlePanGestureVelocityY },
      gestureHandler: handlePanGestureHandler,
    } = usePanGestureHandler();

    const {
      state: contentPanGestureState,
      translation: { y: contentPanGestureTranslationY },
      velocity: { y: contentPanGestureVelocityY },
    } = usePanGestureHandler();

    const {
      state: tapGestureState,
      gestureHandler: tapGestureHandler,
    } = useTapGestureHandler();

    const autoSnapTo = useValue<number>(-1);
    //#endregion

    //#region animation
    const { position, currentPosition } = useTransition({
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
    });

    /**
     * Scrollable animated props.
     */
    const disableIntervalMomentum = greaterThan(position, 0);
    const decelerationRate = cond(greaterThan(position, 0), 0.001, 0.999);
    //#endregion

    //#region styles
    const containerStyle = useMemo<ViewStyle>(
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
    const refreshUIElements = useCallback(() => {
      const currentPositionIndex = currentPositionIndexRef.current;
      if (currentPositionIndex === snapPoints.length - 1) {
        flashScrollableIndicators();
        // @ts-ignore
        rootTapGestureRef.current.setNativeProps({
          maxDeltaY: 0,
        });
      } else {
        // @ts-ignore
        rootTapGestureRef.current.setNativeProps({
          maxDeltaY: Math.round(snapPoints[currentPositionIndex]),
        });
      }
    }, [snapPoints, flashScrollableIndicators]);
    const handleOnChange = useStableCallback((index: number) => {
      if (_onChange) {
        _onChange(index);
      }
    });
    const handleSettingScrollableRef = useCallback(
      (scrollableRef: ScrollableRef) => {
        setScrollableRef(scrollableRef);
        refreshUIElements();
      },
      [setScrollableRef, refreshUIElements]
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
        contentPanGestureState,
        contentPanGestureTranslationY,
        contentPanGestureVelocityY,
        scrollableContentOffsetY,
        disableIntervalMomentum,
        decelerationRate,
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
            const currentPositionIndex = snapPoints.indexOf(args[0]);

            /**
             * if animation was interrupted, we ignore the change.
             */
            if (currentPositionIndex === -1) {
              return;
            }
            currentPositionIndexRef.current = currentPositionIndex;
            handleOnChange(currentPositionIndex);
            refreshUIElements();
          }),
        ]),
      [snapPoints, refreshUIElements]
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
          and(eq(tapGestureState, State.FAILED), neq(position, 0)),
          call([], () => {
            scrollToTop();
          })
        ),
      []
    );
    //#endregion

    // render
    return (
      <>
        <ContentWrapper
          ref={rootTapGestureRef}
          initialMaxDeltaY={snapPoints[initialSnapIndex]}
          style={containerStyle}
          {...tapGestureHandler}
        >
          <Animated.View style={contentContainerStyle}>
            <PanGestureHandler
              ref={handlePanGestureRef}
              simultaneousHandlers={rootTapGestureRef}
              shouldCancelWhenOutside={false}
              {...handlePanGestureHandler}
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
        </ContentWrapper>
        {/* <Animated.View pointerEvents="none" style={styles.debug}>
          <ReText
            style={styles.debugText}
            text={concat('tapState: ', tapGestureState)}
          />
          <ReText
            style={styles.debugText}
            text={concat('contentState: ', contentPanGestureState)}
          />
          <ReText
            style={styles.debugText}
            text={concat(
              'contentTranslationY: ',
              contentPanGestureTranslationY
            )}
          />
          <ReText
            style={styles.debugText}
            text={concat('scrollableOffsetY: ', scrollableContentOffsetY)}
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
            text={concat('disableIntervalMomentum: ', disableIntervalMomentum)}
          />
        </Animated.View> */}
      </>
    );
  }
);

export default BottomSheet;
