
import {useCallback} from 'react';
import * as Reanimated from 'react-native-reanimated';

type Callback<T extends unknown[], R> = (...args: T) => R;

// @ts-ignore Runtime check if has useWorkletCallback for supporting reanimated v3 and v4 at the same time.
const hasCallbackWorklet = typeof Reanimated?.useWorkletCallback === 'function';

/**
 * Provide the same functionality that we had in reanimated v3.
 * @param callback
 */
export const useWorkletCallback = hasCallbackWorklet ? Reanimated.useWorkletCallback :
    function useWorkletCallback<T extends unknown[], R>(callback: Callback<T, R>){
        return useCallback<Callback<T, R | undefined>>((...args) => {
            'worklet';
            return callback?.(...args);
        }, []);
    };
