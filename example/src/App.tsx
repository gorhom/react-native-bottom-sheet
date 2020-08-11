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
import CustomHandleExampleScreen from './screens/CustomHandleExample';
import ShadowOverlayExampleScreen from './screens/ShadowOverlayExample';
import MapExampleScreen from './screens/MapExample';
import { AppStackParamsList } from './types';

const Stack = createStackNavigator<AppStackParamsList>();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Root">
        <Stack.Screen
          name="Root"
          component={RootScreen}
          options={{ headerShown: false }}
        />
        {/* basic examples */}
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
        {/* advanced examples */}
        <Stack.Screen
          name="NavigatorExample"
          component={NavigatorExampleScreen}
        />
        <Stack.Screen
          name="CustomHandleExample"
          component={CustomHandleExampleScreen}
        />
        <Stack.Screen
          name="ShadowOverlayExample"
          component={ShadowOverlayExampleScreen}
        />
        <Stack.Screen
          name="MapExample"
          options={{
            headerShown: false,
          }}
          component={MapExampleScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
