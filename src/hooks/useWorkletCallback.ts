import { useCallback } from 'react';
import * as Reanimated from 'react-native-reanimated';
import {IS_REANIMATED_V4} from "../components/bottomSheet/constants";


// @ts-ignore runtime check if has useWorkletCallback for supporting reanimated v3 and v4 at the same time.
if (!IS_REANIMATED_V4) {
    console.warn('You are using react-native-reanimated v3 please upgrade to v4 as soon as possible.');
}

/**
 * Provide the same functionality that we had in reanimated v3.
 * @param callback
 */
export const useWorkletCallback = !IS_REANIMATED_V4
  ? (Reanimated.useWorkletCallback as <T extends (...args: any[]) => any>(cb: T, deps: readonly unknown[]) => T)
  : useCallback;
