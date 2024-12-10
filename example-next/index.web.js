import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});
