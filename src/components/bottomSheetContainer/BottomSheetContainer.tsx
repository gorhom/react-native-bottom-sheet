import React, {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import isEqual from 'lodash.isequal';
import invariant from 'invariant';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { useTapGestureHandler } from 'react-native-redash';
import BottomSheetView from '../bottomSheet';
import ContentWrapper from '../contentWrapper';
import type { BottomSheetMethods } from '../../types';
import type { BottomSheetContainerProps } from './types';
import { styles } from './styles';

type BottomSheet = BottomSheetMethods;

const BottomSheetContainerComponent = forwardRef<
  BottomSheet,
  BottomSheetContainerProps
>(({ height: _height, ...rest }, ref) => {
  //#region validate props
  invariant(
    typeof _height === 'number' || typeof _height === 'undefined',
    `'height' was provided but with wrong type ! expected type is a number or undefined.`
  );
  //#endregion

  //#region state
  const [containerHeight, setContainerHeight] = useState(-1);
  //#endregion

  //#region refs
  const containerTapGestureRef = useRef<TapGestureHandler>(null);
  //#endregion

  //#region variables
  const height = useMemo(
    () => (_height !== undefined ? _height : containerHeight),
    [_height, containerHeight]
  );
  //#endregion

  //#region gestures
  const {
    state: containerTapGestureState,
    gestureHandler: containerTapGestureHandler,
  } = useTapGestureHandler();
  //#endregion

  //#region callbacks
  const handleContainerOnLayout = useCallback(
    ({ nativeEvent: { layout } }) => {
      if (_height === undefined) {
        setContainerHeight(layout.height);
      }
    },
    [_height]
  );
  //#endregion

  //#region render
  return (
    <ContentWrapper
      ref={containerTapGestureRef}
      style={styles.container}
      onLayout={_height === undefined ? handleContainerOnLayout : undefined}
      {...containerTapGestureHandler}
    >
      <BottomSheetView
        {...rest}
        ref={ref}
        containerHeight={height}
        containerTapGestureRef={containerTapGestureRef}
        containerTapGestureState={containerTapGestureState}
      />
    </ContentWrapper>
  );
  //#endregion
});

const BottomSheet = memo(BottomSheetContainerComponent, isEqual);

export default BottomSheet;
