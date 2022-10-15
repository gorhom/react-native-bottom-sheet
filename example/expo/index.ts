import { registerRootComponent } from 'expo';

import { enableExperimentalWebImplementation } from 'react-native-gesture-handler';
enableExperimentalWebImplementation(true);

import { enableScreens } from 'react-native-screens';
enableScreens(true);

// @ts-ignore
import { enableLogging } from '@gorhom/bottom-sheet';
enableLogging();

import App from './src/App';

registerRootComponent(App);
