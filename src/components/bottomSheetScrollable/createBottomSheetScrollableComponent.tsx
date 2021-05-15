import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import { useScrollableInternal, useBottomSheetInternal } from '../../hooks';
import { styles } from './styles';

export function createBottomSheetScrollableComponent<T, P>(
  ScrollableComponent: any
) {
  return forwardRef<T, P>((props, ref) => {
    // props
    const {
      focusHook: useFocusHook = useEffect,
      overScrollMode = 'never',
      ...rest
    }: any = props;

    //#region refs
    const nativeGestureRef = useRef<NativeViewGestureHandler>(null);
    //#endregion

    //#region hooks
    const {
      scrollableRef,
      scrollableAnimatedProps,
      handleScrollEvent,
      handleSettingScrollable,
    } = useScrollableInternal();
    const { enableContentPanningGesture } = useBottomSheetInternal();
    //#endregion

    //#region effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollableRef.current);
    useFocusHook(handleSettingScrollable);
    //#endregion

    //#region render
    return (
      <BottomSheetDraggableView
        nativeGestureRef={nativeGestureRef}
        style={styles.container}
      >
        <NativeViewGestureHandler
          ref={nativeGestureRef}
          enabled={enableContentPanningGesture}
          shouldCancelWhenOutside={false}
        >
          <ScrollableComponent
            {...rest}
            // @ts-ignore
            ref={scrollableRef}
            overScrollMode={overScrollMode}
            scrollEventThrottle={16}
            onScrollBeginDrag={handleScrollEvent}
            animatedProps={scrollableAnimatedProps}
          />
        </NativeViewGestureHandler>
      </BottomSheetDraggableView>
    );
    //#endregion
  });
}
