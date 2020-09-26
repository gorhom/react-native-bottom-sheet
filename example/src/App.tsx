import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { AppStackParamsList } from './types';

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
        {/* static examples */}
        <Stack.Screen
          name="Static/FlatListExample"
          getComponent={() =>
            require('./screens/static/BasicExamples').FlatListExampleScreen
          }
        />
        <Stack.Screen
          name="Static/SectionListExample"
          getComponent={() =>
            require('./screens/static/BasicExamples').SectionListExampleScreen
          }
        />
        <Stack.Screen
          name="Static/ScrollViewExample"
          getComponent={() =>
            require('./screens/static/BasicExamples').ScrollViewExampleScreen
          }
        />
        <Stack.Screen
          name="Static/ViewExample"
          getComponent={() =>
            require('./screens/static/BasicExamples').ViewExampleScreen
          }
        />
        {/* modal examples */}
        <Stack.Screen
          name="Modal/SimpleExample"
          getComponent={() => require('./screens/modal/SimpleExample').default}
        />
        <Stack.Screen
          name="Modal/OverlayExample"
          getComponent={() => require('./screens/modal/OverlayExample').default}
        />
        <Stack.Screen
          name="Modal/MultipleExample"
          getComponent={() =>
            require('./screens/modal/MultipleExample').default
          }
        />
        {/* advanced examples */}
        <Stack.Screen
          name="Advanced/NavigatorExample"
          getComponent={() =>
            require('./screens/advanced/NavigatorExample').default
          }
        />
        <Stack.Screen
          name="Advanced/CustomHandleExample"
          getComponent={() =>
            require('./screens/advanced/CustomHandleExample').default
          }
        />
        <Stack.Screen
          name="Advanced/OverlayExample"
          getComponent={() =>
            require('./screens/advanced/OverlayExample').default
          }
        />
        <Stack.Screen
          name="Advanced/MapExample"
          options={{
            headerShown: false,
          }}
          getComponent={() => require('./screens/advanced/MapExample').default}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
