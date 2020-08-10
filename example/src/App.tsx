import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RootScreen from './screens/Root';
import NavigatorExampleScreen from './screens/NavigatorExample';
import {
  FlatListExampleScreen,
  SectionListExampleScreen,
  ScrollViewExampleScreen,
  ViewExampleScreen,
} from './screens/BasicExamples';
import BasicExampleScreen from './screens/BasicExample';
import { AppStackParamsList } from './types';

const Stack = createStackNavigator<AppStackParamsList>();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="NavigatorExample">
        <Stack.Screen name="BasicExample" component={BasicExampleScreen} />
        <Stack.Screen
          name="Root"
          component={RootScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NavigatorExample"
          component={NavigatorExampleScreen}
        />
        <Stack.Screen
          name="FlatListExample"
          component={FlatListExampleScreen}
        />
        <Stack.Screen
          name="SectionListExample"
          component={SectionListExampleScreen}
        />
        <Stack.Screen
          name="ScrollViewExample"
          component={ScrollViewExampleScreen}
        />
        <Stack.Screen name="ViewExample" component={ViewExampleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
