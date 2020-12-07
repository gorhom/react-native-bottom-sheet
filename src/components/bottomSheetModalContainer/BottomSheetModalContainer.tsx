import React, {
  useCallback,
  useImperativeHandle,
  useState,
  useRef,
  forwardRef,
  ReactNode,
  createRef,
  RefObject,
  memo,
  useMemo,
} from 'react';
import { Dimensions } from 'react-native';
import isEqual from 'lodash.isequal';
import BottomSheetModal from '../bottomSheetModal';
import type { BottomSheetModalConfigs } from '../../types';
import type { BottomSheetModalContextType } from '../../contexts/modal';
import BottomSheetContainer from '../bottomSheetContainer';

type BottomSheetModalContainer = BottomSheetModalContextType;

type BottomSheetItem = {
  ref: RefObject<BottomSheetModal>;
  content: ReactNode;
  configs: BottomSheetModalConfigs;
};

const { height: windowHeight } = Dimensions.get('window');

const BottomSheetModalContainerComponent = forwardRef<
  BottomSheetModalContainer,
  {}
>((_, ref) => {
  //#region state
  const [sheets, setSheets] = useState<Record<string, BottomSheetItem>>({});
  const [containerHeight, setContainerHeight] = useState(windowHeight);
  //#endregion

  //#region refs
  const currentPresentedSheet = useRef<string>(null);
  const previousPresentedSheet = useRef<string[]>([]);
  const didHandleRestorePreviousSheet = useRef(false);
  //#endregion

  //#region methods
  const unmountSheet = useCallback(
    (uniqueId: string) => {
      /**
       * dismissing the current sheet
       */
      if (uniqueId === currentPresentedSheet.current) {
        /**
         * no previous sheets presented.
         */
        if (previousPresentedSheet.current.length === 0) {
          // @ts-ignore
          currentPresentedSheet.current = null;
        } else if (previousPresentedSheet.current.length > 0) {
          // @ts-ignore
          currentPresentedSheet.current = previousPresentedSheet.current[0];
          previousPresentedSheet.current.splice(0, 1);

          if (!didHandleRestorePreviousSheet.current) {
            sheets[
              currentPresentedSheet.current
            ].ref.current?.restoreSheetPosition();
          }
          didHandleRestorePreviousSheet.current = false;
        }
      } else {
        /**
         * dismissing a sheet in the background.
         */
        const sheetIndex = previousPresentedSheet.current.indexOf(uniqueId);
        previousPresentedSheet.current.splice(sheetIndex, 1);
      }

      setSheets(_sheets =>
        Object.keys(_sheets).reduce((object, key) => {
          if (key !== uniqueId) {
            object[key] = _sheets[key];
          }
          return object;
        }, {} as Record<string, BottomSheetItem>)
      );
    },
    [sheets]
  );
  const handleSnapTo = useCallback(
    (uniqueId: string, index: number) => {
      if (sheets[uniqueId]) {
        sheets[uniqueId].ref.current?.snapTo(index);
      }
    },
    [sheets]
  );
  const handleExpand = useCallback(
    (uniqueId: string) => {
      if (sheets[uniqueId]) {
        sheets[uniqueId].ref.current?.expand();
      }
    },
    [sheets]
  );
  const handleCollapse = useCallback(
    (uniqueId: string) => {
      if (sheets[uniqueId]) {
        sheets[uniqueId].ref.current?.collapse();
      }
    },
    [sheets]
  );
  const handlePresent = useCallback(
    (
      uniqueId: string,
      content: ReactNode,
      configs: BottomSheetModalConfigs
    ) => {
      if (!sheets[uniqueId]) {
        if (currentPresentedSheet.current) {
          // collapse current sheet
          sheets[
            currentPresentedSheet.current
          ].ref.current?.temporaryCloseSheet();
          // @ts-ignore
          previousPresentedSheet.current = [
            currentPresentedSheet.current,
            ...previousPresentedSheet.current,
          ];
        }

        // @ts-ignore
        currentPresentedSheet.current = uniqueId;
        setSheets(state => ({
          ...state,
          [uniqueId]: {
            ref: createRef(),
            content,
            configs: { ...configs, containerHeight },
          },
        }));
      }
    },
    [sheets, containerHeight]
  );
  const handleDismiss = useCallback(
    (uniqueId: string) => {
      if (sheets[uniqueId]) {
        sheets[uniqueId].ref.current?.close();

        /**
         * dismissing the current sheet
         */
        if (
          uniqueId === currentPresentedSheet.current &&
          previousPresentedSheet.current.length > 0
        ) {
          didHandleRestorePreviousSheet.current = true;
          sheets[
            previousPresentedSheet.current[0]
          ].ref.current?.restoreSheetPosition();
        }
      }
    },
    [sheets]
  );
  const handleDismissAll = useCallback(() => {
    Object.keys(sheets).map(key => {
      sheets[key].ref.current!.close();
    });
  }, [sheets]);
  //#endregion

  //#region callback
  const handleOnContainerMeasureHeight = useCallback((height: number) => {
    setContainerHeight(height);
  }, []);
  //#endregion

  //#region expose public methods
  useImperativeHandle(ref, () => ({
    present: handlePresent,
    dismiss: handleDismiss,
    dismissAll: handleDismissAll,
    snapTo: handleSnapTo,
    expand: handleExpand,
    collapse: handleCollapse,
  }));
  //#endregion

  //#region renders
  const renderSheets = useMemo(() => {
    return Object.keys(sheets).map(key => (
      <BottomSheetModal
        key={key}
        ref={sheets[key].ref}
        content={sheets[key].content}
        configs={sheets[key].configs}
        unmount={() => unmountSheet(key)}
      />
    ));
  }, [sheets, unmountSheet]);
  return (
    <BottomSheetContainer
      shouldMeasureHeight={true}
      onMeasureHeight={handleOnContainerMeasureHeight}
      children={renderSheets}
    />
  );
  //#endregion
});

const BottomSheetModalContainer = memo(
  BottomSheetModalContainerComponent,
  isEqual
);

export default BottomSheetModalContainer;
