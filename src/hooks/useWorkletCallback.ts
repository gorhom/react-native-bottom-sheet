import { useCallback} from 'react';
import * as Reanimated from 'react-native-reanimated';


// @ts-ignore Runtime check if has useWorkletCallback for supporting reanimated v3 and v4 at the same time.
const hasCallbackWorklet = typeof Reanimated?.useWorkletCallback === 'function';
if(!hasCallbackWorklet){
    console.warn('You are using react-native-reanimated v3 please upgrade to v4 as soon as possible.');
}

/**
 * Provide the same functionality that we had in reanimated v3.
 * @param callback
 */
export const useWorkletCallback = hasCallbackWorklet
  ? (Reanimated.useWorkletCallback as <T extends (...args: any[]) => any>(cb: T, deps: readonly unknown[]) => T)
  : function useWorkletCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly unknown[]): T {
      return useCallback((...args: Parameters<T>): ReturnType<T> => {
        'worklet';
        return callback?.(...args);
      }, deps) as T;

    };
