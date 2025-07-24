import {useCallback} from 'react';
type Callback<T extends unknown[], R> = (...args: T) => R;

/**
 * Provide the same functionality that we had in reanimated v3.
 * @param callback
 */
export function useWorkletCallback<T extends unknown[], R>(callback: Callback<T, R>){
    return useCallback<Callback<T, R | undefined>>((...args) => {
        'worklet';
        return callback?.(...args);
    }, []);
}
