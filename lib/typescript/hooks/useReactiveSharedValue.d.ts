import type { SharedValue } from 'react-native-reanimated';
import type { Primitive } from '../types';
export declare const useReactiveSharedValue: <T>(value: T) => T extends Primitive ? SharedValue<T> : T;
//# sourceMappingURL=useReactiveSharedValue.d.ts.map