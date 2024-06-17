import { useMemo } from 'react';
import invariant from 'invariant';
import { INITIAL_SNAP_POINT } from '../components/bottomSheet/constants';

/**
 * @todo
 * replace this with `prop-types`.
 */
export const usePropsValidator = ({
  index,
  snapPoints,
  enableDynamicSizing,
  topInset,
  bottomInset
}) => {
  useMemo(() => {
    //#region snap points
    const _snapPoints = snapPoints ? 'value' in snapPoints ? snapPoints.value : snapPoints : [];

    invariant(_snapPoints || enableDynamicSizing, `'snapPoints' was not provided! please provide at least one snap point.`);

    _snapPoints.map(snapPoint => {
      const _snapPoint = typeof snapPoint === 'number' ? snapPoint : parseInt(snapPoint.replace('%', ''), 10);

      invariant(_snapPoint > 0 || _snapPoint === INITIAL_SNAP_POINT, `Snap point '${snapPoint}' is invalid. if you want to allow user to close the sheet, Please use 'enablePanDownToClose' prop.`);
    });

    invariant('value' in _snapPoints || _snapPoints.length > 0 || enableDynamicSizing, `'snapPoints' was provided with no points! please provide at least one snap point.`); //#endregion
    //#region index

    invariant(typeof index === 'number' || typeof index === 'undefined', `'index' was provided but with wrong type ! expected type is a number.`);
    invariant(enableDynamicSizing || (typeof index === 'number' ? index >= -1 && index <= _snapPoints.length - 1 : true), `'index' was provided but out of the provided snap points range! expected value to be between -1, ${_snapPoints.length - 1}`); //#endregion
    //#region insets

    invariant(typeof topInset === 'number' || typeof topInset === 'undefined', `'topInset' was provided but with wrong type ! expected type is a number.`);
    invariant(typeof bottomInset === 'number' || typeof bottomInset === 'undefined', `'bottomInset' was provided but with wrong type ! expected type is a number.`); //#endregion
    // animations
  }, [index, snapPoints, topInset, bottomInset, enableDynamicSizing]);
};
//# sourceMappingURL=usePropsValidator.js.map