import React from 'react';
import Animated from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../constants';
import type { Scrollable } from '../types';
export declare const useScrollableSetter: (ref: React.RefObject<Scrollable>, type: SCROLLABLE_TYPE, contentOffsetY: Animated.SharedValue<number>, refreshable: boolean, useFocusHook?: typeof React.useEffect) => void;
