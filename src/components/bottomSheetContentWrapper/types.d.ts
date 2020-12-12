import type {
  RefAttributes,
  ReactNode,
  ForwardRefExoticComponent,
} from 'react';
import type { TapGestureHandler } from 'react-native-gesture-handler';

export type BottomSheetContentWrapperProps = {
  children: ReactNode;
  onHandlerStateChange: (...args: any[]) => void;
  onGestureEvent: (...args: any[]) => void;
};

export type BottomSheetContentWrapper = ForwardRefExoticComponent<
  BottomSheetContentWrapperProps & RefAttributes<TapGestureHandler>
>;
