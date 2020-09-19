import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamsList } from './types';

const Stack = createStackNavigator<AppStackParamsList>();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Root">
        <Stack.Screen
          name="Root"
          getComponent={() => require('./screens/Root').default}
          options={{ headerShown: false }}
        />
        {/* basic examples */}
        <Stack.Screen
          name="FlatListExample"
          getComponent={() =>
            require('./screens/BasicExamples').FlatListExampleScreen
          }
        />
        <Stack.Screen
          name="SectionListExample"
          getComponent={() =>
            require('./screens/BasicExamples').SectionListExampleScreen
          }
        />
        <Stack.Screen
          name="ScrollViewExample"
          getComponent={() =>
            require('./screens/BasicExamples').ScrollViewExampleScreen
          }
        />
        <Stack.Screen
          name="ViewExample"
          getComponent={() =>
            require('./screens/BasicExamples').ViewExampleScreen
          }
        />
        {/* advanced examples */}
        <Stack.Screen
          name="NavigatorExample"
          getComponent={() => require('./screens/NavigatorExample').default}
        />
        <Stack.Screen
          name="CustomHandleExample"
          getComponent={() => require('./screens/CustomHandleExample').default}
        />
        <Stack.Screen
          name="ShadowOverlayExample"
          getComponent={() => require('./screens/ShadowOverlayExample').default}
        />
        <Stack.Screen
          name="MapExample"
          options={{
            headerShown: false,
          }}
          getComponent={() => require('./screens/MapExample').default}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
