import { registerRootComponent } from 'expo';

import { enableScreens } from 'react-native-screens';
enableScreens(true);

// @ts-ignore
import { enableLogging } from '@gorhom/bottom-sheet';
enableLogging();

import App from './src/App';

registerRootComponent(App);
