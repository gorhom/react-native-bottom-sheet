import React from 'react';
import { type RefreshControlProps } from 'react-native';
import { type SimultaneousGesture } from 'react-native-gesture-handler';
interface BottomSheetRefreshControlProps extends RefreshControlProps {
    scrollableGesture: SimultaneousGesture;
}
declare function BottomSheetRefreshControlComponent({ onRefresh, scrollableGesture, ...rest }: BottomSheetRefreshControlProps): React.JSX.Element;
declare const BottomSheetRefreshControl: React.MemoExoticComponent<typeof BottomSheetRefreshControlComponent>;
export default BottomSheetRefreshControl;
//# sourceMappingURL=BottomSheetRefreshControl.android.d.ts.map