import 'react-native-gesture-handler';

import { enableScreens } from 'react-native-screens';
enableScreens(true);

import { AppRegistry, LogBox } from 'react-native';
import App from './src/Dev';
import { name as appName } from './app.json';

LogBox.ignoreLogs(['react-native-maps']);

AppRegistry.registerComponent(appName, () => App);
